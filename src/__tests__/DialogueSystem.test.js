import { expect, vi } from 'vitest';
import { DialogueSystem } from '../systems/DialogueSystem.js';

vi.mock('../ui/DialogueBox.js', () => ({
  DialogueBox: class { setNode() {} setFeedback() {} selectOption() {} draw() {} }
}));
vi.mock('../systems/InputManager.js', () => ({
  InputManager: { dialogueActive: false, consumeKey: () => false, consumeClick: () => null, click: null }
}));

describe('DialogueSystem', () => {
  it('no está activo antes de start()', () => {
    const ds = new DialogueSystem();
    expect(ds.isActive).toBe(false);
  });

  it('está activo después de start()', () => {
    const ds = new DialogueSystem();
    ds.start([{ type: 'dialogue', speaker: 'X', face: null, text: 'Hola' }], () => {});
    expect(ds.isActive).toBe(true);
  });

  it('onComplete se llama al terminar todos los nodos', () => {
    const cb = vi.fn();
    const ds = new DialogueSystem();
    ds.start([{ type: 'dialogue', speaker: 'X', face: null, text: 'Solo' }], cb);
    ds._advance();
    expect(cb).toHaveBeenCalled();
    expect(ds.isActive).toBe(false);
  });
});
