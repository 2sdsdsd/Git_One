"""Turn lyric meanings into explicit scene cues; prefer local recognition timing."""
import json
import re
from difflib import SequenceMatcher
from pathlib import Path
import numpy as np

root = Path(__file__).resolve().parents[1]
base = json.loads((root/'src/timeline.json').read_text(encoding='utf-8'))
raw = (root/'.cache/source-lyrics.lrc').read_text(encoding='utf-8')
lines = []
for match in re.finditer(r'\[(\d+):(\d+\.\d+)\]([^\n]+)', raw):
    t = int(match[1])*60+float(match[2])
    if t >= 15:
        lines.append((t, re.sub(r'^(Jay|Gary|合)：', '', match[3])))

specs = [
 (0, 'intro', '巷子醒来', '建立女生家、男生准备搬入的公寓，以及通往学校的路'),
 (15.16, 'alley', '她住的巷子', '女生从家门出发，男生来到巷口'),
 (18.77, 'moving', '搬进公寓', '男生提行李、拿钥匙，进入她家附近的公寓'),
 (22.48, 'encounter', '期待偶遇', '男生出门整理衣领，女生刚好从路口经过'),
 (28.55, 'school', '高中回忆', '男生在高中教室里看向认真读书的女生'),
 (35.69, 'admission', '不同的大学', '通知书与两所大学展开，男生遗憾地低头'),
 (40.64, 'job', '宿舍旁的工作', '男生穿上围裙，店铺对面就是大学宿舍'),
 (46.98, 'cooking', '学习做早餐', '打蛋、摊蛋饼、折叠装袋'),
 (50.41, 'breakfast', '留下的早餐', '女生匆匆去学校，早餐留在柜台'),
 (55.24, 'headphones', '擦肩与耳机', '女生戴耳机经过，男生回头却没有开口'),
 (66.74, 'field', '操场等候', '男生独自躺在草地上望星空'),
 (74.32, 'classroom', '还亮着的窗', '操场远景连接到女生仍在读书的教室'),
 (80.78, 'writing', '写信', '男生在台灯下写信，反复修改，叠好信封'),
 (94.17, 'calendar', '日复一日', '日历、天气与长椅上空出的座位变化'),
 (106.97, 'hesitation', '不敢递出的信', '女生和朋友在校园里，男生把信收回'),
 (113.33, 'mailbox', '信与离开', '男生把信放进信箱，提起行李转身'),
 (123, 'interlude', '未寄出的心事', '间奏里展示公寓书桌、旧课本、信封和吉他'),
 (144.25, 'square', '等下课铃', '男生坐在学校广场，抬头看钟楼'),
 (152.39, 'bell', '下课的人流', '钟摆响动，学生涌出，男生期待地站起'),
 (157.34, 'guitar', '唱她喜欢的歌', '男生弹吉他，在旁边留一个空座位'),
 (165.43, 'unnoticed', '没有被看见', '女生继续向前走，男生的弹奏与眼神慢下来'),
 (169.75, 'distance', '歌声没有抵达', '从拨弦的手拉到女生已远去的背影'),
 (176.96, 'crowd', '在人群中寻找', '三层放学人群中识别出女生的书包与发带'),
 (184.63, 'passing', '又一次经过', '女生经过广场，男生仍在弹琴'),
 (192.94, 'turnback', '终于回头', '女生停步回头，男生停弦，两人目光交汇'),
 (196.94, 'fieldReverse', '从窗内看操场', '由女生的窗边视角看见远处草地上的男生'),
 (204.23, 'classroomReverse', '从操场看亮窗', '低机位在草地上望向女生的亮窗，构图与前段不同'),
 (210.58, 'letterClose', '信纸上的认真', '书桌俯拍，写好、折信、装信封，旁边放旧课本'),
 (223.89, 'waitingAgain', '期待被发现', '女生窗前看向广场，男生在长椅旁等待'),
 (236.68, 'packing', '准备告别', '男生收起吉他、整理行李，留下一封信'),
 (242.98, 'reading', '她终于读到', '女生拿起信封、展开信纸，抬头望向窗外'),
 (246.59, 'walkingAway', '走向巷口', '男生提行李慢慢远去，女生留在亮着的窗边'),
 (262, 'outro', '同一条巷子', '两扇窗一明一暗，空房间与留下的信，开放结局淡出'),
]

