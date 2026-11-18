from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json
root=Path(__file__).resolve().parents[1]
tl=json.loads((root/'src/lyric-timeline.json').read_text(encoding='utf-8'))
font=ImageFont.truetype('C:/Windows/Fonts/msyh.ttc',20)
keys=['moving','admission','cooking','headphones','field','writing','bell','turnback','reading']
sheet=Image.new('RGB',(1920,1212),'#ecdec8');draw=ImageDraw.Draw(sheet)
for i,key in enumerate(keys):
    cue=next(c for c in tl['cues'] if c['key']==key)
    img=Image.open(root/f"out/lyrics-stills/{cue['id']:02}-{key}.png").convert('RGB')
    img.thumbnail((624,351));x,y=i%3*640+8,i//3*404+8
    sheet.paste(img,(x,y));draw.text((x+10,y+365),f"{cue['label']}  ·  {cue['start']:.1f}s",font=font,fill='#304657')
sheet.save(root/'out/lyrics-storyboard.png')
print(root/'out/lyrics-storyboard.png')
