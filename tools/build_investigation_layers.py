"""Rebuild raster cutouts from the two immutable designer reference images.

Run with Python 3.12, Pillow, NumPy and OpenCV. Polygon coordinates are in each
source image's native pixel space. No generated pixels enter the object assets.
"""
from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ROOMS = ROOT / 'public/assets/rooms'
OUT = ROOMS / 'investigation/layers'

# Every list is a union of individually traced visible pieces, not a crop box.
SHAPES = {
    'wide': {
        'mission_files': [
            [(383, 267), (555, 285), (565, 316), (564, 547), (399, 570), (390, 535), (389, 323), (380, 311)],
        ],
        'evidence_board': [[(699, 298), (914, 298), (918, 307), (918, 418), (907, 428), (704, 427), (696, 418), (696, 307)]],
        'center_terminal': [
            [(699, 517), (750, 493), (896, 490), (1035, 491), (1170, 492), (1225, 516), (1224, 541), (701, 541)],
            [(707, 540), (1218, 540), (1211, 629), (1088, 632), (1080, 566), (847, 566), (839, 631), (710, 630)],
            [(747, 494), (759, 464), (786, 438), (818, 416), (831, 415), (853, 426), (856, 448), (844, 453), (825, 437), (804, 440), (782, 463), (769, 498)],
        ],
        'center_terminal_screen': [[(1042, 502), (1127, 502), (1139, 518), (1044, 518)]],
        'center_terminal_foreground': [[(925, 493), (991, 491), (1012, 508), (1014, 608), (1025, 646), (1017, 661), (890, 663), (881, 652), (896, 623), (897, 507)]],
        'station_door': [[(1413, 221), (1539, 218), (1646, 308), (1647, 466), (1586, 530), (1416, 525), (1350, 471), (1350, 317)]],
        'right_console': [[(1537, 423), (1618, 420), (1624, 551), (1532, 550), (1531, 460)]],
    },
    'original': {
        'mission_files': [[(111, 211), (336, 255), (349, 319), (357, 351), (358, 611), (85, 655), (83, 582), (105, 561), (105, 348), (95, 321)]],
        'evidence_board': [[(565, 304), (826, 302), (835, 312), (836, 449), (824, 461), (573, 462), (565, 449)]],
        'center_terminal': [
            [(574, 566), (647, 539), (834, 538), (1058, 535), (1172, 541), (1206, 566), (1203, 593), (574, 594)],
            [(583, 590), (1199, 590), (1190, 705), (1063, 707), (1048, 645), (987, 645), (969, 699), (716, 700), (701, 645), (592, 645)],
            [(615, 545), (632, 511), (654, 470), (676, 445), (698, 442), (728, 456), (752, 473), (742, 485), (714, 471), (688, 465), (664, 489), (643, 549)],
            [(776, 425), (1017, 425), (1020, 552), (781, 553)],
        ],
        'center_terminal_screen': [[(790, 439), (1005, 438), (1007, 537), (791, 540)]],
        'center_terminal_foreground': [[(850, 542), (929, 542), (951, 558), (955, 642), (974, 727), (960, 745), (816, 747), (807, 729), (816, 648), (792, 638), (791, 619), (828, 619), (832, 562)]],
        'station_door': [[(1460, 203), (1601, 202), (1705, 307), (1705, 520), (1651, 611), (1421, 609), (1380, 563), (1380, 308)]],
        'right_console': [[(1633, 451), (1705, 449), (1718, 486), (1718, 628), (1604, 629), (1602, 488)]],
    },
}

TARGETS = {
    'mission_files': 'cases', 'evidence_board': 'evidence',
    'center_terminal': 'briefing', 'station_door': 'door',
    'right_console': 'rescue',
}
LABELS = {
    'mission_files': 'Open Mission Files cabinet',
    'evidence_board': 'Inspect Evidence Board',
    'center_terminal': 'Read Mission Briefing at center terminal',
    'station_door': 'Open Station Door directory',
    'right_console': 'Inspect Rescue Console',
}


def shape_mask(size, polygons):
    mask = np.zeros((size[1], size[0]), dtype=np.uint8)
    for polygon in polygons:
        cv2.fillPoly(mask, [np.asarray(polygon, dtype=np.int32)], 255)
    return mask


def write_cutout(source, mask, path, bbox):
    x, y, w, h = bbox
    rgba = np.dstack((source[y:y+h, x:x+w], mask[y:y+h, x:x+w]))
    rgba[mask[y:y+h, x:x+w] == 0, :3] = 0
    Image.fromarray(rgba, 'RGBA').save(path, optimize=True)