def compact(s):
    return ''.join(c for c in s if '\u4e00' <= c <= '\u9fff')

asr_path = root/'.cache/local-transcription.json'
recognized = json.loads(asr_path.read_text(encoding='utf-8')) if asr_path.exists() else None
matches = []
if recognized:
    for t, text in lines:
        best = None
        for seg in recognized['segments']:
            score = SequenceMatcher(None, compact(text), compact(seg['text'])).ratio()
            if score < .55:
                continue
            distance = abs(seg['start']-t*base['duration']/270)
            ranking = score-distance*.018
            if best is None or ranking>best[0]:
                best = (ranking, t, seg['start'], score)
        if best is not None and best[3] >= .65:
            matches.append(best[1:])

if len(matches)>=5:
    x = np.array([m[0] for m in matches]); y = np.array([m[1] for m in matches])
    # Robustly estimate the recording's time scale and intro delay.
    scale, offset = np.polyfit(x, y, 1)
    for _ in range(3):
        good = abs(y-(x*scale+offset)) < 3
        if np.sum(good)<5: break
        scale, offset = np.polyfit(x[good],y[good],1)
    mapping_method = 'Local MP3 recognition anchor fit; individual cue onsets snapped to the measured beat grid'
else:
    scale, offset = base['duration']/270, 0
    mapping_method = 'Provisional reference time scale; local recognition did not produce enough reliable anchors'

beats = np.array(base['beats'])
cues = []
for i, (t, key, label, action) in enumerate(specs):
    mapped = 0 if i==0 else float(t*scale+offset)
    confidence = 'estimated'
    near = [m for m in matches if abs(m[0]-t)<.06 and m[2]>=.65]
    if near:
        mapped = near[0][1]
        confidence = 'local-recognition-anchor'
    snapped = 0 if i==0 else float(beats[np.argmin(abs(beats-mapped))])
    cues.append({'id': i+1,'key': key,'label': label,'action': action,'referenceStart': t,
                 'startFrame': round(snapped*base['fps']), 'start': round(snapped*base['fps'])/base['fps'],
                 'recognitionStatus': confidence})
for i,cue in enumerate(cues):
    cue['endFrame'] = cues[i+1]['startFrame'] if i<len(cues)-1 else base['durationInFrames']
    cue['end'] = cue['endFrame']/base['fps']
assert all(c['startFrame']<c['endFrame'] for c in cues)
chapter_specs = [(1,'搬进巷子','intro'),(2,'早餐没送出去','job'),(3,'操场的亮窗','field'),
                 (4,'陪伴与退缩','calendar'),(5,'等下课','square'),(6,'终于回头','distance'),
                 (7,'同一夜的另一面','fieldReverse'),(8,'信与空位','waitingAgain'),(9,'留下心意','walkingAway')]
chapters=[]
for id,name,key in chapter_specs:
    cue=next(c for c in cues if c['key']==key)
    chapters.append({'id':id,'name':name,'startFrame':cue['startFrame'],'start':cue['start']})
for i,ch in enumerate(chapters):
    ch['endFrame']=chapters[i+1]['startFrame'] if i<8 else base['durationInFrames']
    ch['end']=ch['endFrame']/base['fps']
result = {k:base[k] for k in ['duration','durationInFrames','fps','bpm','beatOffset','bgmFile','sourceFile','beats']}
result.update({'hasBgm':True,'beatVerified':False,'timingMethod':mapping_method,
               'recordingTimeScale':float(scale),'recordingIntroOffset':float(offset),
               'localRecognitionAnchors':len(matches),'manualLyricVerification':False,
               'chapters':chapters,'cues':cues})
(root/'src/lyric-timeline.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(root/'.cache/local-lyric-alignment.json').write_text(json.dumps({'anchors':matches,'scale':float(scale),'offset':float(offset)},indent=2),encoding='utf-8')
print(json.dumps({'method':mapping_method,'anchors':len(matches),'scale':float(scale),'offset':float(offset),
                  'chapters':[{k:ch[k] for k in ['name','start']} for ch in chapters]},ensure_ascii=False,indent=2))
