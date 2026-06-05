// src/scenes/WorldMapScene.js
import { Scene } from './Scene.js';
import { InputManager } from '../systems/InputManager.js';
import { AssetLoader } from '../engine/AssetLoader.js';
import { SaveManager } from '../systems/SaveManager.js';
import { EP0Scene } from './EP0Scene.js';
import { EP1Scene } from './EP1Scene.js';
import { EP2Scene } from './EP2Scene.js';
import { EP3Scene } from './EP3Scene.js';
import { EP4Scene } from './EP4Scene.js';
import { EP5Scene } from './EP5Scene.js';
import { EP6Scene } from './EP6Scene.js';
import { EP7Scene } from './EP7Scene.js';
import { FinalScene } from './FinalScene.js';

const SCENE_MAP = {
  ep0: EP0Scene, ep1: EP1Scene, ep2: EP2Scene, ep3: EP3Scene,
  ep4: EP4Scene, ep5: EP5Scene, ep6: EP6Scene, ep7: EP7Scene,
  ep_final: FinalScene
};

const HOTSPOTS = [
  { id: 'ep0',     x: 350,  y: 820, r: 40, label: 'Entrada a la Finca' },
  { id: 'ep1',     x: 480,  y: 650, r: 40, label: 'El Potrero Perdido' },
  { id: 'ep2',     x: 680,  y: 460, r: 40, label: 'La Sala de Ordeño' },
  { id: 'ep3',     x: 870,  y: 500, r: 40, label: 'La Maternidad' },
  { id: 'ep4',     x: 1060, y: 450, r: 40, label: 'La Enfermería' },
  { id: 'ep5',     x: 1230, y: 570, r: 40, label: 'El Silo y la Dieta' },
  { id: 'ep6',     x: 1460, y: 420, r: 40, label: 'La Oficina del Gerente' },
  { id: 'ep7',     x: 1620, y: 680, r: 40, label: 'El Mercado Verde' },
  { id: 'ep_final',x: 960,  y: 300, r: 50, label: 'Episodio Final' },
];

export class WorldMapScene extends Scene {
  constructor(engine) {
    super(engine);
    this._state = null;
    this._hovered = null;
    this._pulseTimer = 0;
  }

  init() {
    this._state = SaveManager.load();
  }

  update(dt) {
    this._pulseTimer += dt;
    this._state = SaveManager.load();

    const mouse = InputManager.click;
    this._hovered = null;
    if (mouse) {
      const h = HOTSPOTS.find(h => Math.hypot(mouse.x - h.x, mouse.y - h.y) <= h.r);
      if (h) this._hovered = h.id;
    }

    const click = InputManager.consumeClick();
    if (click) {
      const h = HOTSPOTS.find(h => Math.hypot(click.x - h.x, click.y - h.y) <= h.r);
      if (h) {
        const st = this._state.episodios[h.id];
        if (st === 'disponible' || st === 'en_progreso') {
          const SceneCls = SCENE_MAP[h.id];
          if (SceneCls) this.engine.sceneManager.replace(new SceneCls(this.engine));
        }
      }
    }
  }

  draw(ctx) {
    const bg = AssetLoader.get('world_map');
    ctx.drawImage(bg, 0, 0, 1920, 1080);

    HOTSPOTS.forEach(h => {
      const st = this._state?.episodios[h.id] ?? 'bloqueado';
      const pulse = 1 + Math.sin(this._pulseTimer * 4) * 0.15;

      ctx.save();
      if (st === 'bloqueado') {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#555';
        ctx.beginPath(); ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#aaa';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('🔒', h.x, h.y + 8);
      } else if (st === 'completado') {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath(); ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#00304D';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('★', h.x, h.y + 8);
      } else {
        const color = st === 'en_progreso' ? '#FDC300' : '#39A900';
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(h.x, h.y, h.r * pulse * 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2); ctx.fill();
      }

      if (this._hovered === h.id) {
        const tw = ctx.measureText(h.label).width + 20;
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.beginPath();
        ctx.roundRect(h.x - tw / 2, h.y - h.r - 40, tw, 28, 6);
        ctx.fill();
        ctx.fillStyle = '#FDC300';
        ctx.font = '18px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(h.label, h.x, h.y - h.r - 20);
      }

      ctx.restore();
    });

    ctx.textAlign = 'left';
  }
}
