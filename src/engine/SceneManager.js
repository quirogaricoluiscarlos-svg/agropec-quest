export class SceneManager {
  constructor() {
    this._stack = [];
    this._fadeAlpha = 0;
    this._fadeTarget = 0;
    this._fadeSpeed = 3.33;
    this._pendingScene = null;
    this._pendingOp = null;
  }

  current() { return this._stack[this._stack.length - 1] ?? null; }

  push(scene) {
    this._stack.push(scene);
    scene.init?.();
  }

  pop() {
    const top = this._stack.pop();
    top?.destroy?.();
  }

  replace(scene) {
    this._pendingScene = scene;
    this._pendingOp = 'replace';
    this._fadeTarget = 1;
  }

  _doReplace(scene) {
    const top = this._stack.pop();
    top?.destroy?.();
    this._stack.push(scene);
    scene.init?.();
  }

  update(dt) {
    if (this._fadeAlpha < this._fadeTarget) {
      this._fadeAlpha = Math.min(this._fadeAlpha + this._fadeSpeed * dt, this._fadeTarget);
      if (this._fadeAlpha >= 1 && this._pendingScene) {
        this._doReplace(this._pendingScene);
        this._pendingScene = null;
        this._fadeTarget = 0;
      }
    } else if (this._fadeAlpha > this._fadeTarget) {
      this._fadeAlpha = Math.max(this._fadeAlpha - this._fadeSpeed * dt, this._fadeTarget);
    }
    this.current()?.update(dt);
  }

  draw(ctx) {
    this.current()?.draw(ctx);
    if (this._fadeAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = this._fadeAlpha;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 1920, 1080);
      ctx.restore();
    }
  }
}
