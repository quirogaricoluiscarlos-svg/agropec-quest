// src/scenes/CharacterSelectScene.js
import { Scene } from './Scene.js';
import { InputManager } from '../systems/InputManager.js';
import { AssetLoader } from '../engine/AssetLoader.js';
import { SaveManager } from '../systems/SaveManager.js';
import { AudioManager } from '../systems/AudioManager.js';
import { WorldMapScene } from './WorldMapScene.js';

const CHARACTERS = [
  { id: 'aprendiz_m', name: 'ANDRÉS', role: 'Aprendiz SENA ♂', faceKey: 'face_andres',
    color: '#39A900',
    attrs: { SALUD: 80, AGILIDAD: 90, CONOCIMIENTO: 70, GESTIÓN: 60 },
    habilidad: 'Aprendizaje Acelerado',
    desc: 'Aprende más rápido que nadie. Con sus overoles SENA está listo para cualquier reto de la finca.' },
  { id: 'aprendiz_f', name: 'VALENTINA', role: 'Aprendiz SENA ♀', faceKey: 'face_valentina',
    color: '#cc4488',
    attrs: { SALUD: 75, AGILIDAD: 80, CONOCIMIENTO: 85, GESTIÓN: 60 },
    habilidad: 'Ojo Clínico',
    desc: 'Su enfoque técnico detecta problemas que otros no ven. Experta en inocuidad y buenas prácticas.' }
];

const ATTR_COLORS = { SALUD: '#ff4466', AGILIDAD: '#44ff88', CONOCIMIENTO: '#4488ff', GESTIÓN: '#ffaa00' };

export class CharacterSelectScene extends Scene {
  constructor(engine) {
    super(engine);
    this._selected = 0;
    this._time = 0;
  }

  update(dt) {
    this._time += dt;
    if (InputManager.consumeKey('ArrowLeft'))  { this._selected = 0; AudioManager.playClick(); }
    if (InputManager.consumeKey('ArrowRight')) { this._selected = 1; AudioManager.playClick(); }

    const click = InputManager.consumeClick();
    if (click) {
      const prev = this._selected;
      if (click.x < 960) this._selected = 0; else this._selected = 1;
      if (prev !== this._selected) AudioManager.playClick();
      if (this._inCard(click, this._selected)) this._confirm();
    }
    if (InputManager.consumeKey('Enter') || InputManager.consumeKey('Space')) this._confirm();
  }

  _confirm() {
    const ch = CHARACTERS[this._selected];
    const state = SaveManager.load();
    state.personaje = ch.id;
    SaveManager.save(state);
    AudioManager.playConfirm();
    this.engine.sceneManager.replace(new WorldMapScene(this.engine));
  }

  _inCard(pt, idx) {
    const x = idx === 0 ? 140 : 980;
    return pt.x >= x && pt.x <= x + 760 && pt.y >= 120 && pt.y <= 940;
  }

  draw(ctx) {
    // Fondo degradado
    const grad = ctx.createLinearGradient(0, 0, 0, 1080);
    grad.addColorStop(0, '#001a2d');
    grad.addColorStop(0.5, '#00304D');
    grad.addColorStop(1, '#001a1a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1920, 1080);

    // Título
    ctx.fillStyle = '#FDC300';
    ctx.font = 'bold 44px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ELIGE TU PERSONAJE', 960, 72);
    ctx.fillStyle = '#9dffcc';
    ctx.font = '20px monospace';
    ctx.fillText('CADA HÉROE TIENE HABILIDADES ÚNICAS EN LA FINCA', 960, 105);

    CHARACTERS.forEach((ch, i) => {
      const x = i === 0 ? 140 : 980;
      const isSelected = this._selected === i;
      const pulse = isSelected ? (0.5 + 0.5 * Math.sin(this._time * 3)) : 0;

      // Sombra / glow de la tarjeta
      if (isSelected) {
        ctx.save();
        ctx.shadowColor = ch.color;
        ctx.shadowBlur = 30 + pulse * 20;
        ctx.strokeStyle = ch.color;
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.roundRect(x, 120, 760, 820, 14); ctx.stroke();
        ctx.restore();
      }

      // Fondo de tarjeta
      ctx.fillStyle = isSelected ? 'rgba(0,10,20,0.92)' : 'rgba(0,8,16,0.75)';
      ctx.strokeStyle = isSelected ? ch.color : '#334';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.beginPath(); ctx.roundRect(x, 120, 760, 820, 14);
      ctx.fill(); ctx.stroke();

      // Retrato — mitad DERECHA del PNG (tarjeta con marco pixel art)
      try {
        const img = AssetLoader.get(ch.faceKey);
        const sw = img.naturalWidth / 2;
        const sh = img.naturalHeight;
        ctx.drawImage(img, sw, 0, sw, sh, x + 160, 148, 440, 360);
      } catch {}

      // Nombre
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FDC300';
      ctx.font = 'bold 36px monospace';
      ctx.fillText(ch.name, x + 380, 548);

      // Rol
      ctx.fillStyle = ch.color;
      ctx.font = 'bold 18px monospace';
      ctx.fillText(ch.role, x + 380, 582);

      // Habilidad especial
      ctx.fillStyle = 'rgba(253,195,0,0.12)';
      ctx.strokeStyle = 'rgba(253,195,0,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(x + 60, 600, 640, 44, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#FDC300';
      ctx.font = '14px monospace';
      ctx.fillText('⚡ HABILIDAD ESPECIAL', x + 380, 618);
      ctx.fillStyle = '#ffe9a0';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(ch.habilidad, x + 380, 638);

      // Descripción
      ctx.fillStyle = '#b0c8d0';
      ctx.font = '16px monospace';
      ctx.textAlign = 'left';
      const words = ch.desc.split(' ');
      let line = '', lineY = 672;
      words.forEach(w => {
        const test = line ? `${line} ${w}` : w;
        if (ctx.measureText(test).width > 620) {
          ctx.fillText(line, x + 70, lineY); line = w; lineY += 24;
        } else line = test;
      });
      if (line) ctx.fillText(line, x + 70, lineY);

      // Atributos
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.font = '13px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('── ATRIBUTOS ──', x + 70, 748);
      let attrY = 768;
      Object.entries(ch.attrs).forEach(([k, v]) => {
        ctx.fillStyle = '#aaa';
        ctx.font = '14px monospace';
        ctx.fillText(k, x + 70, attrY);
        // barra fondo
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(x + 210, attrY - 14, 520, 17);
        // barra valor
        ctx.fillStyle = ATTR_COLORS[k] ?? '#fff';
        ctx.fillRect(x + 210, attrY - 14, Math.floor(520 * v / 100), 17);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(v, x + 724, attrY);
        ctx.textAlign = 'left';
        attrY += 28;
      });

      // Botón confirmar
      if (isSelected) {
        ctx.save();
        ctx.shadowColor = ch.color;
        ctx.shadowBlur = 15 + pulse * 10;
        ctx.fillStyle = ch.color;
        ctx.beginPath(); ctx.roundRect(x + 80, 882, 600, 50, 8); ctx.fill();
        ctx.restore();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('✅  ELEGIR ESTE PERSONAJE', x + 380, 914);
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(x + 80, 882, 600, 50, 8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#555';
        ctx.font = '18px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Haz clic para ver este personaje', x + 380, 912);
      }
    });

    // Instrucción abajo
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('← → NAVEGAR   ·   ENTER CONFIRMAR', 960, 1055);
    ctx.textAlign = 'left';
  }
}
