"""Validate delivered landscape and Present review assets without claiming art approval."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops, ImageStat

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
REVIEWS = ROOT / "docs/visual-validation/past-landscape-v1"
SOURCES = {
    "manufacturing": ("01_Manufacturing_Materials_1080x1920.png", "BCD0404CBCE74AC5137AA00395ED1119844FE28D091B7578553B7FC243A767BB"),
    "mission_target": ("02_Mission_Target_1080x1920.png", "F6F5A90DC73C5690C515EC444E2ED9C4B080C8115FEE4F50104066C2AFB335EE"),
    "data_analysis": ("03_Data_Analysis_File_Review_1080x1920.png", "0384FCDDEED42C7D9F00A39B746FEDDE29AE5BC2D3E414009C400111B605D58D"),
    "resources_review": ("04_Resources_Review_1080x1920.png", "7D10ACD8D7F9EC3B93AFF3ECDB9C17785F7AAC1B7E28CB1D2CF304F841CBABBE"),
}
EXPECTED = {
    "manufacturing": {"materials_structure", "motors_energy", "rocket_design"},
    "mission_target": {"mission_objectives", "target_destination", "scientific_priorities", "mission_constraints"},
    "data_analysis": {"mission_files", "dataset_viewer", "analysis_console"},
    "resources_review": {"hardware_inventory", "power_energy", "personnel_roles", "supplies_logistics", "resource_allocation"},
}
PREVIEWS = [(1920, 1080), (1366, 768), (915, 412), (800, 360)]


def check_image(path, expected=None):
    with Image.open(path) as image:
        image.load()
        if expected and image.size != expected:
            raise ValueError(f"{path}: {image.size} != {expected}")
        return {"width": image.width, "height": image.height, "mode": image.mode, "bytes": path.stat().st_size}


def url_path(url):
    if not url.startswith("/assets/"):
        raise ValueError(f"Invalid public asset URL: {url}")
    path = PUBLIC / url.lstrip("/")
    if not path.is_file():
        raise FileNotFoundError(path)
    return path


def error_stats(a, b):
    d = ImageChops.difference(a.convert("RGB"), b.convert("RGB"))
    stat = ImageStat.Stat(d)
    return {"mae_rgb": round(sum(stat.mean) / 3, 5), "max_channel_error": max(channel[1] for channel in stat.extrema)}


def validate_room(room):
    file, expected_hash = SOURCES[room]
    source = PUBLIC / "assets/rooms/past/sources" / file
    source_hash = hashlib.sha256(source.read_bytes()).hexdigest().upper()
    if source_hash != expected_hash:
        raise ValueError(f"{room}: original source SHA-256 changed")
    check_image(source, (1080, 1920))
    folder = PUBLIC / "assets/rooms/past" / room / "layers/landscape-v1"
    manifest = json.loads((folder / "manifest.json").read_text(encoding="utf-8"))
    if manifest["coordinateSystem"] != {"width": 1920, "height": 1080}:
        raise ValueError(f"{room}: incorrect coordinate system")
    if {o["id"] for o in manifest["objects"]} != EXPECTED[room]:
        raise ValueError(f"{room}: missing or unexpected object ID")
    visible_path = url_path(manifest["sourceArt"])
    clean_path = url_path(manifest["background"])
    visible = Image.open(visible_path).convert("RGB")
    clean = Image.open(clean_path).convert("RGB")
    image_checks = {
        "visible": check_image(visible_path, (1920, 1080)),
        "runtime_webp": check_image(folder / "background/room_visible.webp", (1920, 1080)),
        "clean": check_image(clean_path, (1920, 1080)),
        "full_clean_candidate": check_image(folder / "background/room_bg_clean_full_candidate.png", (1920, 1080)),
    }
    composite = clean.convert("RGBA")
    details = []
    for obj in sorted(manifest["objects"], key=lambda o: o["zIndex"]):
        x, y, w, h = (obj["position"][key] for key in ("x", "y", "width", "height"))
        if min(x, y) < 0 or min(w, h) <= 0 or x + w > 1920 or y + h > 1080:
            raise ValueError(f"{room}/{obj['id']}: object out of bounds")
        if obj["states"] != ["idle", "hover", "focus", "touch"]:
            raise ValueError(f"{room}/{obj['id']}: incorrect state list")
        if not obj["interaction"]["target"] or not obj["interaction"]["label"]:
            raise ValueError(f"{room}/{obj['id']}: missing interaction contract")
        sizes = {}
        for kind, url in obj["assets"].items():
            sizes[kind] = check_image(url_path(url), None if kind == "closeup" else (w, h))
        if obj["interaction"]["mask"] != obj["assets"]["mask"]:
            raise ValueError(f"{room}/{obj['id']}: interaction mask mismatch")
        base = Image.open(url_path(obj["assets"]["base"])).convert("RGBA")
        screen = Image.open(url_path(obj["assets"]["screen"])).convert("RGBA")
        mask = Image.open(url_path(obj["assets"]["mask"])).convert("L")
        combined_alpha = ImageChops.lighter(base.getchannel("A"), screen.getchannel("A"))
        if ImageChops.difference(combined_alpha, mask).getbbox():
            raise ValueError(f"{room}/{obj['id']}: base/screen alpha differs from hit mask")
        if ImageChops.darker(base.getchannel("A"), screen.getchannel("A")).getbbox():
            raise ValueError(f"{room}/{obj['id']}: base and screen overlap")
        if not mask.getbbox():
            raise ValueError(f"{room}/{obj['id']}: empty mask")
        composite.alpha_composite(base, (x, y))
        composite.alpha_composite(screen, (x, y))
        details.append({"id": obj["id"], "position": obj["position"], "files": sizes})
    diff = error_stats(visible, composite)
    preview_checks = {}
    for size in PREVIEWS:
        path = REVIEWS / room / f"preview_{size[0]}x{size[1]}.webp"
        preview_checks[path.name] = check_image(path, size)
    result = {
        "room": room,
        "source_sha256": source_hash,
        "manifest": str((folder / "manifest.json").relative_to(ROOT)).replace("\\", "/"),
        "file_and_contract_status": "PASS",
        "idle_recomposition_status": "PASS" if diff["max_channel_error"] == 0 else "FAIL",
        "idle_recomposition": diff,
        "clean_plate_visual_status": "FAIL",
        "full_clean_candidate_visual_status": "NOT VERIFIED",
        "mask_visual_status": "FAIL",
        "art_review_note": "Manual inspection found hard donor seams or exposed equipment remnants in the hidden plate, and polygon masks include adjacent architecture.",
        "images": image_checks,
        "objects": details,
        "previews": preview_checks,
    }
    return result


def present_check(room):
    old_manifest = json.loads((PUBLIC / f"assets/rooms/{room}/layers/original/manifest.json").read_text(encoding="utf-8"))
    new_manifest = json.loads((PUBLIC / f"assets/rooms/{room}/layers/clean-v2/manifest.json").read_text(encoding="utf-8"))
    source = Image.open(url_path(old_manifest["sourceArt"])).convert("RGB")
    old = check_image(url_path(old_manifest["background"]), source.size)
    new = check_image(url_path(new_manifest["background"]), source.size)
    exact_path = PUBLIC / f"assets/rooms/{room}/layers/clean-v2/background/room_bg_exact_recompose.png"
    exact_info = check_image(exact_path, source.size)
    def recompose(plate):
        composite = Image.open(plate).convert("RGBA")
        for obj in sorted(new_manifest["objects"], key=lambda o: o["zIndex"]):
            x, y = obj["position"]["x"], obj["position"]["y"]
            composite.alpha_composite(Image.open(url_path(obj["assets"]["base"])).convert("RGBA"), (x, y))
            if "screen" in obj["assets"]:
                composite.alpha_composite(Image.open(url_path(obj["assets"]["screen"])).convert("RGBA"), (x, y))
        return error_stats(source, composite)
    diff = recompose(url_path(new_manifest["background"]))
    exact_diff = recompose(exact_path)
    return {
        "room": room,
        "old_clean": old,
        "new_clean_candidate": new,
        "exact_recompose_candidate": exact_info,
        "exact_recompose_result": exact_diff,
        "idle_recomposition_status": "PASS" if diff["max_channel_error"] == 0 else "FAIL",
        "idle_recomposition": diff,
        "clean_plate_visual_status": "NOT VERIFIED",
        "integration_status": "BLOCKED",
        "note": "Versioned alternative only; source artwork remains the runtime fallback."
    }


def main():
    results = {"past": {}, "present": {}}
    for room in SOURCES:
        results["past"][room] = validate_room(room)
    for room in ("archive", "signal", "recordings"):
        results["present"][room] = present_check(room)
    REVIEWS.mkdir(parents=True, exist_ok=True)
    (REVIEWS / "qa_report.json").write_text(json.dumps(results, indent=2) + "\n", encoding="utf-8")
    for section in results.values():
        for room, result in section.items():
            print(room, result["file_and_contract_status"] if "file_and_contract_status" in result else "files PASS", "recompose", result["idle_recomposition_status"], "MAE", result["idle_recomposition"]["mae_rgb"], "clean", result["clean_plate_visual_status"])


if __name__ == "__main__":
    main()
