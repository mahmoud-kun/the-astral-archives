"""Compress the Playwright screenshots into two reviewer-friendly contact sheets."""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont

SRC = Path("qa-artifacts")
OUT = Path("docs/visual-qa")
OUT.mkdir(parents=True, exist_ok=True)

def sheet(name, entries, thumb):
    cols = 2
    rows = (len(entries) + cols - 1) // cols
    width, height = thumb
    heading = 27
    margin = 12
    canvas = Image.new("RGB", (cols * (width + margin) + margin, rows * (height + heading + margin) + margin), "#0a1b29")
    draw = ImageDraw.Draw(canvas)
    for i, (label, source) in enumerate(entries):
        file = SRC / source
        if not file.is_file():
            raise FileNotFoundError(file)
        x = margin + (i % cols) * (width + margin)
        y = margin + (i // cols) * (height + heading + margin)
        draw.text((x + 7, y + 6), label, fill="#ebbf8c")
        with Image.open(file) as img:
            picture = img.convert("RGB")
            picture.thumbnail((width,height), Image.Resampling.LANCZOS)
            dx = (width-picture.width)//2
            dy = (height-picture.height)//2
            canvas.paste(picture, (x+dx,y+heading+dy))
        draw.rectangle((x,y+heading,x+width,y+heading+height),outline="#56899b",width=1)
    dest = OUT / (name + ".webp")
    canvas.save(dest,"WEBP",quality=78,method=6)
    print(f"Generated {dest} ({dest.stat().st_size} bytes)")

sheet("desktop-review", [
 ("HOME / 1366×768","home-1366x768.png"),
 ("INVESTIGATION / 1366×768","investigation-1366x768.png"),
 ("SIGNAL / 1366×768","signal-1366x768.png"),
 ("NADIR PUZZLE / 1366×768","nadir-puzzle-1366x768.png"),
], (880,495))
sheet("mobile-review", [
 ("HOME / 915×412","home-915x412.png"),
 ("INVESTIGATION / 915×412","investigation-915x412.png"),
 ("SIGNAL / 915×412","signal-915x412.png"),
 ("ARCHIVE / 915×412","archive-915x412.png"),
 ("RECORDINGS / 915×412","recordings-915x412.png"),
 ("PUZZLE / 915×412","nadir-puzzle-915x412.png"),
 ("TRAY / 915×412","tray-open-915x412.png"),
 ("FOLDERS / 915×412","folder-915x412.png"),
], (790,357))
report=json.loads((SRC/"report.json").read_text())
summary={
 "run_on":report["started"],
 "screenshots":len(report["pages"]),
 "console_errors":sum(len(p["faults"]) for p in report["pages"]),
 "broken_images":sum(sum(not x["ok"] for x in p["metrics"]["images"]) for p in report["pages"]),
 "clipped_controls":sum(len(p["metrics"]["clippedControls"]) for p in report["pages"]),
 "overflows":sum(len(p["metrics"]["overflow"]) for p in report["pages"]),
 "errors":report["errors"],
 "image_transfer_bytes_by_route":[{"route":p["route"],"viewport":p["viewport"],"label":p["label"],"bytes":sum(r["bytes"] for r in p["imagesRequested"])} for p in report["pages"]],
}
(OUT/"latest-report.json").write_text(json.dumps(summary,indent=2))

# Produce a drop-in, exact-dimension WebP variant of the approved clean plate.
# Original PNG and every object layer remain untouched for art provenance.
from PIL import ImageChops, ImageStat
source_plate=Path("public/assets/rooms/investigation/layers/wide/background/investigation_room_bg_clean.png")
optimized_plate=source_plate.with_suffix(".webp")
with Image.open(source_plate) as original:
    rgb=original.convert("RGB")
    rgb.save(optimized_plate,"WEBP",quality=90,method=6)
    with Image.open(optimized_plate) as compressed:
        assert compressed.size==rgb.size, "WebP changed the room coordinate system"
        difference=ImageChops.difference(rgb,compressed.convert("RGB"))
        average_error=sum(ImageStat.Stat(difference).mean)/3
        metrics={
            "input":str(source_plate),
            "output":str(optimized_plate),
            "pixel_width":rgb.width,
            "pixel_height":rgb.height,
            "original_bytes":source_plate.stat().st_size,
            "optimized_bytes":optimized_plate.stat().st_size,
            "saved_percent":round(100*(1-optimized_plate.stat().st_size/source_plate.stat().st_size),1),
            "mean_absolute_rgb_error":round(average_error,3),
        }
        assert average_error<6, "Compressed background diverges visibly from approved art; reject optimization"
        (OUT/"background-optimization.json").write_text(json.dumps(metrics,indent=2))
        print("[VISUAL-QA] Optimized approved clean plate:",metrics)
