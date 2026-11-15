"""Build versioned Present clean-plate manifests and before/after review sheets."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "public/assets/rooms"
REVIEW = ROOT / "docs/visual-validation/past-landscape-v1/present-cleanup"

for room in ("archive", "signal", "recordings"):
    source = BASE / room / "layers/original/manifest.json"
    manifest = json.loads(source.read_text(encoding="utf-8"))
    candidate_url = f"/assets/rooms/{room}/layers/clean-v2/background/room_bg_clean_candidate.png"
    manifest["variant"] = "clean-v2-review-candidate"
    manifest["background"] = candidate_url
    manifest["qualityStatus"] = "FAIL"
    manifest["qualityNote"] = "Hidden plate visually improved, but normal recomposition and edge quality still require repair and review."
    for obj in manifest["objects"]:
        obj["cleanPlateExtractionComplete"] = False
        obj["designerCleanupRequired"] = True
    destination = BASE / room / "layers/clean-v2/manifest.json"
    destination.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    old = Image.open(BASE / room / "layers/original/background/room_bg_clean.png").convert("RGB")
    new = Image.open(BASE / candidate_url.lstrip("/").removeprefix("assets/rooms/")).convert("RGB")
    if old.size != new.size:
        raise ValueError(f"{room}: dimensions differ: {old.size} vs {new.size}")
    width, height = old.size
    sheet = Image.new("RGB", (width * 2, height + 38), (11, 20, 32))
    sheet.paste(old, (0, 38))
    sheet.paste(new, (width, 38))
    d = ImageDraw.Draw(sheet)
    d.text((10, 10), f"{room}: old provisional clean plate", fill="white")
    d.text((width + 10, 10), f"{room}: new clean-v2 review candidate", fill="white")
    REVIEW.mkdir(parents=True, exist_ok=True)
    sheet.save(REVIEW / f"{room}_before_after.webp", quality=88, method=6)
    print(room, old.size, "versioned")
