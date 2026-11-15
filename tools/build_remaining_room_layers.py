"""Trace source-pixel room sprites and V3-compatible manifests for seven rooms.

Run with Python 3.12, Pillow, NumPy and OpenCV. Coordinates below were traced
against the supplied native images; prototype Past hotspots informed identity,
not final bounds. Clean plates are inpainted estimates, never designer layers.
"""
from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ROOMS = ROOT / 'public/assets/rooms'
REVIEW = ROOT / 'docs/visual-validation/remaining-rooms'
STATES = ['idle', 'hover', 'focus', 'touch']

# Each polygon follows the outer edge of one visible object or display panel.
# A screen polygon is subtracted from the base, retaining the original pixels
# in a separate RGBA image with the same crop and scene coordinates.
ROOMS_SPEC = {
    'archive': dict(source='Archive_Original_REFERENCE.png', timeline='present', variant='original', objects=[
        dict(id='archive_filing_drawers', target='physical_records', label='Open archive filing drawers', p=[[(0,555),(258,554),(258,803),(197,822),(0,826)]]),
        dict(id='archive_processing_desk', target='document_review', label='Review archive documents', p=[[(368,577),(554,574),(549,510),(574,481),(608,479),(644,502),(642,566),(840,574),(837,703),(511,723),(369,720)],[(501,541),(761,539),(762,585),(503,586)]]),
        dict(id='archive_shelving', target='archive_shelves', label='Inspect archive shelving', mode='overlay_only', p=[[(333,320),(1149,356),(1152,632),(323,634)]]),
        dict(id='archive_main_terminal', target='archive', label='Open Mission Archive terminal', p=[[(1154,352),(1173,327),(1374,272),(1402,241),(1442,226),(1601,222),(1671,276),(1671,583),(1623,607),(1161,571)],[(1191,573),(1671,568),(1671,833),(1521,855),(1176,810),(1121,629)]], screen=[[(1182,355),(1647,304),(1657,329),(1656,550),(1620,580),(1170,556),(1169,378)]]),
    ]),
    'signal': dict(source='Signal_Original_REFERENCE.png', timeline='present', variant='original', objects=[
        dict(id='telemetry_console_left', target='telemetry_left', label='Inspect left telemetry workstation', p=[[(20,440),(371,461),(380,588),(476,595),(480,682),(221,696),(217,879),(0,920),(0,604)],[(33,452),(372,464),(371,591),(39,594)]], screen=[[(39,459),(178,478),(179,579),(54,586)],[(187,478),(271,485),(273,576),(194,579)],[(278,488),(361,496),(362,574),(285,578)]]),
        dict(id='main_signal_display', target='signal_analysis', label='Analyze main signal display', p=[[(468,260),(492,262),(502,273),(1175,270),(1202,292),(1202,551),(1174,581),(495,581),(470,551)]], screen=[[(519,309),(1162,311),(1170,329),(1168,542),(1149,554),(521,550)]]),
        dict(id='receiver_rack', target='signal_tuning', label='Tune signal receiver rack', p=[[(705,598),(982,598),(985,674),(703,672)]]),
        dict(id='telemetry_console_right', target='telemetry_right', label='Inspect right telemetry workstation', p=[[(1295,468),(1671,445),(1671,680),(1473,682),(1470,920),(1197,825),(1197,593),(1291,584)]], screen=[[(1304,493),(1417,487),(1420,573),(1302,570)],[(1429,484),(1526,474),(1528,578),(1431,575)],[(1544,468),(1669,457),(1669,582),(1544,577)]]),
    ]),
    'recordings': dict(source='Recordings_Original_REFERENCE.png', timeline='present', variant='original', objects=[
        dict(id='recording_equipment_rack', target='recording_archive', label='Inspect recording equipment rack', p=[[(178,347),(479,353),(478,466),(177,468)],[(413,468),(478,468),(478,551),(415,550)]]),
        dict(id='headphones_dock', target='headphones', label='Use headphones dock', p=[[(77,510),(93,503),(109,516),(112,538),(124,522),(143,521),(165,542),(170,579),(155,610),(162,630),(74,631),(78,607),(71,577)]]),
        dict(id='audio_analysis_terminal', target='audio_analysis', label='Inspect audio analysis terminal', p=[[(187,468),(365,466),(414,582),(201,609),(177,583)]], screen=[[(205,479),(358,479),(398,573),(213,592)]]),
        dict(id='main_video_display', target='video_recordings', label='View video recordings', p=[[(1166,274),(1184,245),(1616,95),(1647,95),(1671,118),(1671,543),(1642,566),(1183,548),(1162,521)]], screen=[[(1191,294),(1617,135),(1636,150),(1636,526),(1200,515)]]),
        dict(id='video_playback_console', target='video_controls', label='Operate video playback controls', p=[[(1191,542),(1640,560),(1671,585),(1671,695),(1490,793),(1111,699),(1102,579)]]),
    ]),
    'past/manufacturing': dict(source='past/sources/01_Manufacturing_Materials_1080x1920.png', timeline='past', variant='portrait', objects=[
        dict(id='materials_structure', target='materials_structure', label='Inspect materials and structure', p=[[(0,711),(297,712),(326,940),(365,1050),(365,1203),(313,1268),(0,1272)]], screen=[[(150,930),(321,931),(322,1034),(152,1037)]]),
        dict(id='motors_energy', target='motors_energy', label='Inspect motors and energy', p=[[(375,719),(653,717),(722,774),(731,1191),(646,1211),(378,1213),(370,1070)]], screen=[[(435,982),(675,982),(675,1102),(437,1103)]]),
        dict(id='rocket_design', target='rocket_design', label='Inspect rocket design', p=[[(785,713),(1079,701),(1079,1246),(986,1267),(755,1247),(749,1079)]], screen=[[(825,744),(1074,743),(1074,973),(824,980)],[(807,972),(1070,969),(1069,1138),(806,1123)]]),
    ]),
    'past/mission_target': dict(source='past/sources/02_Mission_Target_1080x1920.png', timeline='past', variant='portrait', objects=[
        dict(id='mission_objectives', target='mission_objectives', label='Review mission objectives', p=[[(28,554),(222,555),(259,603),(259,947),(38,971),(22,885)]], screen=[[(49,668),(228,665),(228,806),(47,807)],[(78,820),(222,822),(223,876),(80,877)]]),
        dict(id='target_destination', target='target_destination', label='Inspect target destination', p=[[(276,540),(805,540),(823,595),(821,857),(735,890),(765,947),(747,1038),(697,1090),(365,1091),(317,1013),(316,925),(339,883),(261,856),(260,590)],[(846,555),(1028,556),(1078,606),(1078,898),(1038,964),(837,967),(821,899),(821,606)]], screen=[[(282,562),(793,560),(794,833),(281,832)],[(857,671),(1037,671),(1038,808),(858,808)],[(863,817),(1029,816),(1032,866),(865,867)]]),
        dict(id='scientific_priorities', target='scientific_priorities', label='Review scientific priorities', p=[[(21,982),(304,982),(338,1025),(337,1400),(296,1448),(30,1450),(15,1397)]], screen=[[(58,1094),(316,1095),(316,1256),(58,1256)],[(115,1269),(292,1268),(296,1329),(119,1330)]]),
        dict(id='mission_constraints', target='mission_constraints', label='Review mission constraints', p=[[(773,982),(1059,982),(1079,1019),(1079,1400),(1040,1446),(779,1449),(742,1398),(741,1039)]], screen=[[(769,1098),(1030,1098),(1030,1254),(769,1255)],[(781,1266),(994,1267),(989,1330),(787,1328)]]),
    ]),
    'past/data_analysis': dict(source='past/sources/03_Data_Analysis_File_Review_1080x1920.png', timeline='past', variant='portrait', objects=[
        dict(id='mission_files', target='mission_files', label='Review mission files', p=[[(92,556),(555,557),(555,1122),(93,1123),(79,1092),(79,582)]], screen=[[(126,620),(542,620),(542,1060),(127,1060)]]),
        dict(id='dataset_viewer', target='dataset_viewer', label='Review datasets', p=[[(556,557),(994,557),(1024,582),(1024,1093),(996,1122),(556,1122)]], screen=[[(565,620),(989,620),(989,1060),(565,1060)]]),
        dict(id='analysis_console', target='analysis_console', label='Operate analysis console', p=[[(225,1090),(895,1090),(962,1225),(1002,1390),(867,1444),(88,1445),(19,1407),(28,1217)]], screen=[[(247,1110),(500,1109),(500,1279),(246,1279)],[(580,1110),(892,1109),(891,1279),(579,1279)],[(37,1232),(214,1225),(225,1335),(48,1350)]]),
    ]),
    'past/resources_review': dict(source='past/sources/04_Resources_Review_1080x1920.png', timeline='past', variant='portrait', objects=[
        dict(id='hardware_inventory', target='hardware_inventory', label='Inspect hardware inventory', p=[[(0,580),(277,606),(277,830),(0,821)]], screen=[[(0,606),(258,624),(257,809),(0,799)]]),
        dict(id='power_energy', target='power_energy', label='Inspect power and energy', p=[[(0,838),(277,843),(276,1092),(0,1085)]], screen=[[(0,861),(257,861),(256,1067),(0,1061)]]),
        dict(id='personnel_roles', target='personnel_roles', label='Inspect personnel and roles', p=[[(827,610),(1079,573),(1079,826),(829,832)]], screen=[[(844,632),(1079,601),(1079,801),(845,805)]]),
        dict(id='supplies_logistics', target='supplies_logistics', label='Inspect supplies and logistics', p=[[(827,843),(1079,838),(1079,1093),(829,1091)]], screen=[[(843,861),(1079,858),(1079,1067),(845,1067)]]),
        dict(id='resource_allocation', target='resource_allocation', label='Inspect resource allocation table', p=[[(319,657),(774,650),(774,1142),(834,1171),(867,1223),(828,1384),(752,1451),(331,1456),(266,1360),(235,1208),(274,1167),(320,1138)]], screen=[[(340,679),(749,675),(751,1138),(333,1138)]]),
    ]),
}


