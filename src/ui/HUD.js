// src/ui/HUD.js
import { AssetLoader } from '../engine/AssetLoader.js';

export class HUD {
  constructor() {
    this._episodeName = '';
    this._totalMissions = 0;
    this._completedMissions = 0;
    this._visible = false;
  }

  show(episodeName, totalMissions) {
    this._episodeName = episodeName;
    this._totalMissions = totalMissions;
    this._completedMissions = 0;
    this._visible = true;
  }

  hide() { this._visible = false; }

  setProgress(completed) { this._completedMissions = completed; }

  draw(ctx, playerFaceKey) {
    if (!this._visible) return;
    ctx.save();

    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.beginPath();
    ctx.roundRect(10, 10, 340, 60, 8);
    ctx.fill();

    if (playerFaceKey) {
      try {
        const img = AssetLoader.get(playerFaceKey);
        ctx.drawImage(img, 16, 14, 52, 52);
      } catch {}
    }

    ctx.fillStyle = '#FDC300';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(this._episodeName, 76, 32);

    const barX = 76, barY = 42, barW = 240, barH = 16;
    const filled = this._totalMissions > 0 ? this._completedMissions / this._totalMissions : 0;
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#39A900';
    ctx.fillRect(barX, barY, Math.floor(barW * filled), barH);
    ctx.strokeStyle = '#39A900';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);

    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.fillText(`${this._completedMissions}/${this._totalMissions} misiones`, barX + 4, barY + 13);

    ctx.restore();
  }
}
