// src/scenes/TitleScene.js
import { Scene } from './Scene.js';
import { InputManager } from '../systems/InputManager.js';
import { SaveManager } from '../systems/SaveManager.js';
import { AssetLoader } from '../engine/AssetLoader.js';
import { CharacterSelectScene } from './CharacterSelectScene.js';
import { WorldMapScene } from './WorldMapScene.js';

const BTN  = { x: 810, y: 560, w: 300, h: 60 };
const BTN2 = { x: 810, y: 640, w: 300, h: 60 };

export class TitleScene extends Scene {
  constructor(engine) {
    super(engine);
    this._hasSave = false;
  }

  init() {
    this._hasSave = SaveManager.hasSave();
  }

  update(_dt) {
    const click = InputManager.consumeClick();
    if (click) {
      if (this._inBtn(click, BTN)) {
        SaveManager.reset();
        this.engine.sceneManager.replace(new CharacterSelectScene(this.engine));
      } else if (this._hasSave && this._inBtn(click, BTN2)) {
        this.engine.sceneManager.replace(new WorldMapScene(this.engine));
      }
    }
    if (InputManager.consumeKey('Enter') || InputManager.consumeKey('Space')) {
      SaveManager.reset();
      this.engine.sceneManager.replace(new CharacterSelectScene(this.engine));
    }
  }

  draw(ctx) {
    try {
      const bg = AssetLoader.get('world_map');
      ctx.drawImage(bg, 0, 0, 1920, 1080);
      ctx.fillStyle = 'rgba(0, 30, 60, 0.72)';
      ctx.fillRect(0, 0, 1920, 1080);
    } catch {
      ctx.fillStyle = '#00304D';
      ctx.fillRect(0, 0, 1920, 1080);
    }

    ctx.fillStyle = '#39A900';
    ctx.font = 'bold 72px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('AGROPEC QUEST', 960, 280);

    ctx.fillStyle = '#FDC300';
    ctx.font = '32px monospace';
    ctx.fillText('La Finca del Saber', 960, 340);

    ctx.fillStyle = '#aaa';
    ctx.font = '18px monospace';
    ctx.fillText('SENA — Centro Agroindustrial del Meta', 960, 390);

    this._drawBtn(ctx, BTN, 'NUEVA PARTIDA', '#39A900');
    if (this._hasSave) this._drawBtn(ctx, BTN2, 'CONTINUAR', '#FDC300');

    ctx.textAlign = 'left';
  }

  _inBtn(pt, btn) {
    return pt.x >= btn.x && pt.x <= btn.x + btn.w && pt.y >= btn.y && pt.y <= btn.y + btn.h;
  }

  _drawBtn(ctx, btn, label, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 8);
    ctx.fill();
    ctx.fillStyle = '#00304D';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, btn.x + btn.w / 2, btn.y + btn.h / 2 + 9);
  }
}
