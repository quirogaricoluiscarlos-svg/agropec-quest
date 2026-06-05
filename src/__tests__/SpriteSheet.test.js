import { vi } from 'vitest';
import { SpriteSheet } from '../utils/SpriteSheet.js';

const fakeImg = {};

describe('SpriteSheet', () => {
  it('getFrame calcula coordenadas correctas', () => {
    const ss = new SpriteSheet(fakeImg, 32, 48, 6);
    expect(ss.getFrame(0, 0)).toEqual({ sx:0,  sy:0,  sw:32, sh:48 });
    expect(ss.getFrame(0, 1)).toEqual({ sx:32, sy:0,  sw:32, sh:48 });
    expect(ss.getFrame(1, 0)).toEqual({ sx:0,  sy:48, sw:32, sh:48 });
    expect(ss.getFrame(2, 3)).toEqual({ sx:96, sy:96, sw:32, sh:48 });
  });

  it('idle devuelve frame 0 de la fila dada', () => {
    const ss = new SpriteSheet(fakeImg, 32, 48, 6);
    expect(ss.idle(2)).toEqual({ sx:0, sy:96, sw:32, sh:48 });
  });

  it('animate avanza frame tras 150ms acumulado', () => {
    const ss = new SpriteSheet(fakeImg, 32, 48, 6);
    ss.animate(0.1, 2, 6);
    expect(ss.getFrame(2, ss._col)).toEqual(ss.getFrame(2, 0));
    ss.animate(0.06, 2, 6);
    expect(ss._col).toBe(1);
  });
});
