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

    // Panel principal
    ctx.fillStyle = 'rgba(0,20,40,0.88)';
    ctx.strokeStyle = '#FDC300';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(14, 14, 500, 88, 12);
    ctx.fill();
    ctx.stroke();

    // Retrato
    if (playerFaceKey) {
      try {
        const img = AssetLoader.get(playerFaceKey);
        const sw = img.naturalWidth / 2;
        ctx.drawImage(img, sw, 0, sw, img.naturalHeight, 22, 20, 70, 70);
      } catch {}
    }

    // Nombre del episodio
    ctx.fillStyle = '#FDC300';
    ctx.font = 'bold 26px monospace';
    ctx.fillText(this._episodeName, 104, 48);

    // Barra de progreso
    const barX = 104, barY = 60, barW = 380, barH = 22;
    const filled = this._totalMissions > 0 ? this._completedMissions / this._totalMissions : 0;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#39A900';
    ctx.fillRect(barX, barY, Math.floor(barW * filled), barH);
    ctx.strokeStyle = '#39A900';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barW, barH);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`${this._completedMissions}/${this._totalMissions} misiones completadas`, barX + 6, barY + 17);

    ctx.restore();
  }
}
