/* ============================================================
   AUDIO SYSTEM — Programmatic Sound Effects via Web Audio API
   No external audio files needed. All sounds are synthesized.
   ============================================================ */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

// Resume audio context on user interaction (browser policy)
export function resumeAudio() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
}

// ── Sound Generators ──────────────────────────────────────

export function playUIHover() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(2800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.05);
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.05);
}

export function playUIClick() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'square';
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.1);
}

export function playBootBeep() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, ctx.currentTime);
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.12);
}

export function playTransitionStatic() {
  const ctx = getAudioContext();
  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 3000;
  filter.Q.value = 0.5;
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  noise.start(ctx.currentTime);
  noise.stop(ctx.currentTime + 0.15);
}

export function playKillFeedSound() {
  const ctx = getAudioContext();
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(880, ctx.currentTime);
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(1100, ctx.currentTime);
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc1.start(ctx.currentTime);
  osc2.start(ctx.currentTime);
  osc1.stop(ctx.currentTime + 0.2);
  osc2.stop(ctx.currentTime + 0.2);
}

export function playMenuOpen() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
}

export function playGunshot() {
  const ctx = getAudioContext();
  // White noise burst for the "crack"
  const bufferSize = ctx.sampleRate * 0.08;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.01));
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 2000;
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  noise.start(ctx.currentTime);
  noise.stop(ctx.currentTime + 0.1);
  
  // Low thump
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
  oscGain.gain.setValueAtTime(0.15, ctx.currentTime);
  oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.12);
}

export function playLevelUp() {
  const ctx = getAudioContext();
  const t = ctx.currentTime;
  
  // High energy fanfare: C4 -> E4 -> G4 -> C5 arpeggio
  const notes = [261.63, 329.63, 392.00, 523.25];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t + idx * 0.08);
    osc.frequency.exponentialRampToValueAtTime(freq * 2, t + idx * 0.08 + 0.2);
    
    // Bandpass filter to make it sound laser/synth-like
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.5, t + idx * 0.08);
    filter.Q.value = 1.0;
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    gain.gain.setValueAtTime(0.001, t + idx * 0.08);
    gain.gain.linearRampToValueAtTime(0.08, t + idx * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.35);
    
    osc.start(t + idx * 0.08);
    osc.stop(t + idx * 0.08 + 0.4);
  });

  // Deep military sub-bass swell
  const subOsc = ctx.createOscillator();
  const subGain = ctx.createGain();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(80, t);
  subOsc.frequency.linearRampToValueAtTime(50, t + 0.6);
  
  subOsc.connect(subGain);
  subGain.connect(ctx.destination);
  
  subGain.gain.setValueAtTime(0.12, t);
  subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
  
  subOsc.start(t);
  subOsc.stop(t + 0.8);
}

export function playObjectiveComplete() {
  const ctx = getAudioContext();
  const t = ctx.currentTime;
  
  // Double tone up beep (e.g. 1200Hz then 1800Hz)
  [1200, 1800].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t + idx * 0.06);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    gain.gain.setValueAtTime(0.08, t + idx * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.1);
    
    osc.start(t + idx * 0.06);
    osc.stop(t + idx * 0.06 + 0.12);
  });
}

export function playWeaponEquip() {
  const ctx = getAudioContext();
  const t = ctx.currentTime;
  
  // Double click/clank mechanical slide sound
  // First click: slide starts
  const bufferSize = ctx.sampleRate * 0.12;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const decay = Math.exp(-i / (ctx.sampleRate * 0.02));
    const noise = Math.random() * 2 - 1;
    // Add two distinct volume spikes to simulate "slide back, lock forward"
    const spike1 = Math.exp(-Math.abs(i - ctx.sampleRate * 0.01) / (ctx.sampleRate * 0.005));
    const spike2 = Math.exp(-Math.abs(i - ctx.sampleRate * 0.07) / (ctx.sampleRate * 0.008));
    data[i] = noise * (spike1 * 0.5 + spike2 * 0.8) * decay;
  }
  
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1200;
  filter.Q.value = 2.0;
  
  const gain = ctx.createGain();
  
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  
  gain.gain.setValueAtTime(0.12, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  
  src.start(t);
  src.stop(t + 0.15);
  
  // Low metallic resonance sweep
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(300, t);
  osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);
  
  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  oscGain.gain.setValueAtTime(0.06, t);
  oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  
  osc.start(t);
  osc.stop(t + 0.15);
}

export function playHackingSound() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  // High register glitchy chirp
  osc.frequency.setValueAtTime(2500 + Math.random() * 800, ctx.currentTime);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  gain.gain.setValueAtTime(0.03, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
  
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.025);
}

export function playTypingBriefing() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1800 + Math.random() * 400, ctx.currentTime);
  
  // Apply bandpass to resemble low-quality terminal speak
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2000;
  filter.Q.value = 5;
  
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  
  gain.gain.setValueAtTime(0.02, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015);
  
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.02);
}

