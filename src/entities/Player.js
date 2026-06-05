// src/entities/Player.js
import { Entity } from './Entity.js';
import { SpriteSheet } from '../utils/SpriteSheet.js';
import { AssetLoader } from '../engine/AssetLoader.js';
import { InputManager } from '../systems/InputManager.js';
import { Vector2 } from '../utils/Vector2.js';

const SPRITE_W = 32;
const SPRITE_H = 48;
const SPEED    = 200;
const ROWS     = { idle: 0, walk: 2 };

export class Player extends Entity {
  constructor(spriteKey, x, y) {
    super(x, y, SPRITE_W, SPRITE_H);
    this.sprite = new SpriteSheet(AssetLoader.get(spriteKey), SPRITE_W, SPRITE_H, 6);
    this._facingLeft = false;
    this._moving = false;
    this._target = null;
    this._dt = 0;
  }

  update(dt) {
    this._dt = dt;
    if (InputManager.dialogueActive) { this._moving = false; return; }

    let dx = 0, dy = 0;
    if (InputManager.isDown('ArrowLeft') || InputManager.isDown('KeyA'))  { dx = -1; this._facingLeft = true; }
    if (InputManager.isDown('ArrowRight') || InputManager.isDown('KeyD')) { dx =  1; this._facingLeft = false; }
    if (InputManager.isDown('ArrowUp')   || InputManager.isDown('KeyW'))  dy = -1;
    if (InputManager.isDown('ArrowDown') || InputManager.isDown('KeyS'))  dy =  1;

    if (dx !== 0 || dy !== 0) {
      this._target = null;
      const n = Vector2.normalize({ x: dx, y: dy });
      this.x += n.x * SPEED * dt;
      this.y += n.y * SPEED * dt;
      this._moving = true;
    } else {
      const click = InputManager.consumeClick();
      if (click) this._target = click;

      if (this._target) {
        const d = Vector2.distance(this, this._target);
        if (d < 4) {
          this._target = null;
          this._moving = false;
        } else {
          const n = Vector2.normalize({ x: this._target.x - this.x, y: this._target.y - this.y });
          this.x += n.x * SPEED * dt;
          this.y += n.y * SPEED * dt;
          this._facingLeft = n.x < 0;
          this._moving = true;
        }
      } else {
        this._moving = false;
      }
    }

    this.x = Math.max(0, Math.min(1920 - this.width, this.x));
    this.y = Math.max(0, Math.min(1080 - this.height, this.y));
  }

  draw(ctx) {
    if (!this.visible) return;
    const row = this._moving ? ROWS.walk : ROWS.idle;
    const frame = this._moving
      ? this.sprite.animate(this._dt, row, 6)
      : this.sprite.idle(row);

    ctx.save();
    if (this._facingLeft) {
      ctx.translate(this.x + this.width, this.y);
      ctx.scale(-1, 1);
      ctx.drawImage(this.sprite.image, frame.sx, frame.sy, frame.sw, frame.sh, 0, 0, this.width, this.height);
    } else {
      ctx.drawImage(this.sprite.image, frame.sx, frame.sy, frame.sw, frame.sh, this.x, this.y, this.width, this.height);
    }
    ctx.restore();
  }
}