def polygon_mask(size, polygons):
    mask = np.zeros((size[1], size[0]), np.uint8)
    for polygon in polygons:
        cv2.fillPoly(mask, [np.asarray(polygon, np.int32)], 255)
    return mask


def save_rgba(source, mask, path, box):
    x, y, w, h = box
    rgba = np.dstack((source[y:y+h, x:x+w], mask[y:y+h, x:x+w]))
    rgba[rgba[:, :, 3] == 0, :3] = 0
    Image.fromarray(rgba, 'RGBA').save(path, optimize=True)


def build_room(room, spec):
    source_path = ROOMS / spec['source']
    source = np.asarray(Image.open(source_path).convert('RGB'))
    height, width = source.shape[:2]
    expected = (1080, 1920) if spec['timeline'] == 'past' else (1672, 941)
    assert (width, height) == expected, (source_path, width, height)
    output = ROOMS / room / 'layers' / spec['variant']
    (output / 'background').mkdir(parents=True, exist_ok=True)
    prefix = '/assets/rooms/' + room + '/layers/' + spec['variant']
    source_url = '/assets/rooms/' + spec['source'].replace('\\', '/')
    manifest = dict(version=1, roomId=room.split('/')[-1], timeline=spec['timeline'], variant=spec['variant'],
                    sourceArt=source_url, coordinateSystem=dict(width=width, height=height),
                    background=prefix + '/background/room_bg_clean.png', objects=[])
    occupied = np.zeros((height, width), np.uint8)
    extracted = np.zeros((height, width), np.uint8)
    masks = []
    for z, obj in enumerate(spec['objects'], 1):
        mode = obj.get('mode', 'fully_layered')
        whole = polygon_mask((width, height), obj['p'])
        screen = polygon_mask((width, height), obj.get('screen', []))
        screen = cv2.bitwise_and(screen, whole)
        whole = cv2.bitwise_and(whole, cv2.bitwise_not(occupied))
        screen = cv2.bitwise_and(screen, whole)
        occupied = cv2.bitwise_or(occupied, whole)
        if mode == 'fully_layered':
            extracted = cv2.bitwise_or(extracted, whole)
        base = cv2.bitwise_and(whole, cv2.bitwise_not(screen)) if mode == 'fully_layered' else np.zeros_like(whole)
        bx, by, bw, bh = cv2.boundingRect(whole)
        x, y = max(0, bx - 4), max(0, by - 4)
        right, bottom = min(width, bx + bw + 4), min(height, by + bh + 4)
        w, h = right - x, bottom - y
        folder = output / obj['id']
        folder.mkdir(exist_ok=True)
        asset_prefix = prefix + '/' + obj['id'] + '/' + obj['id']
        assets = dict(base=asset_prefix + '_base.png', glow=asset_prefix + '_glow.png', mask=asset_prefix + '_mask.png')
        save_rgba(source, base, folder / (obj['id'] + '_base.png'), (x, y, w, h))
        if np.any(screen):
            save_rgba(source, screen, folder / (obj['id'] + '_screen.png'), (x, y, w, h))
            assets['screen'] = asset_prefix + '_screen.png'
        Image.fromarray(whole[y:y+h, x:x+w], 'L').save(folder / (obj['id'] + '_mask.png'), optimize=True)
        edge = cv2.subtract(cv2.dilate(whole, np.ones((11, 11), np.uint8)), whole)
        edge = cv2.GaussianBlur(edge, (0, 0), 2)
        glow = np.zeros((height, width, 4), np.uint8)
        glow[:, :, :3] = (76, 226, 238)
        glow[:, :, 3] = np.minimum(edge, 160)
        Image.fromarray(glow[y:y+h, x:x+w], 'RGBA').save(folder / (obj['id'] + '_glow.png'), optimize=True)
        manifest['objects'].append(dict(id=obj['id'], sourceArt=source_url, position=dict(x=x, y=y, width=w, height=h),
            zIndex=z, assets=assets, interaction=dict(target=obj['target'], label=obj['label'], mask=assets['mask']),
            states=STATES, extractionMode=mode, cleanPlateExtractionComplete=False,
            designerCleanupRequired=True))
        masks.append((mode, whole))
    # Inpaint only pixels that are covered in the idle scene. The original RGB
    # outside those silhouettes is preserved exactly. Large concealed regions
    # remain estimates and are called out in the handoff.
    donor_name = room.split('/')[-1] + '_clean_donor.png'
    donor_path = ROOT / 'tools/remaining_reconstruction' / donor_name
    donor = np.asarray(Image.open(donor_path).convert('RGB').resize((width, height), Image.Resampling.LANCZOS))
    plate = source.copy()
    plate[extracted > 0] = donor[extracted > 0]
    Image.fromarray(plate, 'RGB').save(output / 'background/room_bg_clean.png', optimize=True)
    (output / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    recomposed = plate.copy()
    for mode, mask in masks:
        if mode == 'fully_layered':
            recomposed[mask > 0] = source[mask > 0]
    review = REVIEW / room.replace('/', '_')
    review.mkdir(parents=True, exist_ok=True)
    Image.fromarray(source).save(review / 'original.png', optimize=True)
    Image.fromarray(recomposed).save(review / 'recomposed.png', optimize=True)
    Image.fromarray(np.concatenate((source, recomposed), axis=1)).save(review / 'side_by_side.png', optimize=True)
    diff = np.abs(source.astype(np.int16) - recomposed.astype(np.int16)).astype(np.uint8)
    Image.fromarray(np.clip(diff.astype(np.uint16) * 8, 0, 255).astype(np.uint8)).save(review / 'difference_x8.png', optimize=True)
    Image.fromarray(plate).save(review / 'clean_plate.png', optimize=True)
    print(f'{room}: {width}x{height}, {len(manifest["objects"])} objects, '
          f'{np.count_nonzero(extracted)} extracted pixels, recomposition MAE {diff.mean():.4f}')


if __name__ == '__main__':
    for room_id, room_spec in ROOMS_SPEC.items():
        build_room(room_id, room_spec)
