// src/engine/GameEngine.js
export class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvas.width = 1920;
    this.canvas.height = 1080;
    this._lastTime = 0;
    this._running = false;
    this.sceneManager = null;
    this._boundLoop = this._loop.bind(this);
    window.addEventListener('resize', () => this._resize());
    this._resize();
  }

  _resize() {
    const scaleX = window.innerWidth / 1920;
    const scaleY = window.innerHeight / 1080;
    const scale = Math.min(scaleX, scaleY);
    this.canvas.style.width = `${Math.floor(1920 * scale)}px`;
    this.canvas.style.height = `${Math.floor(1080 * scale)}px`;
  }

  start(sceneManager) {
    this.sceneManager = sceneManager;
    this._running = true;
    requestAnimationFrame(this._boundLoop);
  }

  _loop(timestamp) {
    if (!this._running) return;
    const dt = Math.min((timestamp - this._lastTime) / 1000, 0.1);
    this._lastTime = timestamp;
    this.ctx.clearRect(0, 0, 1920, 1080);
    this.sceneManager.update(dt);
    this.sceneManager.draw(this.ctx);
    requestAnimationFrame(this._boundLoop);
  }

  stop() { this._running = false; }
}
