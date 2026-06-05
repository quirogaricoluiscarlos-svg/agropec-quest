// src/entities/NPC.js
import { Entity } from './Entity.js';
import { SpriteSheet } from '../utils/SpriteSheet.js';
import { AssetLoader } from '../engine/AssetLoader.js';

const SPRITE_W = 32;
const SPRITE_H = 48;

export class NPC extends Entity {
  constructor({ id, x, y, spriteKey, faceKey, dialogueKey }) {
    super(x, y, SPRITE_W, SPRITE_H);
    this.id = id;
    this.spriteKey = spriteKey;
    this.faceKey = faceKey;
    this.dialogueKey = dialogueKey;
    this.sprite = new SpriteSheet(AssetLoader.get(spriteKey), SPRITE_W, SPRITE_H, 6);
    this.inRange = false;
    this._bounceTimer = 0;
    this._bounceY = 0;
  }

  update(dt) {
    if (this.inRange) {
      this._bounceTimer += dt * 4;
      this._bounceY = Math.sin(this._bounceTimer) * 4;
    } else {
      this._bounceY = 0;
    }
  }

  draw(ctx) {
    if (!this.visible) return;
    const { sx, sy, sw, sh } = this.sprite.idle(0);
    ctx.drawImage(this.sprite.image, sx, sy, sw, sh, this.x, this.y, this.width, this.height);

    if (this.inRange) {
      ctx.save();
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('!', this.x + this.width / 2, this.y - 8 + this._bounceY);
      ctx.restore();
    }
  }
}