def build_variant(variant, source_name):
    source_path = ROOMS / source_name
    source = np.asarray(Image.open(source_path).convert('RGB'))
    height, width = source.shape[:2]
    masks = {key: shape_mask((width, height), polygons) for key, polygons in SHAPES[variant].items()}
    # An independent screen and a foreground chair occlude the terminal body.
    masks['center_terminal'] = cv2.bitwise_and(masks['center_terminal'], cv2.bitwise_not(masks['center_terminal_screen']))
    masks['center_terminal'] = cv2.bitwise_and(masks['center_terminal'], cv2.bitwise_not(masks['center_terminal_foreground']))
    masks['station_door'] = cv2.bitwise_and(masks['station_door'], cv2.bitwise_not(masks['right_console']))
    for key in ('center_terminal_screen', 'center_terminal_foreground'):
        masks['center_terminal'] = cv2.bitwise_and(masks['center_terminal'], cv2.bitwise_not(masks[key]))

    variant_out = OUT / variant
    (variant_out / 'background').mkdir(parents=True, exist_ok=True)
    union = np.zeros((height, width), dtype=np.uint8)
    for mask in masks.values():
        union = cv2.bitwise_or(union, mask)
    # The checked-in image-guided plate supplies only the pixels hidden behind
    # extracted objects. Everything else remains the exact designer source.
    donor_path = ROOT / 'tools/investigation_reconstruction' / f'{variant}_generated_clean.png'
    donor = np.asarray(Image.open(donor_path).convert('RGB').resize((width, height), Image.Resampling.LANCZOS))
    reconstructed = donor.copy()
    bg_path = variant_out / 'background/investigation_room_bg_clean.png'
    Image.fromarray(reconstructed, 'RGB').save(bg_path, optimize=True)

    manifest = {'version': 1, 'variant': variant, 'sourceArt': f'/assets/rooms/{source_name}',
                'coordinateSystem': {'width': width, 'height': height},
                'background': f'/assets/rooms/investigation/layers/{variant}/background/investigation_room_bg_clean.png',
                'objects': []}
    order = ['evidence_board', 'station_door', 'mission_files', 'right_console', 'center_terminal']
    for z, object_id in enumerate(order, 1):
        object_mask = masks[object_id].copy()
        parts = [object_id]
        if object_id == 'center_terminal':
            parts += ['center_terminal_screen', 'center_terminal_foreground']
            for part in parts[1:]:
                object_mask = cv2.bitwise_or(object_mask, masks[part])
        x, y, w, h = cv2.boundingRect(object_mask)
        directory = variant_out / object_id
        directory.mkdir(exist_ok=True)
        base_name = f'{object_id}_base.png'
        write_cutout(source, masks[object_id], directory / base_name, (x, y, w, h))
        Image.fromarray(object_mask[y:y+h, x:x+w], 'L').save(directory / f'{object_id}_mask.png', optimize=True)
        edge = cv2.subtract(cv2.dilate(object_mask, np.ones((9, 9), np.uint8)), object_mask)
        edge = cv2.GaussianBlur(edge, (0, 0), 2.0)
        glow = np.zeros((height, width, 4), dtype=np.uint8)
        glow[:, :, :3] = (76, 226, 238)
        glow[:, :, 3] = np.minimum(edge, 160)
        Image.fromarray(glow[y:y+h, x:x+w], 'RGBA').save(directory / f'{object_id}_glow.png', optimize=True)
        prefix = f'/assets/rooms/investigation/layers/{variant}/{object_id}/{object_id}'
        entry = {'id': object_id, 'sourceArt': manifest['sourceArt'],
                 'position': {'x': x, 'y': y, 'width': w, 'height': h}, 'zIndex': z,
                 'assets': {'base': prefix + '_base.png', 'glow': prefix + '_glow.png', 'mask': prefix + '_mask.png'},
                 'interaction': {'target': TARGETS[object_id], 'label': LABELS[object_id], 'mask': prefix + '_mask.png'},
                 'states': ['idle', 'hover', 'focus', 'touch']}
        if object_id == 'center_terminal':
            for part, state in [('center_terminal_screen', 'screen'), ('center_terminal_foreground', 'foreground')]:
                part_path = directory / f'{part}.png'
                write_cutout(source, masks[part], part_path, (x, y, w, h))
                entry['assets'][state] = f'/assets/rooms/investigation/layers/{variant}/{object_id}/{part}.png'
        manifest['objects'].append(entry)

    (variant_out / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    composite = reconstructed.copy()
    for mask in masks.values():
        composite[mask > 0] = source[mask > 0]
    comparison = ROOT / 'docs/visual-validation' / variant
    comparison.mkdir(parents=True, exist_ok=True)
    Image.fromarray(source).save(comparison / 'original.png', optimize=True)
    Image.fromarray(composite).save(comparison / 'recomposed.png', optimize=True)
    Image.fromarray(((source.astype(np.uint16) + composite.astype(np.uint16)) // 2).astype(np.uint8)).save(comparison / 'overlay_50pct.png', optimize=True)
    Image.fromarray(np.concatenate((source, composite), axis=1)).save(comparison / 'side_by_side.png', optimize=True)
    diff = np.abs(composite.astype(np.int16) - source.astype(np.int16)).astype(np.uint8)
    Image.fromarray(np.clip(diff.astype(np.uint16) * 8, 0, 255).astype(np.uint8)).save(comparison / 'difference_x8.png', optimize=True)
    print(variant, width, height, 'mean absolute difference:', round(float(diff.mean()), 2),
          'different channel values:', np.count_nonzero(diff), 'extracted pixels:', np.count_nonzero(union))


if __name__ == '__main__':
    build_variant('wide', 'Investigation_Wide_Artwork.png')
    build_variant('original', 'Investigation_Original_REFERENCE.png')
