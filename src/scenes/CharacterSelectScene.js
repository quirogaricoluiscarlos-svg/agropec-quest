// src/scenes/CharacterSelectScene.js
import { Scene } from './Scene.js';
import { InputManager } from '../systems/InputManager.js';
import { AssetLoader } from '../engine/AssetLoader.js';
import { SaveManager } from '../systems/SaveManager.js';
import { WorldMapScene } from './WorldMapScene.js';

const CHARACTERS = [
  { id: 'aprendiz_m', name: 'Andrés', role: 'Aprendiz SENA', faceKey: 'face_andres',
    attrs: { Salud: 80, Agilidad: 90, Conocimiento: 70, Gestión: 60 },
    habilidad: 'Aprendizaje Acelerado' },
  { id: 'aprendiz_f', name: 'Valentina', role: 'Aprendiz SENA', faceKey: 'face_valentina',
    attrs: { Salud: 75, Agilidad: 80, Conocimiento: 85, Gestión: 60 },
    habilidad: 'Ojo Clínico' }
];

export class CharacterSelectScene extends Scene {
  constructor(engine) {
    super(engine);
    this._selected = 0;
  }

  update(_dt) {
    if (InputManager.consumeKey('ArrowLeft'))  this._selected = 0;
    if (InputManager.consumeKey('ArrowRight')) this._selected = 1;

    const click = InputManager.consumeClick();
    if (click) {
      if (click.x < 960) this._selected = 0;
      else this._selected = 1;
      if (this._inCard(click, this._selected)) this._confirm();
    }
    if (InputManager.consumeKey('Enter') || InputManager.consumeKey('Space')) this._confirm();
  }

  _confirm() {
    const ch = CHARACTERS[this._selected];
    const state = SaveManager.load();
    state.personaje = ch.id;
    SaveManager.save(state);
    this.engine.sceneManager.replace(new WorldMapScene(this.engine));
  }

  _inCard(pt, idx) {
    const x = idx === 0 ? 200 : 1020;
    return pt.x >= x && pt.x <= x + 700 && pt.y >= 200 && pt.y <= 900;
  }

  draw(ctx) {
    ctx.fillStyle = '#00304D';
    ctx.fillRect(0, 0, 1920, 1080);

    ctx.fillStyle = '#FDC300';
    ctx.font = 'bold 40px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('¿Quién será tu personaje?', 960, 100);

    CHARACTERS.forEach((ch, i) => {
      const x = i === 0 ? 200 : 1020;
      const isSelected = this._selected === i;

      ctx.fillStyle = isSelected ? 'rgba(57,169,0,0.2)' : 'rgba(255,255,255,0.05)';
      ctx.strokeStyle = isSelected ? '#39A900' : '#555';
      ctx.lineWidth = isSelected ? 4 : 2;
      ctx.beginPath();
      ctx.roundRect(x, 150, 700, 780, 12);
      ctx.fill(); ctx.stroke();

      try {
        const img = AssetLoader.get(ch.faceKey);
        ctx.drawImage(img, x + 175, 180, 350, 350);
      } catch {}

      ctx.textAlign = 'center';
      ctx.fillStyle = '#FDC300';
      ctx.font = 'bold 32px monospace';
      ctx.fillText(ch.name, x + 350, 570);

      ctx.fillStyle = '#aaa';
      ctx.font = '20px monospace';
      ctx.fillText(ch.role, x + 350, 605);

      ctx.fillStyle = '#39A900';
      ctx.font = '18px monospace';
      ctx.fillText(`★ ${ch.habilidad}`, x + 350, 640);

      let attrY = 680;
      Object.entries(ch.attrs).forEach(([k, v]) => {
        ctx.fillStyle = '#ccc';
        ctx.font = '16px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(k, x + 80, attrY);
        ctx.fillStyle = '#333';
        ctx.fillRect(x + 200, attrY - 14, 300, 16);
        ctx.fillStyle = '#39A900';
        ctx.fillRect(x + 200, attrY - 14, Math.floor(300 * v / 100), 16);
        attrY += 30;
      });

      if (isSelected) {
        ctx.fillStyle = '#39A900';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('[ ENTER para confirmar ]', x + 350, 870);
      }
    });

    ctx.textAlign = 'left';
  }
}
