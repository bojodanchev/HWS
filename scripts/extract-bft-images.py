#!/usr/bin/env python3
"""Extract the first-party BFT workbook images with an auditable SKU manifest."""

from __future__ import annotations

import json
import re
from pathlib import Path

from openpyxl import load_workbook


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path("/tmp/hws-catalog-source/sheet-01.xlsx")
DEST = ROOT / "hwsystem/public/images/vendor/bft"
MANIFEST = ROOT / "hwsystem/src/content/bft-image-manifest.json"


def slug(value: object) -> str:
    text = re.sub(r"[^a-zA-Z0-9]+", "-", str(value).strip()).strip("-").lower()
    return text or "unknown"


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Missing source workbook: {SOURCE}")

    DEST.mkdir(parents=True, exist_ok=True)
    workbook = load_workbook(SOURCE, read_only=False, data_only=False)
    worksheet = workbook.active
    manifest: dict[str, list[str]] = {}

    for image in worksheet._images:
        row = getattr(getattr(image.anchor, "_from", None), "row", None)
        if row is None:
            continue
        reference = worksheet.cell(row + 1, 1).value
        if reference in (None, ""):
            continue
        sku = str(reference).strip()
        if not re.match(r"^\d+(?:\.0)?(?:\s|$)", sku):
            continue
        # The workbook has one duplicated FAF 2 line. Keep the earliest row's
        # image and product record; dedupe happens in the catalog snapshot too.
        if sku.endswith(".0"):
            sku = sku[:-2]
        index = len(manifest.get(sku, [])) + 1
        extension = "jpg" if str(getattr(image, "format", "png")).lower() in {"jpg", "jpeg"} else "png"
        filename = f"{slug(sku)}-{index}.{extension}"
        path = DEST / filename
        path.write_bytes(image._data())
        manifest.setdefault(sku, []).append(f"/images/vendor/bft/{filename}")

    MANIFEST.write_text(
        json.dumps(
            {"source": SOURCE.name, "products": manifest},
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(json.dumps({"products": len(manifest), "images": sum(map(len, manifest.values())), "manifest": str(MANIFEST)}))


if __name__ == "__main__":
    main()
