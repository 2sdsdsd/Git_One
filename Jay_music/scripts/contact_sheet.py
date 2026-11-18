from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json

root = Path(__file__).resolve().parents[1]
tl = json.loads((root/'src/timeline.json').read_text(encoding='utf-8'))
sheet = Image.new('RGB', (1920, 1212), '#ecdec8')
font = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 20)
draw = ImageDraw.Draw(sheet)
for i, shot in enumerate(tl['shots']):
    img = Image.open(root/f'out/stills/shot-{i+1:02}.png').convert('RGB')
    img.thumbnail((624, 351))
    x, y = i%3*640+8, i//3*404+8
    sheet.paste(img, (x,y))
    draw.text((x+10,y+365), f"{i+1:02}  {shot['name']}     {shot['start']:.1f}s", font=font, fill='#304657')
sheet.save(root/'out/storyboard.png')
print(root/'out/storyboard.png')
