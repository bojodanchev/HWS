"""Materialize reviewed Beninca image URLs. Resume from existing verified files."""
import concurrent.futures
import hashlib
import json
import pathlib
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'hwsystem/src/content/beninca-image-evidence.json'
DEST = ROOT / 'hwsystem/public/images/vendor/beninca'

def download(url):
    if not url.startswith('https://www.beninca.com/images/product/'):
        return url, None, 'Unexpected image host or path'
    name = hashlib.sha256(url.encode()).hexdigest()[:20] + pathlib.Path(url).suffix.lower()
    file = DEST / name
    try:
        if not file.exists():
            request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Accept': 'image/png,image/jpeg,*/*'})
            with urllib.request.urlopen(request, timeout=15) as response:
                data = response.read(6 * 1024 * 1024)
            if len(data) >= 6 * 1024 * 1024 or not (data.startswith(b'\x89PNG') or data.startswith(b'\xff\xd8')):
                raise ValueError('Invalid or oversized product image')
            file.write_bytes(data)
        return url, '/images/vendor/beninca/' + name, None
    except Exception as error:
        return url, None, str(error)

def main():
    DEST.mkdir(parents=True, exist_ok=True)
    manifest = json.loads(MANIFEST.read_text())
    urls = sorted({r['imageUrl'] for r in manifest['products'].values() if r.get('imageUrl')})
    results = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        for index, (url, local, error) in enumerate(pool.map(download, urls), 1):
            results[url] = (local, error)
            if index % 20 == 0:
                print(f'{index}/{len(urls)} image files checked', flush=True)
    for record in manifest['products'].values():
        if record.get('imageUrl'):
            local, error = results[record['imageUrl']]
            if local:
                record['localPath'] = local
                record.pop('downloadError', None)
            elif error:
                record['downloadError'] = error
    MANIFEST.write_text(json.dumps(manifest, indent=2) + '\n')
    print(json.dumps({'uniqueImages': len(urls), 'downloaded': sum(bool(v[0]) for v in results.values()), 'failed': sum(bool(v[1]) for v in results.values())}))

if __name__ == '__main__':
    main()
