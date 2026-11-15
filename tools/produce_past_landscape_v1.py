"""Build source-traced object crops and review artifacts from landscape masters.

The generated visible and clean plates are source artwork; this tool never changes
them. Polygon coordinates are measured on the 1672x941 generation canvas and
scaled to the delivered 1920x1080 coordinate system.
"""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ROOMS = PUBLIC / "assets/rooms/past"
REVIEWS = ROOT / "docs/visual-validation/past-landscape-v1"
W, H = 1920, 1080
SX, SY = W / 1672, H / 941

# Boundary traces include each physical station and its immediate contact shadow.
# Shared architectural housings in Data Analysis meet along one common edge.
ROOMS_SPEC = {
    "manufacturing": {
        "source": "01_Manufacturing_Materials_1080x1920.png",
        "objects": {
            "materials_structure": [[(145, 343), (558, 343), (558, 752), (390, 779), (85, 775), (85, 646), (112, 644), (112, 530)]],
            "motors_energy": [[(658, 329), (1002, 329), (1010, 706), (968, 723), (695, 723), (657, 706)]],
            "rocket_design": [[(1184, 339), (1548, 338), (1560, 544), (1595, 636), (1590, 768), (1120, 768), (1113, 632), (1160, 630), (1158, 410)]],
        },
        "screens": {"materials_structure": (310, 504, 512, 610), "motors_energy": (732, 546, 947, 648), "rocket_design": (1225, 361, 1530, 659)},
    },
    "mission_target": {
        "source": "02_Mission_Target_1080x1920.png",
        "objects": {
            "mission_objectives": [[(56, 317), (300, 316), (342, 582), (342, 748), (49, 757), (46, 574)]],
            "target_destination": [[(362, 346), (596, 345), (620, 568), (610, 728), (376, 731), (351, 568)]],
            "scientific_priorities": [[(1073, 352), (1292, 347), (1324, 570), (1314, 728), (1074, 726), (1054, 571)]],
            "mission_constraints": [[(1380, 317), (1608, 316), (1629, 570), (1622, 755), (1335, 752), (1334, 571)]],
        },
        "screens": {"mission_objectives": (68, 348, 311, 571), "target_destination": (378, 378, 601, 565), "scientific_priorities": (1071, 379, 1313, 569), "mission_constraints": (1363, 348, 1602, 572)},
    },
    "data_analysis": {
        "source": "03_Data_Analysis_File_Review_1080x1920.png",
        "objects": {
            "mission_files": [[(326, 222), (845, 222), (845, 553), (326, 553)]],
            "dataset_viewer": [[(845, 222), (1356, 222), (1356, 553), (845, 553)]],
            "analysis_console": [[(621, 535), (1053, 535), (1065, 642), (1211, 668), (1227, 820), (1067, 860), (963, 867), (935, 925), (728, 925), (709, 867), (600, 860), (445, 818), (445, 666), (606, 638)]],
        },
        "screens": {"mission_files": (350, 260, 830, 520), "dataset_viewer": (859, 259, 1329, 522), "analysis_console": (625, 547, 1044, 653)},
    },
    "resources_review": {
        "source": "04_Resources_Review_1080x1920.png",
        "objects": {
            "hardware_inventory": [[(132, 184), (479, 183), (499, 343), (489, 434), (133, 435), (112, 342)]],
            "power_energy": [[(111, 438), (488, 437), (505, 625), (504, 746), (110, 752), (103, 628)]],
            "personnel_roles": [[(1195, 183), (1537, 181), (1558, 344), (1543, 435), (1197, 435), (1176, 342)]],
            "supplies_logistics": [[(1195, 438), (1562, 437), (1572, 629), (1560, 751), (1175, 748), (1173, 625)]],
            "resource_allocation": [[(646, 270), (1033, 270), (1047, 555), (1093, 585), (1096, 651), (1030, 801), (649, 802), (575, 650), (576, 584), (627, 553)]],
        },
        "screens": {"hardware_inventory": (145, 205, 477, 344), "power_energy": (123, 465, 481, 607), "personnel_roles": (1200, 206, 1537, 344), "supplies_logistics": (1198, 467, 1554, 610), "resource_allocation": (642, 274, 1037, 586)},
    },
}


def resize_box(box):
    x0, y0, x1, y1 = box
    return tuple(round(v * s) for v, s in zip(box, (SX, SY, SX, SY)))


