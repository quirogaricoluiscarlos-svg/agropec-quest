// src/entities/Entity.js
export class Entity {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.visible = true;
  }
  update(_dt) {}
  draw(_ctx) {}
}
