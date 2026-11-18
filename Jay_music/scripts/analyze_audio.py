"""Analyze local audio without a network service; keep the measured grid inspectable."""
import json
import subprocess
from pathlib import Path
import numpy as np
from scipy import signal
from scipy.io import wavfile

ROOT = Path(__file__).resolve().parents[1]
BIN = ROOT / 'node_modules/@remotion/compositor-win32-x64-msvc'
source = next(ROOT.glob('*.mp3'))
cache = ROOT / '.cache'
cache.mkdir(exist_ok=True)
raw = cache / 'analysis.wav'
subprocess.run([str(BIN / 'ffmpeg.exe'), '-y', '-v', 'error', '-i', str(source),
                '-ac', '1', '-ar', '22050', '-c:a', 'pcm_s16le', str(raw)], check=True)
_, pcm = wavfile.read(raw)
samples = pcm.astype(np.float32)/32768
sr, hop = 22050, 220
duration = len(samples) / sr
freq, times, z = signal.stft(samples, sr, nperseg=2048, noverlap=2048-hop)
mag = np.abs(z)
bands = [(40, 180), (180, 700), (700, 3000), (3000, 8000)]
fluxes = []
for low, high in bands:
    selected = mag[(freq >= low) & (freq < high)]
    logmag = np.log1p(selected * 150)
    flux = np.maximum(np.diff(logmag, axis=1, prepend=logmag[:, :1]), 0).mean(axis=0)
    fluxes.append(flux / (np.quantile(flux, .95) + 1e-9))
onset = .45*fluxes[0] + .25*fluxes[1] + .2*fluxes[2] + .1*fluxes[3]
onset = np.maximum(onset - signal.medfilt(onset, 101)*.65, 0)
dt = hop / sr
active = (times > 12) & (times < duration-10)
o = onset[active] - np.mean(onset[active])
autocorr = signal.fftconvolve(o, o[::-1], mode='full')[len(o)-1:]
autocorr /= np.maximum(1, len(o)-np.arange(len(o)))
bpms = np.arange(65, 101, .02)
lags = (60/bpms)/dt
score = np.interp(lags, np.arange(len(autocorr)), autocorr)
score += .5*np.interp(lags*2, np.arange(len(autocorr)), autocorr)
score += .25*np.interp(lags*4, np.arange(len(autocorr)), autocorr)
tempo = float(bpms[np.argmax(score)])
# Refine tempo and phase on the complete recording, weighted towards percussion.
best = (-1, tempo, 0)
for bpm in np.arange(tempo-.6, tempo+.601, .005):
    step = 60/bpm
    for phase in np.arange(0, step, .01):
        grid = np.arange(phase+step*16, duration-8, step)
        strength = np.interp(grid, times, onset).mean()
        if strength > best[0]:
            best = (float(strength), float(bpm), float(phase))
_, tempo, phase = best
step = 60/tempo
beats = np.arange(phase, duration, step)
# Select a local vocal-band attack near the previously selected lyric line.
# The old lyric timestamps came from a 270s reference; they are guidance only.
timeline = json.loads((ROOT / 'src/timeline.json').read_text(encoding='utf-8'))
timeline['duration'] = duration
timeline['durationInFrames'] = int(np.ceil(duration*timeline['fps']))
timeline['bpm'] = round(tempo, 4)
timeline['beatOffset'] = round(phase, 4)
timeline['beatVerified'] = False
timeline['beatMethod'] = 'Offline spectral-flux/autocorrelation grid estimate; not manually verified'
timeline['hasBgm'] = True
timeline['bgmFile'] = 'audio/bgm.mp3'
timeline['sourceFile'] = source.name
timeline['timingNote'] = 'Lyric cue times are adapted from the earlier 270s reference; vocal attacks are signal estimates, not a verified transcription.'
timeline['beats'] = [round(float(b), 5) for b in beats]
vocal = fluxes[2]
peaks, _ = signal.find_peaks(vocal, distance=int(.25/dt), prominence=.08)
for i, shot in enumerate(timeline['shots']):
    if not i:
        shot['startFrame'] = 0
        shot['start'] = 0
        continue
    target = shot['targetOnset']*duration/270
    possible = peaks[(times[peaks] > target-1.6) & (times[peaks] < target+1.6)]
    if len(possible):
        ranking = vocal[possible] - np.abs(times[possible]-target)*.28
        detected = float(times[possible[np.argmax(ranking)]])
    else:
        detected = target
    nearest = float(beats[np.argmin(np.abs(beats-detected))])
    shot['estimatedVocalAttack'] = round(detected, 4)
    shot['startFrame'] = round(nearest*timeline['fps'])
    shot['start'] = shot['startFrame']/timeline['fps']
    shot['beatTime'] = round(nearest, 5)
for i, shot in enumerate(timeline['shots']):
    shot['endFrame'] = timeline['shots'][i+1]['startFrame'] if i<8 else timeline['durationInFrames']
    shot['end'] = shot['endFrame']/timeline['fps']
(ROOT / 'src/timeline.json').write_text(json.dumps(timeline, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
report = {'duration': duration, 'bpm': tempo, 'phase': phase, 'beatCount': len(beats),
          'gridStrength': best[0], 'cuts': [s['start'] for s in timeline['shots']],
          'verifiedByListening': False}
(cache / 'audio-analysis.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report, indent=2))
