let context: AudioContext | undefined;

/** A short synthesized cue, created only after a visitor interaction. */
export function playUiSound() {
  try {
    context ??= new AudioContext();
    const audio = context;
    void audio.resume().then(() => {
      const tone = audio.createOscillator();
      const gain = audio.createGain();
      const now = audio.currentTime;
      tone.type = "sine";
      tone.frequency.setValueAtTime(620, now);
      tone.frequency.exponentialRampToValueAtTime(420, now + 0.045);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.035, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);
      tone.connect(gain).connect(audio.destination);
      tone.start(now);
      window.dispatchEvent(new Event("portfolio:sound-played"));
      tone.stop(now + 0.075);
      tone.onended = () => { tone.disconnect(); gain.disconnect(); };
    }).catch(() => {});
  } catch { /* Audio support is optional. */ }
}

