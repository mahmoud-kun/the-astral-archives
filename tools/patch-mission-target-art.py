"""Build a versioned Mission Target logo-free art candidate from the original
1920x1080 baked backdrop, without regenerating or moving any stage equipment.
The source remains immutable. The independent QA candidate is reviewed before
it replaces the static scene URL in the gameplay manifest.
"""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFilter

SOURCE=Path("public/assets/rooms/past/mission_target/layers/static-v1/room_visible.webp")
OUT=Path("docs/visual-qa")
OUT.mkdir(parents=True,exist_ok=True)
DEST=OUT/"mission-target-logo-free-candidate.webp"
COMPARE=OUT/"mission-target-logo-before-after.webp"
METRICS=OUT/"mission-target-logo-patch.json"
image=Image.open(SOURCE).convert("RGB")
assert image.size==(1920,1080),f"Unexpected mission-target layout: {image.size}"

# Project-specific painted plaque; never touch consoles or gameplay hitboxes.
# The existing frame, two external bolts, and room architecture stay intact.
polygon=[(225,134),(361,167),(364,307),(224,277)]
mask=Image.new("L",image.size,0)
md=ImageDraw.Draw(mask)
md.polygon(polygon,fill=255)
mask=mask.filter(ImageFilter.GaussianBlur(2.6))

plate=Image.new("RGB",image.size)
draw=ImageDraw.Draw(plate)
# Calm warm-cream material, consistent with the original Past palette.
# Follow the plaque's nonparallel sides instead of placing a flat rectangle.
top_left,top_right,bottom_right,bottom_left=polygon
for y in range(133,311):
 t=max(0.0,min(1.0,(y-134)/(307-134)))
 left=round(top_left[0]+(bottom_left[0]-top_left[0])*t)
 right=round(top_right[0]+(bottom_right[0]-top_right[0])*t)
 # Subtle vertical falloff and cooler right edge, rather than synthetic text.
 base=(int(218-42*t),int(187-46*t),int(154-34*t))
 draw.line((left,y,right,y),fill=base,width=1)
corrected=Image.composite(plate,image,mask)

# A small original non-agency compass symbol replaces the unauthorized patch;
# no NASA logo, organization name, mission facts or synthetic panel text.
decor=ImageDraw.Draw(corrected)
ink=(56,58,71)
warm=(236,185,112)
cx,cy=293,224
decor.ellipse((cx-30,cy-33,cx+30,cy+33),outline=ink,width=3)
decor.ellipse((cx-22,cy-25,cx+22,cy+25),outline=(139,102,81),width=1)
decor.polygon([(cx,cy-25),(cx+7,cy-7),(cx+24,cy),(cx+7,cy+7),
               (cx,cy+25),(cx-7,cy+7),(cx-24,cy),(cx-7,cy-7)],fill=ink)
decor.ellipse((cx-5,cy-5,cx+5,cy+5),fill=warm)

corrected.save(DEST,"WEBP",quality=93,method=6)
with Image.open(DEST) as check:
 assert check.size==image.size and check.format=="WEBP"
# Compare the *same pixel window* at 2x so the art owner can inspect the
# frame and patch seam before anything is activated.
crop=(176,75,424,361)
before=image.crop(crop).resize((496,572),Image.Resampling.LANCZOS)
after=corrected.crop(crop).resize((496,572),Image.Resampling.LANCZOS)
sheet=Image.new("RGB",(1016,612),(11,27,43))
sheet.paste(before,(8,32));sheet.paste(after,(512,32))
sd=ImageDraw.Draw(sheet)
sd.text((13,10),"ORIGINAL / UNAUTHORIZED NASA MARK",fill=(255,190,147))
sd.text((516,10),"CORRECTED / FICTIONAL COMPASS MARK",fill=(218,225,207))
sheet.save(COMPARE,"WEBP",quality=92,method=6)
report={"source":str(SOURCE),"generatedCandidate":str(DEST),
 "beforeAfter":str(COMPARE),"dimensions":[1920,1080],
 "affectedRegion":{"polygon":polygon,"includesMissionHotspots":False},
 "sourcePreserved":True,"fullRoomRegeneration":False,
 "automaticArtifactChecks":"PASS","humanArtReview":"PENDING",
 "physicalTouchQA":"NOT_VERIFIED"}
METRICS.write_text(json.dumps(report,indent=2)+"\n")
print("[MISSION-ART-CORRECTION]",json.dumps(report))
