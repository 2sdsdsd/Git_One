"""Mix the full recording in stereo and reserve peak headroom."""
from pathlib import Path
import json
import sys
import subprocess
import numpy as np
from scipy.io import wavfile

root = Path(__file__).resolve().parents[1]
cache = root/'.cache'
cache.mkdir(exist_ok=True)
ffmpeg = root/'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'
decoded = cache/'bgm-stereo.wav'
subprocess.run([str(ffmpeg), '-y', '-v', 'error', '-i', str(root/'public/audio/bgm.mp3'),
                '-ac', '2', '-ar', '44100', '-c:a', 'pcm_s16le', str(decoded)], check=True)
sr, bgm = wavfile.read(decoded)
sfx_name = sys.argv[1] if len(sys.argv)>1 else 'sfx.wav'
output_name = sys.argv[2] if len(sys.argv)>2 else 'mixed.wav'
sfx_sr, sfx = wavfile.read(root/'public/audio'/sfx_name)
assert sr == sfx_sr == 44100
bgm = bgm.astype(np.float32)/32768
sfx = sfx.astype(np.float32)/32768
count = min(len(sfx), len(bgm))
mixed = bgm*.92
mixed[:count] += sfx[:count, None]*(.55 if sfx_name=='lyric-sfx.wav' else .7)
peak = float(np.max(np.abs(mixed)))
gain = min(1., .97/max(peak, 1e-9))
mixed *= gain
wavfile.write(root/'public/audio'/output_name, sr, np.round(mixed*32767).astype(np.int16))
report = {'sampleRate': sr, 'channels': 2, 'duration': len(mixed)/sr,
          'peakBeforeHeadroom': peak, 'headroomGain': gain, 'peakAfterHeadroom': peak*gain}
(root/'out/audio-mix.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report, indent=2))
