export class SpriteSheet {
  constructor(image, frameWidth, frameHeight, cols) {
    this.image = image;
    this.fw = frameWidth;
    this.fh = frameHeight;
    this.cols = cols;
    this._col = 0;
    this._timer = 0;
  }

  getFrame(row, col) {
    return { sx: col * this.fw, sy: row * this.fh, sw: this.fw, sh: this.fh };
  }

  idle(row) {
    this._col = 0;
    this._timer = 0;
    return this.getFrame(row, 0);
  }

  animate(dt, row, numFrames) {
    this._timer += dt;
    if (this._timer >= 0.15) {
      this._timer -= 0.15;
      this._col = (this._col + 1) % numFrames;
    }
    return this.getFrame(row, this._col);
  }
}
