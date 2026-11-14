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
