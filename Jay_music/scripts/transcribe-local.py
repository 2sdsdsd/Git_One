"""Recognize the user's recording locally; download the model separately."""
import os
import sys
from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root/'.cache/asr-deps'))
os.environ['HF_HUB_DISABLE_XET'] = '1'
os.environ['HF_HUB_ETAG_TIMEOUT'] = '15'
os.environ['HF_HUB_DOWNLOAD_TIMEOUT'] = '60'
model = root/'.cache/whisper-base'

if '--download-only' in sys.argv:
    from huggingface_hub import snapshot_download
    snapshot_download('Systran/faster-whisper-base', local_dir=model,
                      allow_patterns=['*.bin', '*.json', '*.txt'], max_workers=3)
    print('Local model downloaded:', model, flush=True)
    raise SystemExit(0)

from faster_whisper import WhisperModel
engine = WhisperModel(str(model), device='cpu', compute_type='int8',
                      cpu_threads=min(8, os.cpu_count() or 4), local_files_only=True)
source = root/'obj_wo3DlMOGwrbDjj7DisKw_80894277075_37c5_6e4f_d41e_50989d1b4c3d0da0b3349a7a52aa6778.mp3'
segments, info = engine.transcribe(str(source), language='zh', beam_size=5,
                                  word_timestamps=True, vad_filter=False,
                                  condition_on_previous_text=False,
                                  initial_prompt='中文歌曲，巷子、公寓、大学、工作、蛋饼、早餐、学校、操场、耳机、情书、等下课。')
result = {'source': source.name, 'duration': info.duration, 'language': info.language,
          'method': 'faster-whisper-base/int8 on local CPU; song recognition may contain mistakes',
          'segments': []}
print('Recognizing local MP3...', flush=True)
for segment in segments:
    item = {'start': segment.start, 'end': segment.end, 'text': segment.text,
            'avgLogProbability': segment.avg_logprob,
            'words': [{'start': w.start, 'end': w.end, 'word': w.word, 'probability': w.probability}
                      for w in segment.words or []]}
    result['segments'].append(item)
    (root/'.cache/local-transcription.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'{segment.start:.2f}-{segment.end:.2f}: {segment.text}', flush=True)
print('Complete:', root/'.cache/local-transcription.json', flush=True)
