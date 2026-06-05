import { AssetLoader } from '../engine/AssetLoader.js';

const BOX_X = 40, BOX_Y = 780, BOX_W = 1840, BOX_H = 260;
const PAD = 20, FACE_SIZE = 100;

export class DialogueBox {
  constructor() {
    this._node = null;
    this._selectedOption = 0;
    this._feedback = null;
    this._feedbackOk = false;
  }

  setNode(node, selectedOption = 0) {
    this._node = node;
    this._selectedOption = selectedOption;
    this._feedback = null;
  }

  setFeedback(text, isOk) {
    this._feedback = text;
    this._feedbackOk = isOk;
  }

  selectOption(idx) { this._selectedOption = idx; }

  draw(ctx) {
    if (!this._node) return;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.82)';
    ctx.strokeStyle = '#39A900';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(BOX_X, BOX_Y, BOX_W, BOX_H, 8);
    ctx.fill();
    ctx.stroke();

    if (this._node.face) {
      try {
        const img = AssetLoader.get(this._node.face);
        ctx.drawImage(img, BOX_X + PAD, BOX_Y + PAD, FACE_SIZE, FACE_SIZE);
      } catch {}
    }

    const textX = BOX_X + PAD + FACE_SIZE + PAD;
    const textW = BOX_W - FACE_SIZE - PAD * 3;

    if (this._node.type === 'dialogue') {
      ctx.fillStyle = '#39A900';
      ctx.font = 'bold 22px monospace';
      ctx.fillText(this._node.speaker ?? '', textX, BOX_Y + PAD + 22);
      ctx.fillStyle = '#fff';
      ctx.font = '20px monospace';
      this._wrapText(ctx, this._node.text, textX, BOX_Y + PAD + 56, textW, 26);
      ctx.fillStyle = '#aaa';
      ctx.font = '16px monospace';
      ctx.fillText('[ESPACIO / ENTER]', BOX_X + BOX_W - 220, BOX_Y + BOX_H - 16);
    } else if (this._node.type === 'quiz') {
      ctx.fillStyle = '#FDC300';
      ctx.font = 'bold 20px monospace';
      this._wrapText(ctx, this._node.question, textX, BOX_Y + PAD + 24, textW, 26);
      const optY = BOX_Y + PAD + 80;
      this._node.options.forEach((opt, i) => {
        const sel = i === this._selectedOption;
        ctx.fillStyle = sel ? '#39A900' : '#ccc';
        ctx.font = sel ? 'bold 19px monospace' : '19px monospace';
        ctx.fillText(`${i + 1}. ${opt}`, textX, optY + i * 32);
      });
      if (this._feedback) {
        ctx.fillStyle = this._feedbackOk ? '#39A900' : '#e55';
        ctx.font = 'bold 18px monospace';
        ctx.fillText(this._feedback, textX, BOX_Y + BOX_H - 20);
      }
    }
    ctx.restore();
  }

  _wrapText(ctx, text, x, y, maxW, lineH) {
    const words = text.split(' ');
    let line = '', curY = y;
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, x, curY); line = word; curY += lineH;
      } else { line = test; }
    }
    if (line) ctx.fillText(line, x, curY);
  }
}
