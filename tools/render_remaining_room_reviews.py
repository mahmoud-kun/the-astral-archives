"""Render static source/clean-plate contact and contain-fit viewport evidence."""
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1] / 'docs/visual-validation/remaining-rooms'
ROOMS = ['archive', 'signal', 'recordings', 'past_manufacturing',
         'past_mission_target', 'past_data_analysis', 'past_resources_review']
VIEWPORTS = [(1920, 1080), (1366, 768), (800, 360), (915, 412)]


def main():
    contact = Image.new('RGB', (2100, 2300), '#181c24')
    draw = ImageDraw.Draw(contact)
    for index, room in enumerate(ROOMS):
        folder = ROOT / room
        for pair_index, name in enumerate(('original.png', 'clean_plate.png')):
            image = Image.open(folder / name).convert('RGB')
            image.thumbnail((330, 690), Image.Resampling.LANCZOS)
            x = (index % 3) * 700 + pair_index * 345 + (345 - image.width) // 2
            y = (index // 3) * 760 + 30
            contact.paste(image, (x, y))
        draw.text(((index % 3) * 700 + 10, (index // 3) * 760 + 726),
                  room + ' source / clean plate', fill='white')
        idle = Image.open(folder / 'recomposed.png').convert('RGB')
        for width, height in VIEWPORTS:
            canvas = Image.new('RGB', (width, height), '#111827')
            fitted = idle.copy()
            fitted.thumbnail((width, height), Image.Resampling.LANCZOS)
            canvas.paste(fitted, ((width - fitted.width) // 2, (height - fitted.height) // 2))
            canvas.save(folder / f'contain_{width}x{height}.png', optimize=True)
    contact.save(ROOT / 'clean_plate_review_contact.png', optimize=True)


if __name__ == '__main__':
    main()
