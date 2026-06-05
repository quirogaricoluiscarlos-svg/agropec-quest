const _keys = new Set();
const _justPressed = new Set();
let _click = null;

export const InputManager = {
  dialogueActive: false,
  get click() { return _click; },

  init(canvas) {
    window.addEventListener('keydown', e => {
      if (!_keys.has(e.code)) _justPressed.add(e.code);
      _keys.add(e.code);
      e.preventDefault();
    });
    window.addEventListener('keyup', e => { _keys.delete(e.code); });

    const toVirtual = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (clientX - rect.left) * (1920 / rect.width),
        y: (clientY - rect.top)  * (1080 / rect.height)
      };
    };

    canvas.addEventListener('mousedown', e => {
      _click = toVirtual(e.clientX, e.clientY);
    });
    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      const t = e.touches[0];
      _click = toVirtual(t.clientX, t.clientY);
    }, { passive: false });
  },

  isDown(code) { return _keys.has(code); },

  consumeKey(code) {
    if (_justPressed.has(code)) { _justPressed.delete(code); return true; }
    return false;
  },

  consumeClick() {
    const c = _click; _click = null; return c;
  },

  flush() { _justPressed.clear(); }
};
