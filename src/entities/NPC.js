// src/entities/NPC.js
import { Entity } from './Entity.js';
import { SpriteSheet } from '../utils/SpriteSheet.js';
import { AssetLoader } from '../engine/AssetLoader.js';

const FRAME_COLS = 6;
const FRAME_ROWS = 3;
const DRAW_W = 130;
const DRAW_H = 140;

export class NPC extends Entity {
  constructor({ id, x, y, spriteKey, faceKey, dialogueKey }) {
    super(x, y, DRAW_W, DRAW_H);
    this.id = id;
    this.spriteKey = spriteKey;
    this.faceKey = faceKey;
    this.dialogueKey = dialogueKey;
    const img = AssetLoader.get(spriteKey);
    const frameW = img.naturalWidth  / FRAME_COLS;
    const frameH = img.naturalHeight / FRAME_ROWS;
    this.sprite = new SpriteSheet(img, frameW, frameH, FRAME_COLS);
    this.inRange = false;
    this._bounceTimer = 0;
    this._bounceY = 0;
  }

  update(dt) {
    if (this.inRange) {
      this._bounceTimer += dt * 3;
      this._bounceY = Math.sin(this._bounceTimer) * 8;
    } else {
      this._bounceY = 0;
    }
  }

  draw(ctx) {
    if (!this.visible) return;
    const { sx, sy, sw, sh } = this.sprite.idle(0);
    ctx.drawImage(this.sprite.image, sx, sy, sw, sh, this.x, this.y, DRAW_W, DRAW_H);

    if (this.inRange) {
      ctx.save();
      ctx.fillStyle = '#FFD700';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.font = 'bold 40px monospace';
      ctx.textAlign = 'center';
      ctx.strokeText('!', this.x + DRAW_W / 2, this.y - 12 + this._bounceY);
      ctx.fillText('!', this.x + DRAW_W / 2, this.y - 12 + this._bounceY);
      ctx.restore();
    }
  }
}
