"""Build versioned Present clean-plate manifests and before/after review sheets."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw

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
    source_art = Image.open(BASE / manifest["sourceArt"].lstrip("/").removeprefix("assets/rooms/")).convert("RGB")
    union = Image.new("L", old.size)
    for obj in manifest["objects"]:
        if obj["extractionMode"] == "overlay_only":
            continue
        mask = Image.open(BASE / obj["assets"]["mask"].lstrip("/").removeprefix("assets/rooms/")).convert("L")
        canvas = Image.new("L", old.size)
        canvas.paste(mask, (obj["position"]["x"], obj["position"]["y"]))
        union = ImageChops.lighter(union, canvas)
    exact = Image.composite(new, source_art, union)
    exact.save(BASE / room / "layers/clean-v2/background/room_bg_exact_recompose.png", optimize=True)
    width, height = old.size
    sheet = Image.new("RGB", (width * 3, height + 38), (11, 20, 32))
    sheet.paste(old, (0, 38))
    sheet.paste(exact, (width, 38))
    sheet.paste(new, (width * 2, 38))
    d = ImageDraw.Draw(sheet)
    d.text((10, 10), f"{room}: old provisional clean plate", fill="white")
    d.text((width + 10, 10), f"{room}: exact recomposition, visible seams", fill="white")
    d.text((width * 2 + 10, 10), f"{room}: full clean candidate, mismatched composite", fill="white")
    REVIEW.mkdir(parents=True, exist_ok=True)
    sheet.save(REVIEW / f"{room}_before_after.webp", quality=88, method=6)
    print(room, old.size, "versioned")
