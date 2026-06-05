import { vi } from 'vitest';
import { SceneManager } from '../engine/SceneManager.js';

const makeScene = (name) => ({
  name,
  init: vi.fn(),
  update: vi.fn(),
  draw: vi.fn(),
  destroy: vi.fn()
});

describe('SceneManager', () => {
  it('push agrega escena a la pila', () => {
    const sm = new SceneManager();
    const s = makeScene('A');
    sm.push(s);
    expect(sm.current()).toBe(s);
  });

  it('pop quita la escena superior', () => {
    const sm = new SceneManager();
    const a = makeScene('A'); const b = makeScene('B');
    sm.push(a); sm.push(b);
    sm.pop();
    expect(sm.current()).toBe(a);
  });

  it('replace destruye escena actual y pone la nueva', () => {
    const sm = new SceneManager();
    const a = makeScene('A'); const b = makeScene('B');
    sm.push(a);
    sm._doReplace(b);
    expect(a.destroy).toHaveBeenCalled();
    expect(sm.current()).toBe(b);
  });
});
