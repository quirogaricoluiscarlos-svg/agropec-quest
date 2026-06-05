// src/systems/AudioManager.js
// Web Audio API — melodía retro RPG 8-bit

const T = 60 / 110; // segundos por beat a 110 BPM

// Frecuencias de notas (Hz)
const N = {
  C3:131,D3:147,E3:165,F3:175,G3:196,A3:220,B3:247,
  C4:262,D4:294,E4:330,F4:349,G4:392,A4:440,B4:494,
  C5:523,D5:587,E5:659,F5:698,G5:784,_:0
};

// Melodía principal (nota, duracion en beats)
const MELODY = [
  ['E4',1],['G4',1],['A4',2], ['G4',1],['E4',1],['D4',2],
  ['E4',0.5],['F4',0.5],['G4',1],['A4',1], ['G4',1.5],['E4',0.5],['D4',1],
  ['A4',1],['B4',1],['C5',2], ['B4',1],['A4',1],['G4',1],['E4',1],
  ['D4',1],['E4',1],['D4',0.5],['C4',0.5],['D4',4],
  ['C4',1],['E4',1],['G4',2], ['A4',1],['G4',1],['E4',2],
  ['F4',1],['E4',0.5],['D4',0.5],['C4',1],['D4',1], ['E4',2],['C4',2],
  ['G4',1],['A4',0.5],['G4',0.5],['F4',1],['E4',1], ['D4',1],['C4',1],['D4',1],['E4',1],
  ['C4',4],
];

// Bajo
const BASS = [
  ['C3',2],['G3',2], ['A3',2],['E3',2],
  ['F3',2],['C3',2], ['G3',2],['G3',2],
  ['C3',2],['G3',2], ['A3',2],['E3',2],
  ['F3',4],          ['G3',2],['C3',2],
];

export const AudioManager = {
  _ctx: null,
  _masterGain: null,
  _playing: false,

  init() {
    // Se llama en el primer gesto del usuario
    if (this._ctx) return;
    this._ctx = new AudioContext();
    this._masterGain = this._ctx.createGain();
    this._masterGain.gain.value = 0.18;
    this._masterGain.connect(this._ctx.destination);
  },

  start() {
    if (this._playing) return;
    this.init();
    if (this._ctx.state === 'suspended') this._ctx.resume();
    this._playing = true;
    const now = this._ctx.currentTime + 0.1;
    const totalBeats = MELODY.reduce((s,[,b])=>s+b,0);
    const totalTime = totalBeats * T;
    this._scheduleSequence(MELODY, 'square',   0.22, now, totalTime);
    this._scheduleSequence(BASS,   'triangle', 0.14, now, totalTime);
  },

  stop() {
    this._playing = false;
  },

  playClick() {
    if (!this._ctx) return;
    this._blip(880, 'square', 0.06, 0.07);
  },

  playConfirm() {
    if (!this._ctx) return;
    this._blip(523, 'square', 0.1, 0.05);
    setTimeout(() => this._blip(659, 'square', 0.1, 0.08), 60);
    setTimeout(() => this._blip(784, 'square', 0.12, 0.15), 130);
  },

  _blip(freq, type, vol, dur) {
    const ctx = this._ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(this._masterGain);
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + dur + 0.01);
  },

  _scheduleSequence(seq, type, vol, startTime, loopDuration) {
    if (!this._playing || !this._ctx) return;
    let t = startTime;
    for (const [note, beats] of seq) {
      const freq = N[note] ?? 0;
      const dur  = beats * T;
      if (freq > 0) {
        const o = this._ctx.createOscillator();
        const g = this._ctx.createGain();
        o.connect(g); g.connect(this._masterGain);
        o.type = type;
        o.frequency.value = freq;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol, t + 0.02);
        g.gain.setValueAtTime(vol * 0.7, t + dur * 0.6);
        g.gain.linearRampToValueAtTime(0, t + dur - 0.02);
        o.start(t);
        o.stop(t + dur);
      }
      t += dur;
    }
    // Loop: re-schedule when sequence ends
    const delay = (startTime + loopDuration - this._ctx.currentTime) * 1000 - 200;
    setTimeout(() => {
      if (this._playing) this._scheduleSequence(seq, type, vol, startTime + loopDuration, loopDuration);
    }, Math.max(100, delay));
  }
};
