"""Compress the Playwright screenshots into two reviewer-friendly contact sheets."""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont

SRC = Path("qa-artifacts")
OUT = Path("docs/visual-qa")
OUT.mkdir(parents=True, exist_ok=True)
MISSING = []  # Keep failed scenario screenshots visible in the QA summary.

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
        x = margin + (i % cols) * (width + margin)
        y = margin + (i // cols) * (height + heading + margin)
        draw.text((x + 7, y + 6), label, fill="#ebbf8c")
        if file.is_file():
            with Image.open(file) as img:
                picture = img.convert("RGB")
                picture.thumbnail((width,height), Image.Resampling.LANCZOS)
                dx = (width-picture.width)//2
                dy = (height-picture.height)//2
                canvas.paste(picture, (x+dx,y+heading+dy))
        else:
            # Preserve the review sheet on failed QA, without hiding absent captures.
            MISSING.append(str(file))
            draw.text((x + 22, y + heading + 28), "QA FAILED: SCREENSHOT MISSING", fill="#ffb8a8")
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
 ("PUZZLE / INSPECT / 915×412","nadir-puzzle-915x412.png"),
 ("PUZZLE / ANALYZE / 915×412","nadir-analysis-915x412.png"),
 ("TRAY / 915×412","tray-open-915x412.png"),
 ("NADIR / FILED 1 OF 6 / 915×412","nadir-filed-folder-915x412.png"),
 ("RETURN TO SIGNAL / 915×412","nadir-collect-and-file-915x412.png"),
 ("FOLDERS / 915×412","folder-915x412.png"),
 ("AUDIO SETTINGS / 915×412","audio-settings-915x412.png"),
 ("SOUND LAB / 915×412","audio-lab-915x412.png"),
], (790,357))
# Exact fullscreen viewport and left-side inventory placement comparisons.
sheet("fullscreen-layout-review", [
 ("FULLSCREEN HOME / 1650×927","home-fullscreen-1650x927.png"),
 ("FULLSCREEN HOME / 1920×1080","home-fullscreen-1920x1080.png"),
 ("INVENTORY LEFT / DESKTOP 1366×768","inventory-left-1366x768.png"),
 ("INVENTORY LEFT / MOBILE 915×412","inventory-left-915x412.png"),
], (880,495))
# Independent Main integration evidence for the four newly mounted Rescue
# routes and the source-index analyzer, separate from the historical review.
sheet("case-integration-review", [
 ("CASE SOURCE INDEX / DESKTOP", "case-source-index-1366x768.png"),
 ("CASE SOURCE INDEX / MOBILE", "case-source-index-915x412.png"),
 ("CASE PUZZLE / MOBILE", "case-puzzle-915x412.png"),
 ("KES RESCUE GATE", "case-rescue-kes-915x412.png"),
 ("LUM RESCUE GATE", "case-rescue-lum-915x412.png"),
 ("ORI RESCUE GATE", "case-rescue-ori-915x412.png"),
 ("AST RESCUE GATE", "case-rescue-ast-915x412.png"),
 ("PRODUCTION DEBUG GUARD", "production-debug-guard-915x412.png"),
], (790,357))

# First browser capture set for media entry points and scientific holds.
sheet("media-integration-review", [
 ("OPENING / REAL PLAYER", "cinematic-opening-active-915x412.png"),
 ("SOURCE INDEX / ARCHIVE", "source-desk-archive-915x412.png"),
 ("SOURCE INDEX / SIGNAL", "source-desk-signal-915x412.png"),
 ("SOURCE INDEX / RECORDINGS", "source-desk-recordings-915x412.png"),
 ("NAD-07 / VOICE INSPECTOR", "nadir-voice-inspector-915x412.png"),
 ("KES-05 / VOICE INSPECTOR", "kestrel-voice-inspector-915x412.png"),
 ("NAD-02 / VIDEO INSPECTOR", "nadir-evidence-video-915x412.png"),
 ("LUMEN / PLAY INTRO", "cinematic-lumen-intro-915x412.png"),
 ("KESTREL / CONTENT HOLD", "kestrel-film-content-hold-915x412.png"),
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
 "missing_screenshots":MISSING,
 "image_transfer_bytes_by_route":[{"route":p["route"],"viewport":p["viewport"],"label":p["label"],"bytes":sum(r["bytes"] for r in p["imagesRequested"])} for p in report["pages"]],
}
(OUT/"latest-report.json").write_text(json.dumps(summary,indent=2))
if MISSING:
    print(f"[VISUAL-QA] Missing {len(MISSING)} scenario screenshots (see latest-report.json)")

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

# Generate a review-only, unbranded Mission Target candidate from the exact
# immutable runtime source. CI publishes it under docs/visual-qa first; the
# integration specialist must inspect it before using it in gameplay.
import subprocess,sys
legacy_mission_art=Path("public/assets/rooms/past/mission_target/layers/static-v1/room_visible.webp")
if legacy_mission_art.is_file():
    subprocess.run([sys.executable,"tools/patch-mission-target-art.py"],check=True)
else:
    # Archived logo-bearing source was intentionally removed from public assets.
    # static-v2 is already approved as the active runtime art; do not resurrect it.
    print("[MISSION-ART] Retired static-v1 source absent; keeping active neutral static-v2.")
