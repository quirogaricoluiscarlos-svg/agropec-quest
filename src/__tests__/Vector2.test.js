import { expect } from 'vitest';
import { Vector2 } from '../utils/Vector2.js';

describe('Vector2', () => {
  it('distance calcula distancia euclidiana', () => {
    expect(Vector2.distance({x:0,y:0}, {x:3,y:4})).toBe(5);
  });

  it('normalize devuelve vector unitario', () => {
    const n = Vector2.normalize({x:3, y:4});
    expect(n.x).toBeCloseTo(0.6);
    expect(n.y).toBeCloseTo(0.8);
  });

  it('normalize vector cero devuelve {x:0,y:0}', () => {
    expect(Vector2.normalize({x:0,y:0})).toEqual({x:0,y:0});
  });

  it('lerp interpola correctamente', () => {
    const r = Vector2.lerp({x:0,y:0}, {x:10,y:20}, 0.5);
    expect(r).toEqual({x:5,y:10});
  });
});
