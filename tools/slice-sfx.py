# Cuts one-shot sound effects out of Lyria's generated punch and glass clips: finds the sharpest
# transients that have quiet just before them, and exports a short faded slice of each.
# Usage: python3 tools/slice-sfx.py   (reads public/sfx/raw-*.mp3, writes public/sfx/punch*.mp3, glass*.mp3)
import subprocess, numpy as np

def load(path, sr=44100):
    pcm = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', path, '-ac', '1', '-ar', str(sr), '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768, sr

def slices(name, count, length, pre_quiet):
    x, sr = load(f'public/sfx/raw-{name}.mp3')
    hop = int(sr * 0.005)
    env = np.sqrt(np.convolve(x * x, np.ones(hop) / hop, mode='same'))[::hop]
    # Score: loud now, quiet in the 120 ms before.
    look = int(0.12 / 0.005)
    before = np.array([env[max(0, i - look):max(1, i - 2)].mean() for i in range(len(env))])
    score = env / (before + 1e-3)
    score[env < env.max() * 0.25] = 0
    picks = []
    for i in np.argsort(-score):
        if score[i] <= 0 or len(picks) >= count: break
        if before[i] > env.max() * pre_quiet: continue
        if all(abs(i - j) * 0.005 > length + 0.1 for j in picks): picks.append(i)
    picks.sort()
    for n, i in enumerate(picks):
        start = max(0, i * hop - int(sr * 0.01))
        seg = x[start:start + int(sr * length)].copy()
        fade = int(len(seg) * 0.4)
        seg[-fade:] *= np.linspace(1, 0, fade)
        seg /= max(1e-3, np.abs(seg).max()) / 0.9
        out = f'public/sfx/{ {"punches": "punch"}.get(name, name)}{n}.mp3'
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 's16le', '-ar', str(sr), '-ac', '1', '-i', '-',
                        '-c:a', 'libmp3lame', '-q:a', '5', out], input=(seg * 32767).astype(np.int16).tobytes(), check=True)
        print(out, f'at {i * 0.005:.2f}s score {score[i]:.1f}')

slices('punches', 6, 0.32, 0.12)
slices('glass', 4, 0.6, 0.2)