def draw_mask(polygons):
    mask = Image.new("L", (W, H))
    draw = ImageDraw.Draw(mask)
    for poly in polygons:
        draw.polygon([(round(x * SX), round(y * SY)) for x, y in poly], fill=255)
    return mask


def contain(image, size):
    canvas = Image.new("RGB", size, (9, 15, 27))
    scale = min(size[0] / image.width, size[1] / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    canvas.paste(resized, ((size[0] - resized.width) // 2, (size[1] - resized.height) // 2))
    return canvas


def labeled_sheet(images, labels, columns=2, thumb=(640, 360)):
    rows = (len(images) + columns - 1) // columns
    out = Image.new("RGB", (columns * thumb[0], rows * (thumb[1] + 30)), (13, 20, 32))
    draw = ImageDraw.Draw(out)
    for i, (im, label) in enumerate(zip(images, labels)):
        x, y = (i % columns) * thumb[0], (i // columns) * (thumb[1] + 30)
        out.paste(contain(im.convert("RGB"), thumb), (x, y + 30))
        draw.text((x + 8, y + 8), label, fill="white")
    return out


def build_room(room, spec):
    folder = ROOMS / room / "layers/landscape-v1"
    visible_path = folder / "background/room_visible.png"
    clean_path = folder / "background/room_bg_clean.png"
    visible = Image.open(visible_path).convert("RGB")
    clean = Image.open(clean_path).convert("RGB")
    if visible.size != (W, H) or clean.size != (W, H):
        raise ValueError(f"{room}: landscape master or clean plate is not {W}x{H}")
    portrait_manifest = json.loads((ROOMS / room / "layers/portrait/manifest.json").read_text(encoding="utf-8"))
    originals = {o["id"]: o for o in portrait_manifest["objects"]}
    objects = []
    masks = []
    isolation = []
    for z, (object_id, polygons) in enumerate(spec["objects"].items(), 1):
        mask = draw_mask(polygons)
        bbox = mask.getbbox()
        assert bbox
        x0, y0, x1, y1 = bbox
        mask_crop = mask.crop(bbox)
        object_folder = folder / object_id
        object_folder.mkdir(parents=True, exist_ok=True)
        sbox = resize_box(spec["screens"][object_id])
        sx0, sy0, sx1, sy1 = sbox
        screen_mask = Image.new("L", (W, H))
        ImageDraw.Draw(screen_mask).rectangle(sbox, fill=255)
        screen_mask = ImageChops.darker(screen_mask, mask).crop(bbox)
        base_mask = ImageChops.subtract(mask_crop, screen_mask)
        source_crop = visible.crop(bbox).convert("RGB")
        rgba = Image.composite(source_crop, Image.new("RGB", source_crop.size), base_mask).convert("RGBA")
        rgba.putalpha(base_mask)
        rgba.save(object_folder / f"{object_id}_base.png", optimize=True)
        mask_crop.save(object_folder / f"{object_id}_mask.png", optimize=True)
        edge = ImageChops.subtract(mask_crop.filter(ImageFilter.MaxFilter(21)), mask_crop)
        glow_alpha = edge.filter(ImageFilter.GaussianBlur(6)).point(lambda v: round(v * 0.35))
        glow = Image.new("RGBA", rgba.size, (255, 179, 87, 0))
        glow.putalpha(glow_alpha)
        glow.save(object_folder / f"{object_id}_glow.png", optimize=True)
        screen = Image.composite(source_crop, Image.new("RGB", source_crop.size), screen_mask).convert("RGBA")
        screen.putalpha(screen_mask)
        screen.save(object_folder / f"{object_id}_screen.png", optimize=True)
        base_url = f"/assets/rooms/past/{room}/layers/landscape-v1/{object_id}/{object_id}"
        old = originals[object_id]
        assets = {key: base_url + f"_{key}.png" for key in ("base", "mask", "glow", "screen")}
        if room == "resources_review" and object_id in ("personnel_roles", "supplies_logistics"):
            assets["closeup"] = f"/assets/rooms/past/{room}/layers/landscape-v1/closeups/{object_id}.png"
        objects.append({
            "id": object_id,
            "sourceArt": f"/assets/rooms/past/{room}/layers/landscape-v1/background/room_visible.png",
            "sourceProvenance": {"portrait": portrait_manifest["sourceArt"], "method": "reference_guided_landscape_recreation_and_traced_polygon"},
            "position": {"x": x0, "y": y0, "width": x1 - x0, "height": y1 - y0},
            "zIndex": z,
            "assets": assets,
            "interaction": {"target": old["interaction"]["target"], "label": old["interaction"]["label"], "mask": base_url + "_mask.png"},
            "states": old["states"],
            "extractionMode": "polygon_traced",
            "cleanPlateExtractionComplete": False,
            "designerCleanupRequired": True,
        })
        masks.append(mask)
        isolation.append(Image.alpha_composite(rgba, screen))
    manifest = {
        "version": 1, "roomId": room, "timeline": "past", "variant": "landscape-v1",
        "sourceArt": f"/assets/rooms/past/{room}/layers/landscape-v1/background/room_visible.png",
        "coordinateSystem": {"width": W, "height": H},
        "background": f"/assets/rooms/past/{room}/layers/landscape-v1/background/room_bg_clean.png",
        "objects": objects,
    }
    (folder / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    overlay = visible.convert("RGBA")
    colors = [(255, 190, 65), (70, 226, 255), (255, 100, 145), (150, 255, 130), (195, 140, 255)]
    for i, mask in enumerate(masks):
        color = Image.new("RGBA", (W, H), (*colors[i], 0))
        color.putalpha(mask.point(lambda v: round(v * .35)))
        overlay = Image.alpha_composite(overlay, color)
    review = REVIEWS / room
    review.mkdir(parents=True, exist_ok=True)
    overlay.convert("RGB").save(review / "mask_overlay.webp", quality=88, method=6)
    composite = clean.convert("RGBA")
    for obj in objects:
        path = PUBLIC / obj["assets"]["base"].lstrip("/")
        rgba = Image.open(path).convert("RGBA")
        composite.alpha_composite(rgba, (obj["position"]["x"], obj["position"]["y"]))
        screen_path = PUBLIC / obj["assets"]["screen"].lstrip("/")
        composite.alpha_composite(Image.open(screen_path).convert("RGBA"), (obj["position"]["x"], obj["position"]["y"]))
    composite.convert("RGB").save(review / "final_composite.webp", quality=88, method=6)
    labeled_sheet(isolation, list(spec["objects"]), columns=2, thumb=(640, 360)).save(review / "object_isolation.webp", quality=86, method=6)
    hover_images = []
    for obj in objects:
        hovered = composite.copy()
        glow_path = PUBLIC / obj["assets"]["glow"].lstrip("/")
        hovered.alpha_composite(Image.open(glow_path).convert("RGBA"), (obj["position"]["x"], obj["position"]["y"]))
        hover_images.append(hovered)
    labeled_sheet(hover_images, list(spec["objects"]), columns=2, thumb=(640, 360)).save(review / "hover_focus_review.webp", quality=86, method=6)
    full_clean_path = folder / "background/room_bg_clean_full_candidate.png"
    if full_clean_path.is_file():
        full_clean = Image.open(full_clean_path).convert("RGB")
        labeled_sheet([clean, full_clean], ["exact idle recomposition: seam defects", "full reconstructed candidate: alignment differs"], columns=2).save(review / "clean_plate_compare.webp", quality=86, method=6)
    for size in [(1920, 1080), (1366, 768), (915, 412), (800, 360)]:
        contain(composite.convert("RGB"), size).save(review / f"preview_{size[0]}x{size[1]}.webp", quality=86, method=6)
    return visible, clean, composite.convert("RGB")


def main():
    all_images = []
    for room, spec in ROOMS_SPEC.items():
        visible, clean, composite = build_room(room, spec)
        all_images.append(visible)
        portrait = Image.open(ROOMS / "sources" / spec["source"])
        labeled_sheet([portrait, visible], [f"{room}: original portrait", f"{room}: landscape candidate A"], columns=2).save(REVIEWS / room / "source_comparison.webp", quality=86, method=6)
    labeled_sheet(all_images, list(ROOMS_SPEC), columns=2).save(REVIEWS / "final_art_contact.webp", quality=86, method=6)
    portraits = [Image.open(ROOMS / "sources" / s["source"]) for s in ROOMS_SPEC.values()]
    comparisons = []
    labels = []
    for room, p, v in zip(ROOMS_SPEC, portraits, all_images):
        comparisons.extend((p, v))
        labels.extend((room + " portrait", room + " landscape"))
    labeled_sheet(comparisons, labels, columns=2).save(REVIEWS / "portrait_landscape_contact.webp", quality=86, method=6)


if __name__ == "__main__":
    main()
