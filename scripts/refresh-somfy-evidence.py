"""Read public manufacturer pages; retain only SKU-bound imagery and relationships.

Never import the page's account/logistics/pricing payload into the public catalogue.
Run from the repository root. Existing successful entries are resumed by default.
"""
import concurrent.futures
import datetime
import json
import pathlib
import re
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
DEST = ROOT / 'hwsystem/src/content/somfy-product-evidence.json'

def read(record):
    try:
        req = urllib.request.Request(record['sourceUrl'], headers={'User-Agent': 'HWS catalogue verification/1.0'})
        with urllib.request.urlopen(req, timeout=30) as response:
            html = response.read().decode()
        match = re.search(r'window.__remixContext = (.*?);</script>', html)
        state = json.loads(match[1])['state']['loaderData']
        product = state['routes/_main.$']['product']
        if product['sku'] != record['sku']:
            raise ValueError('Manufacturer SKU mismatch')
        images = [i for i in product.get('sfyImages', []) if i.get('url', '').startswith('https://asset.somfy.com/') and i.get('published') == 'true']
        images.sort(key=lambda i: i.get('mainimage') != 'true')
        def skus(key):
            return sorted({p['sku'] for p in (product.get(key) or []) if isinstance(p, dict) and p.get('sku')})
        return record['sku'], {
            'sourceUrl': record['sourceUrl'],
            'imageUrl': images[0]['url'] if images else None,
            'accessorySkus': skus('sfyAccessories'),
            'compatibleSkus': skus('sfyCompatibilities'),
            'kitContent': product.get('sfyKitContent'),
            'productTypes': [v['value'] for v in (product.get('taxonomies', {}).get('taxo_types_L1') or {}).get('values', [])],
        }
    except Exception as error:
        return record['sku'], {'error': str(error), 'sourceUrl': record['sourceUrl']}

def main():
    records = json.loads((ROOT / 'hwsystem/src/content/vendor-catalog.json').read_text())['products']
    records = [r for r in records if r['source'] == 'somfy-pro-uk']
    existing = json.loads(DEST.read_text())['products'] if DEST.exists() else {}
    pending = [r for r in records if r['sku'] not in existing or existing[r['sku']].get('error')]
    def save():
        DEST.write_text(json.dumps({'retrievedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'products': dict(sorted(existing.items()))}, indent=2) + '\n')
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        for index, (sku, result) in enumerate(pool.map(read, pending), 1):
            existing[sku] = result
            if index % 50 == 0:
                save()
                print(f'{index}/{len(pending)} pages checked', flush=True)
    save()
    print(json.dumps({'records': len(existing), 'images': sum(bool(r.get('imageUrl')) for r in existing.values()), 'errors': sum('error' in r for r in existing.values())}))

if __name__ == '__main__':
    main()
