// src/scenes/TitleScene.js
import { Scene } from './Scene.js';
import { InputManager } from '../systems/InputManager.js';
import { SaveManager } from '../systems/SaveManager.js';
import { AssetLoader } from '../engine/AssetLoader.js';
import { AudioManager } from '../systems/AudioManager.js';
import { CharacterSelectScene } from './CharacterSelectScene.js';
import { WorldMapScene } from './WorldMapScene.js';

const BTN  = { x: 710, y: 580, w: 500, h: 72 };
const BTN2 = { x: 710, y: 668, w: 500, h: 60 };

export class TitleScene extends Scene {
  constructor(engine) {
    super(engine);
    this._hasSave = false;
    this._time = 0;
    this._audioStarted = false;
    this._stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      r: Math.random() * 2.5 + 0.5,
      speed: 0.4 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2
    }));
  }

  init() {
    this._hasSave = SaveManager.hasSave();
  }

  _startAudio() {
    if (this._audioStarted) return;
    this._audioStarted = true;
    AudioManager.start();
  }

  update(dt) {
    this._time += dt;

    const click = InputManager.consumeClick();
    if (click) {
      this._startAudio();
      if (this._inBtn(click, BTN)) {
        AudioManager.playConfirm();
        SaveManager.reset();
        this.engine.sceneManager.replace(new CharacterSelectScene(this.engine));
      } else if (this._hasSave && this._inBtn(click, BTN2)) {
        AudioManager.playConfirm();
        this.engine.sceneManager.replace(new WorldMapScene(this.engine));
      }
    }
    if (InputManager.consumeKey('Enter') || InputManager.consumeKey('Space')) {
      this._startAudio();
      AudioManager.playConfirm();
      SaveManager.reset();
      this.engine.sceneManager.replace(new CharacterSelectScene(this.engine));
    }
  }

  draw(ctx) {
    // Fondo: mapa mundial con overlay oscuro
    try {
      const bg = AssetLoader.get('world_map');
      ctx.drawImage(bg, 0, 0, 1920, 1080);
      ctx.fillStyle = 'rgba(0, 8, 18, 0.80)';
      ctx.fillRect(0, 0, 1920, 1080);
    } catch {
      ctx.fillStyle = '#000812';
      ctx.fillRect(0, 0, 1920, 1080);
    }

    // Estrellas animadas
    this._stars.forEach(s => {
      const alpha = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(this._time * s.speed + s.phase));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Logo flotante (offset sinusoidal)
    const floatY = Math.sin(this._time * 0.9) * 10;

    ctx.save();

    // SENA badge
    ctx.fillStyle = '#00304D';
    ctx.strokeStyle = '#FDC300';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(660, 180 + floatY, 600, 34, 4);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#FDC300';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('✦ SENA · CENTRO AGROINDUSTRIAL DEL META ✦', 960, 203 + floatY);

    // Título principal con glow
    ctx.shadowColor = '#5fd400';
    ctx.shadowBlur = 40;
    ctx.fillStyle = '#5fd400';
    ctx.font = 'bold 100px monospace';
    ctx.fillText('AGROPEC QUEST', 960, 310 + floatY);

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FDC300';
    ctx.font = 'bold 30px monospace';
    ctx.fillText('⚔  LA FINCA DEL SABER  ⚔', 960, 360 + floatY);

    ctx.fillStyle = '#9dff6e';
    ctx.font = '18px monospace';
    ctx.fillText('RPG EDUCATIVO GANADERO  ·  VERSIÓN 1.0', 960, 400 + floatY);

    ctx.restore();

    // Línea separadora
    ctx.strokeStyle = 'rgba(57,169,0,0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(400, 440); ctx.lineTo(1520, 440);
    ctx.stroke();

    // Botón JUGAR (pulsante)
    const pulse = 0.5 + 0.5 * Math.sin(this._time * 3);
    const glowSize = 10 + pulse * 20;
    ctx.save();
    ctx.shadowColor = '#39A900';
    ctx.shadowBlur = glowSize;
    this._drawBtn(ctx, BTN, '▶   NUEVA PARTIDA', '#39A900', '#fff', 28);
    ctx.restore();

    // Botón CONTINUAR
    if (this._hasSave) {
      this._drawBtn(ctx, BTN2, '↩   CONTINUAR PARTIDA', '#004d7a', '#FDC300', 22);
    }

    // Press start — parpadeo
    const blink = Math.sin(this._time * 4) > 0;
    if (blink) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('— PRESIONA ENTER PARA COMENZAR —', 960, 790);
    }

    // Competencia badge abajo
    ctx.fillStyle = 'rgba(0,30,60,0.85)';
    ctx.strokeStyle = '#39A900';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(460, 820, 1000, 38, 6);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#aaa';
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('🏛  COMPETENCIA: COORDINACIÓN DE PRODUCCIÓN PECUARIA  ·  9 EPISODIOS', 960, 844);

    ctx.textAlign = 'left';
  }

  _inBtn(pt, btn) {
    return pt.x >= btn.x && pt.x <= btn.x + btn.w && pt.y >= btn.y && pt.y <= btn.y + btn.h;
  }

  _drawBtn(ctx, btn, label, bg, fg, fontSize = 24) {
    ctx.fillStyle = bg;
    ctx.strokeStyle = fg;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 10);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = fg;
    ctx.font = `bold ${fontSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(label, btn.x + btn.w / 2, btn.y + btn.h / 2 + fontSize * 0.36);
  }
}
