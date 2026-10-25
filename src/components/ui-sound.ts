let context: AudioContext | undefined;

/** A short synthesized cue, created only after a visitor interaction. */
export function playUiSound() {
  play([{ type: "sine", from: 620, to: 420, at: 0, length: .065, gain: .035 }]);
}

/**
 * The cues for interactive pieces (case-study demos and any live component). Each is a tone or two, synthesized,
 * quiet and short; they play only when the visitor has turned sound on (the sidebar's sound toggle).
 * - key: a character typed · erase: a character deleted
 * - click: a button, tab or option · toggle: a switch or choice flipped
 * - open / close: a menu or sheet · success / error: a check that passed or failed
 */
export type SoundCue = "key" | "erase" | "click" | "toggle" | "open" | "close" | "success" | "error";
type Tone = { type: OscillatorType; from: number; to: number; at: number; length: number; gain: number };
const cues: Record<SoundCue, Tone[]> = {
  key: [{ type: "triangle", from: 1900, to: 1500, at: 0, length: .028, gain: .018 }],
  erase: [{ type: "triangle", from: 1200, to: 900, at: 0, length: .032, gain: .018 }],
  click: [{ type: "sine", from: 620, to: 420, at: 0, length: .065, gain: .035 }],
  toggle: [{ type: "sine", from: 520, to: 520, at: 0, length: .05, gain: .03 }, { type: "sine", from: 780, to: 780, at: .05, length: .06, gain: .03 }],
  open: [{ type: "sine", from: 440, to: 720, at: 0, length: .08, gain: .028 }],
  close: [{ type: "sine", from: 720, to: 440, at: 0, length: .08, gain: .028 }],
  success: [{ type: "sine", from: 660, to: 660, at: 0, length: .08, gain: .032 }, { type: "sine", from: 990, to: 990, at: .08, length: .14, gain: .032 }],
  error: [{ type: "triangle", from: 330, to: 300, at: 0, length: .09, gain: .04 }, { type: "triangle", from: 260, to: 240, at: .1, length: .14, gain: .04 }],
};

/** Whether the visitor turned sound on (settings-store's "portfolio-sound"); read on each cue, so it follows the toggle. */
function soundOn() {
  try { return localStorage.getItem("portfolio-sound") === "on"; } catch { return false; }
}

export function playCue(cue: SoundCue) {
  if (soundOn()) play(cues[cue]);
}

function play(tones: Tone[]) {
  try {
    context ??= new AudioContext();
    const audio = context;
    void audio.resume().then(() => {
      const start = audio.currentTime;
      for (const { type, from, to, at, length, gain: level } of tones) {
        const tone = audio.createOscillator();
        const gain = audio.createGain();
        const now = start + at;
        tone.type = type;
        tone.frequency.setValueAtTime(from, now);
        if (to !== from) tone.frequency.exponentialRampToValueAtTime(to, now + length * .7);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(level, now + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + length);
        tone.connect(gain).connect(audio.destination);
        tone.start(now);
        tone.stop(now + length + .01);
        tone.onended = () => { tone.disconnect(); gain.disconnect(); };
      }
      window.dispatchEvent(new Event("portfolio:sound-played"));
    }).catch(() => {});
  } catch { /* Audio support is optional. */ }
}
