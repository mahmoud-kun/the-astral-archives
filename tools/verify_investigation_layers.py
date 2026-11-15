"""Validate the checked-in Investigation Room raster/manifest contract."""
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]

for variant in ('wide', 'original'):
    folder = ROOT / 'public/assets/rooms/investigation/layers' / variant
    manifest = json.loads((folder / 'manifest.json').read_text(encoding='utf-8'))
    width = manifest['coordinateSystem']['width']
    height = manifest['coordinateSystem']['height']
    source = np.asarray(Image.open(ROOT / ('public' + manifest['sourceArt'])).convert('RGB'))
    background = Image.open(ROOT / ('public' + manifest['background']))
    assert source.shape == (height, width, 3)
    assert background.mode == 'RGB' and background.size == (width, height)
    assert len(manifest['objects']) == 5
    assert len({entry['id'] for entry in manifest['objects']}) == 5
    assert {entry['interaction']['target'] for entry in manifest['objects']} == {'cases', 'briefing', 'evidence', 'door', 'rescue'}
    covered = np.zeros((height, width), dtype=bool)
    for entry in manifest['objects']:
        x, y, w, h = (entry['position'][key] for key in ('x','y','width','height'))
        assert 0 <= x < width and 0 <= y < height and x + w <= width and y + h <= height
        mask = np.asarray(Image.open(ROOT / ('public' + entry['assets']['mask'])).convert('L'))
        assert mask.shape == (h, w) and np.any(mask == 255) and np.any(mask == 0)
        assert entry['interaction']['mask'] == entry['assets']['mask']
        for kind in ('base', 'glow', 'screen', 'foreground'):
            if kind not in entry['assets']:
                continue
            image = Image.open(ROOT / ('public' + entry['assets'][kind]))
            assert image.mode == 'RGBA' and image.size == (w, h), (variant, entry['id'], kind)
            rgba = np.asarray(image)
            assert np.any(rgba[:, :, 3] == 0), (variant, entry['id'], kind, 'no transparency')
            assert np.any(rgba[:, :, 3] > 0), (variant, entry['id'], kind, 'empty')
            if kind != 'glow':
                opaque = rgba[:, :, 3] > 0
                assert np.all(rgba[opaque, :3] == source[y:y+h, x:x+w][opaque]), (variant, entry['id'], kind, 'non-source pixels')
                covered[y:y+h, x:x+w] |= opaque
    changed = np.any(np.asarray(background) != source, axis=2)
    assert np.count_nonzero(changed & covered) > 1000
    print(f'{variant}: {width}x{height}, 5 objects, {np.count_nonzero(covered)} extracted pixels, RGB clean plate, real alpha and source-colored cutouts')

# The remaining rooms intentionally use the same crop-relative V3 asset contract.
# Validate their additional metadata and the actual idle compositing result here.
for room, variant, count in (
    ('archive', 'original', 4), ('signal', 'original', 4),
    ('recordings', 'original', 5), ('past/manufacturing', 'portrait', 3),
    ('past/mission_target', 'portrait', 4), ('past/data_analysis', 'portrait', 3),
    ('past/resources_review', 'portrait', 5),
):
    folder = ROOT / 'public/assets/rooms' / room / 'layers' / variant
    manifest = json.loads((folder / 'manifest.json').read_text(encoding='utf-8'))
    width, height = (manifest['coordinateSystem'][axis] for axis in ('width', 'height'))
    source = np.asarray(Image.open(ROOT / ('public' + manifest['sourceArt'])).convert('RGB'))
    background = np.asarray(Image.open(ROOT / ('public' + manifest['background'])).convert('RGB'))
    assert source.shape == background.shape == (height, width, 3)
    assert len(manifest['objects']) == count
    assert len({obj['id'] for obj in manifest['objects']}) == count
    assert len({obj['interaction']['target'] for obj in manifest['objects']}) == count
    assert manifest['timeline'] == ('past' if room.startswith('past/') else 'present')
    composite = background.copy()
    extracted = np.zeros((height, width), dtype=bool)
    for obj in manifest['objects']:
        x, y, w, h = (obj['position'][key] for key in ('x', 'y', 'width', 'height'))
        assert 0 <= x < width and 0 <= y < height and w > 0 and h > 0 and x+w <= width and y+h <= height
        assert obj['states'] == ['idle', 'hover', 'focus', 'touch']
        assert obj['interaction']['mask'] == obj['assets']['mask']
        mask = np.asarray(Image.open(ROOT / ('public' + obj['assets']['mask'])).convert('L'))
        assert mask.shape == (h, w) and np.any(mask == 0) and np.any(mask == 255)
        assert set(np.unique(mask)) <= {0, 255}
        assert obj['extractionMode'] in {'fully_layered', 'overlay_only', 'blocked'}
        parts = np.zeros((h, w), dtype=bool)
        for kind in ('base', 'screen', 'foreground'):
            if kind not in obj['assets']:
                continue
            rgba = np.asarray(Image.open(ROOT / ('public' + obj['assets'][kind])).convert('RGBA'))
            assert rgba.shape == (h, w, 4)
            alpha = rgba[:, :, 3] > 0
            assert np.any(rgba[:, :, 3] == 0)
            if obj['extractionMode'] == 'fully_layered':
                assert np.any(alpha), (room, obj['id'], kind, 'empty layer')
            assert not np.any(parts & alpha), (room, obj['id'], kind, 'overlapping components')
            assert np.all(rgba[alpha, :3] == source[y:y+h, x:x+w][alpha])
            parts |= alpha
            composite[y:y+h, x:x+w][alpha] = rgba[alpha, :3]
        glow = np.asarray(Image.open(ROOT / ('public' + obj['assets']['glow'])).convert('RGBA'))
        assert glow.shape == (h, w, 4) and np.any(glow[:, :, 3] == 0) and np.any(glow[:, :, 3] > 0)
        if obj['extractionMode'] == 'fully_layered':
            assert np.any(parts) and np.array_equal(parts, mask > 0), (room, obj['id'], 'incomplete source coverage')
            assert not np.any(extracted[y:y+h, x:x+w] & parts), (room, obj['id'], 'object overlap')
            extracted[y:y+h, x:x+w] |= parts
        else:
            assert not np.any(parts), (room, obj['id'], 'overlay has image pixels')
    assert np.array_equal(background[~extracted], source[~extracted]), (room, 'clean plate changed outside cutouts')
    mae = float(np.abs(composite.astype(np.int16) - source.astype(np.int16)).mean())
    assert mae < 0.01, (room, mae)
    print(f'{room}: {width}x{height}, {count} objects, {np.count_nonzero(extracted)} extracted pixels, idle MAE {mae:.4f}')
