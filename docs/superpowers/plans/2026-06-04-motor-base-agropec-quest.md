# Motor Base AGROPEC QUEST — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir el motor completo del juego AGROPEC QUEST — RPG educativo ganadero con 9 episodios, sistema de diálogos/quizzes, mapa mundial y guardado automático.

**Architecture:** Módulos ES6 vanilla sin bundler. Dependencias en orden: utils → engine → systems → entities → scenes → data. Resolución virtual 1920×1080 escalada por CSS al viewport.

**Tech Stack:** HTML5 Canvas API, JavaScript ES6+ (type="module"), Vitest para tests unitarios, live-server para desarrollo local.

---

## Interfaces clave (referencia para toda la implementación)

```
AssetLoader.get(key)              → HTMLImageElement
SceneManager.replace(scene)       → void (fade 300ms)
SceneManager.push(scene)          → void
SceneManager.pop()                → void
InputManager.isDown(key)          → bool
InputManager.consumeKey(key)      → bool (one-shot)
InputManager.consumeClick()       → {x,y} | null
InputManager.click                → {x,y} | null (peek)
InputManager.dialogueActive       → bool
SpriteSheet.getFrame(row,col)     → {sx,sy,sw,sh}
SpriteSheet.animate(dt,row,n)     → {sx,sy,sw,sh}
SpriteSheet.idle(row)             → {sx,sy,sw,sh}
Vector2.distance(a,b)             → number
Vector2.normalize(v)              → {x,y}
SaveManager.load()                → GameState
SaveManager.save(state)           → void
SaveManager.reset()               → void
DialogueSystem.start(nodes, cb)   → void
DialogueSystem.update(dt)         → void
DialogueSystem.draw(ctx)          → void
DialogueSystem.isActive           → bool
HUD.show(name, total)             → void
HUD.setProgress(completed)        → void
HUD.draw(ctx, playerFaceKey)      → void
```

---

## Task 1: Git + Vitest setup

**Files:**
- Modify: `package.json`
- Create: `vitest.config.js`
- Create: `src/__tests__/.gitkeep`

- [ ] **Step 1: Inicializar git**

```bash
cd f:\agropec-quest
git init
git add .gitignore README.md package.json index.html src/ docs/ assets/
git commit -m "chore: initial project structure with assets"
```

- [ ] **Step 2: Instalar Vitest**

```bash
npm install --save-dev vitest happy-dom
```

- [ ] **Step 3: Actualizar package.json**

```json
{
  "name": "agropec-quest",
  "version": "1.0.0",
  "description": "RPG educativo ganadero - SENA Colombia",
  "main": "index.html",
  "scripts": {
    "dev": "npx live-server --port=3000 --open=index.html",
    "test": "vitest run",
    "test:watch": "vitest",
    "build": "echo Build listo en /dist"
  },
  "keywords": ["sena","ganaderia","rpg","educativo","pixel-art"],
  "author": "Luis Carlos Quiroga Rico",
  "license": "MIT",
  "devDependencies": {
    "vitest": "^1.0.0",
    "happy-dom": "^12.0.0"
  }
}
```

- [ ] **Step 4: Crear vitest.config.js**

```js
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['src/__tests__/**/*.test.js']
  }
});
```

- [ ] **Step 5: Verificar**

```bash
npx vitest run
```
Expected: "No test files found" (sin error de config).

- [ ] **Step 6: Commit**

```bash
git add package.json vitest.config.js
git commit -m "chore: add vitest test setup"
```

---

## Task 2: styles.css

**Files:**
- Create: `src/ui/styles.css`

- [ ] **Step 1: Crear styles.css**

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

#gameCanvas {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  display: block;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/ui/styles.css
git commit -m "feat: add canvas styles with pixelated rendering"
```

---

## Task 3: Vector2 utility

**Files:**
- Create: `src/utils/Vector2.js`
- Create: `src/__tests__/Vector2.test.js`

- [ ] **Step 1: Escribir test**

```js
// src/__tests__/Vector2.test.js
import { describe, it, expect } from 'vitest';
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
```

- [ ] **Step 2: Ejecutar test (debe fallar)**

```bash
npx vitest run
```
Expected: FAIL — "Cannot find module '../utils/Vector2.js'"

- [ ] **Step 3: Implementar Vector2**

```js
// src/utils/Vector2.js
export const Vector2 = {
  distance(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  },
  normalize(v) {
    const len = Math.sqrt(v.x * v.x + v.y * v.y);
    if (len === 0) return { x: 0, y: 0 };
    return { x: v.x / len, y: v.y / len };
  },
  lerp(a, b, t) {
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }
};
```

- [ ] **Step 4: Ejecutar test (debe pasar)**

```bash
npx vitest run
```
Expected: PASS — 4 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/utils/Vector2.js src/__tests__/Vector2.test.js
git commit -m "feat: add Vector2 utility with tests"
```

---

## Task 4: AssetLoader

**Files:**
- Create: `src/engine/AssetLoader.js`

- [ ] **Step 1: Crear AssetLoader.js**

```js
// src/engine/AssetLoader.js
const MANIFEST = {
  world_map:     'assets/images/backgrounds/World_Map_background.png',
  ep0_entrada:   'assets/images/backgrounds/ep0_entrada.png',
  ep1_potrero:   'assets/images/backgrounds/ep1_potrero.png',
  ep2_ordeno:    'assets/images/backgrounds/ep2_ordeno.png',
  ep3_maternidad:'assets/images/backgrounds/ep3_maternidad.png',
  ep4_enfermeria:'assets/images/backgrounds/ep4_enfermeria.png',
  ep5_silo:      'assets/images/backgrounds/ep5_silo.png',
  ep6_oficina:   'assets/images/backgrounds/ep6_oficina.png',
  ep7_mercado:   'assets/images/backgrounds/ep7_mercado.png',
  ep_final:      'assets/images/backgrounds/ep_final_plaza.png',
  walk_andres:   'assets/images/sprites/aprendiz_m/walk/andres_walk.png',
  walk_valentina:'assets/images/sprites/aprendiz_f/walk/valentina_walk.png',
  walk_carlos:   'assets/images/sprites/administrador/walk/carlos_walk.png',
  walk_chigui:   'assets/images/sprites/chigui/walk/chigui_walk.png',
  walk_ramirez:  'assets/images/sprites/veterinario/walk/Dr__Ramirez_walk.png',
  face_andres:   'assets/images/ui/faces/andres_face.png',
  face_valentina:'assets/images/ui/faces/valentina_face.png',
  face_carlos:   'assets/images/ui/faces/carlos_face.png',
  face_chigui:   'assets/images/ui/faces/chigui_face.png',
  face_ramirez:  'assets/images/ui/faces/Dr__Ramirez_face.png',
};

const _assets = new Map();

export const AssetLoader = {
  async loadAll(onProgress) {
    const entries = Object.entries(MANIFEST);
    let loaded = 0;
    for (const [key, src] of entries) {
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => { _assets.set(key, img); loaded++; onProgress?.(loaded / entries.length); resolve(); };
        img.onerror = () => reject(new Error(`Failed to load: ${src}`));
        img.src = src;
      });
    }
  },
  get(key) {
    const img = _assets.get(key);
    if (!img) throw new Error(`Asset not loaded: ${key}`);
    return img;
  },
  has(key) { return _assets.has(key); }
};
```

- [ ] **Step 2: Commit**

```bash
git add src/engine/AssetLoader.js
git commit -m "feat: add AssetLoader with full asset manifest"
```

---

## Task 5: GameEngine

**Files:**
- Create: `src/engine/GameEngine.js`

- [ ] **Step 1: Crear GameEngine.js**

```js
// src/engine/GameEngine.js
export class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvas.width = 1920;
    this.canvas.height = 1080;
    this._lastTime = 0;
    this._running = false;
    this.sceneManager = null;
    this._boundLoop = this._loop.bind(this);
    window.addEventListener('resize', () => this._resize());
    this._resize();
  }

  _resize() {
    const scaleX = window.innerWidth / 1920;
    const scaleY = window.innerHeight / 1080;
    const scale = Math.min(scaleX, scaleY);
    this.canvas.style.width = `${Math.floor(1920 * scale)}px`;
    this.canvas.style.height = `${Math.floor(1080 * scale)}px`;
  }

  start(sceneManager) {
    this.sceneManager = sceneManager;
    this._running = true;
    requestAnimationFrame(this._boundLoop);
  }

  _loop(timestamp) {
    if (!this._running) return;
    const dt = Math.min((timestamp - this._lastTime) / 1000, 0.1);
    this._lastTime = timestamp;
    this.ctx.clearRect(0, 0, 1920, 1080);
    this.sceneManager.update(dt);
    this.sceneManager.draw(this.ctx);
    requestAnimationFrame(this._boundLoop);
  }

  stop() { this._running = false; }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/engine/GameEngine.js
git commit -m "feat: add GameEngine with 16:9 canvas scaling and game loop"
```

---

## Task 6: SceneManager

**Files:**
- Create: `src/engine/SceneManager.js`
- Create: `src/__tests__/SceneManager.test.js`

- [ ] **Step 1: Escribir test**

```js
// src/__tests__/SceneManager.test.js
import { describe, it, expect, vi } from 'vitest';
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
```

- [ ] **Step 2: Ejecutar test (debe fallar)**

```bash
npx vitest run
```
Expected: FAIL

- [ ] **Step 3: Implementar SceneManager**

```js
// src/engine/SceneManager.js
export class SceneManager {
  constructor() {
    this._stack = [];
    this._fadeAlpha = 0;
    this._fadeTarget = 0;
    this._fadeSpeed = 3.33;
    this._pendingScene = null;
    this._pendingOp = null;
  }

  current() { return this._stack[this._stack.length - 1] ?? null; }

  push(scene) {
    this._stack.push(scene);
    scene.init?.();
  }

  pop() {
    const top = this._stack.pop();
    top?.destroy?.();
  }

  replace(scene) {
    this._pendingScene = scene;
    this._pendingOp = 'replace';
    this._fadeTarget = 1;
  }

  _doReplace(scene) {
    const top = this._stack.pop();
    top?.destroy?.();
    this._stack.push(scene);
    scene.init?.();
  }

  update(dt) {
    if (this._fadeAlpha < this._fadeTarget) {
      this._fadeAlpha = Math.min(this._fadeAlpha + this._fadeSpeed * dt, this._fadeTarget);
      if (this._fadeAlpha >= 1 && this._pendingScene) {
        this._doReplace(this._pendingScene);
        this._pendingScene = null;
        this._fadeTarget = 0;
      }
    } else if (this._fadeAlpha > this._fadeTarget) {
      this._fadeAlpha = Math.max(this._fadeAlpha - this._fadeSpeed * dt, this._fadeTarget);
    }
    this.current()?.update(dt);
  }

  draw(ctx) {
    this.current()?.draw(ctx);
    if (this._fadeAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = this._fadeAlpha;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 1920, 1080);
      ctx.restore();
    }
  }
}
```

- [ ] **Step 4: Ejecutar test (debe pasar)**

```bash
npx vitest run
```
Expected: PASS — todos los tests.

- [ ] **Step 5: Commit**

```bash
git add src/engine/SceneManager.js src/__tests__/SceneManager.test.js
git commit -m "feat: add SceneManager with fade transitions and tests"
```

---

## Task 7: InputManager

**Files:**
- Create: `src/systems/InputManager.js`

- [ ] **Step 1: Crear InputManager.js**

```js
// src/systems/InputManager.js
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
```

- [ ] **Step 2: Commit**

```bash
git add src/systems/InputManager.js
git commit -m "feat: add InputManager with keyboard and mouse/touch support"
```

---

## Task 8: SpriteSheet

**Files:**
- Create: `src/utils/SpriteSheet.js`
- Create: `src/__tests__/SpriteSheet.test.js`

Nota: Los spritesheets tienen 3 filas × 6 columnas. Verificar dimensiones reales con:
```js
// En consola del navegador (tras npm run dev):
const i = new Image();
i.onload = () => console.log(i.width, i.height, 'frameW:', i.width/6, 'frameH:', i.height/3);
i.src = 'assets/images/sprites/aprendiz_m/walk/andres_walk.png';
```
El plan asume `frameW=32, frameH=48`. Ajustar `SPRITE_W` y `SPRITE_H` en Player.js si difiere.

- [ ] **Step 1: Escribir test**

```js
// src/__tests__/SpriteSheet.test.js
import { describe, it, expect } from 'vitest';
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
```

- [ ] **Step 2: Ejecutar test (debe fallar)**

```bash
npx vitest run
```

- [ ] **Step 3: Implementar SpriteSheet**

```js
// src/utils/SpriteSheet.js
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
```

- [ ] **Step 4: Ejecutar tests**

```bash
npx vitest run
```
Expected: PASS — todos los tests.

- [ ] **Step 5: Commit**

```bash
git add src/utils/SpriteSheet.js src/__tests__/SpriteSheet.test.js
git commit -m "feat: add SpriteSheet utility with animation and tests"
```

---

## Task 9: Entity base

**Files:**
- Create: `src/entities/Entity.js`

- [ ] **Step 1: Crear Entity.js**

```js
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
```

- [ ] **Step 2: Commit**

```bash
git add src/entities/Entity.js
git commit -m "feat: add Entity base class"
```

---

## Task 10: Player

**Files:**
- Create: `src/entities/Player.js`

Constantes de sprite a ajustar si la medición de frame da valores distintos a 32×48.

- [ ] **Step 1: Crear Player.js**

```js
// src/entities/Player.js
import { Entity } from './Entity.js';
import { SpriteSheet } from '../utils/SpriteSheet.js';
import { AssetLoader } from '../engine/AssetLoader.js';
import { InputManager } from '../systems/InputManager.js';
import { Vector2 } from '../utils/Vector2.js';

const SPRITE_W = 32;
const SPRITE_H = 48;
const SPEED    = 200;
const ROWS     = { idle: 0, walk: 2 };

export class Player extends Entity {
  constructor(spriteKey, x, y) {
    super(x, y, SPRITE_W, SPRITE_H);
    this.sprite = new SpriteSheet(AssetLoader.get(spriteKey), SPRITE_W, SPRITE_H, 6);
    this._facingLeft = false;
    this._moving = false;
    this._target = null;
    this._dt = 0;
  }

  update(dt) {
    this._dt = dt;
    if (InputManager.dialogueActive) { this._moving = false; return; }

    let dx = 0, dy = 0;
    if (InputManager.isDown('ArrowLeft') || InputManager.isDown('KeyA'))  { dx = -1; this._facingLeft = true; }
    if (InputManager.isDown('ArrowRight') || InputManager.isDown('KeyD')) { dx =  1; this._facingLeft = false; }
    if (InputManager.isDown('ArrowUp')   || InputManager.isDown('KeyW'))  dy = -1;
    if (InputManager.isDown('ArrowDown') || InputManager.isDown('KeyS'))  dy =  1;

    if (dx !== 0 || dy !== 0) {
      this._target = null;
      const n = Vector2.normalize({ x: dx, y: dy });
      this.x += n.x * SPEED * dt;
      this.y += n.y * SPEED * dt;
      this._moving = true;
    } else {
      const click = InputManager.consumeClick();
      if (click) this._target = click;

      if (this._target) {
        const d = Vector2.distance(this, this._target);
        if (d < 4) {
          this._target = null;
          this._moving = false;
        } else {
          const n = Vector2.normalize({ x: this._target.x - this.x, y: this._target.y - this.y });
          this.x += n.x * SPEED * dt;
          this.y += n.y * SPEED * dt;
          this._facingLeft = n.x < 0;
          this._moving = true;
        }
      } else {
        this._moving = false;
      }
    }

    this.x = Math.max(0, Math.min(1920 - this.width, this.x));
    this.y = Math.max(0, Math.min(1080 - this.height, this.y));
  }

  draw(ctx) {
    if (!this.visible) return;
    const row = this._moving ? ROWS.walk : ROWS.idle;
    const frame = this._moving
      ? this.sprite.animate(this._dt, row, 6)
      : this.sprite.idle(row);

    ctx.save();
    if (this._facingLeft) {
      ctx.translate(this.x + this.width, this.y);
      ctx.scale(-1, 1);
      ctx.drawImage(this.sprite.image, frame.sx, frame.sy, frame.sw, frame.sh, 0, 0, this.width, this.height);
    } else {
      ctx.drawImage(this.sprite.image, frame.sx, frame.sy, frame.sw, frame.sh, this.x, this.y, this.width, this.height);
    }
    ctx.restore();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/entities/Player.js
git commit -m "feat: add Player entity with keyboard and click-to-move controls"
```

---

## Task 11: NPC

**Files:**
- Create: `src/entities/NPC.js`

- [ ] **Step 1: Crear NPC.js**

```js
// src/entities/NPC.js
import { Entity } from './Entity.js';
import { SpriteSheet } from '../utils/SpriteSheet.js';
import { AssetLoader } from '../engine/AssetLoader.js';

const SPRITE_W = 32;
const SPRITE_H = 48;

export class NPC extends Entity {
  constructor({ id, x, y, spriteKey, faceKey, dialogueKey }) {
    super(x, y, SPRITE_W, SPRITE_H);
    this.id = id;
    this.spriteKey = spriteKey;
    this.faceKey = faceKey;
    this.dialogueKey = dialogueKey;
    this.sprite = new SpriteSheet(AssetLoader.get(spriteKey), SPRITE_W, SPRITE_H, 6);
    this.inRange = false;
    this._bounceTimer = 0;
    this._bounceY = 0;
  }

  update(dt) {
    if (this.inRange) {
      this._bounceTimer += dt * 4;
      this._bounceY = Math.sin(this._bounceTimer) * 4;
    } else {
      this._bounceY = 0;
    }
  }

  draw(ctx) {
    if (!this.visible) return;
    const { sx, sy, sw, sh } = this.sprite.idle(0);
    ctx.drawImage(this.sprite.image, sx, sy, sw, sh, this.x, this.y, this.width, this.height);

    if (this.inRange) {
      ctx.save();
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('!', this.x + this.width / 2, this.y - 8 + this._bounceY);
      ctx.restore();
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/entities/NPC.js
git commit -m "feat: add NPC entity with proximity indicator"
```

---

## Task 12: SaveManager

**Files:**
- Create: `src/systems/SaveManager.js`
- Create: `src/__tests__/SaveManager.test.js`

- [ ] **Step 1: Escribir test**

```js
// src/__tests__/SaveManager.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { SaveManager } from '../systems/SaveManager.js';

beforeEach(() => { localStorage.clear(); });

describe('SaveManager', () => {
  it('load devuelve estado inicial si no hay guardado', () => {
    const state = SaveManager.load();
    expect(state.personaje).toBeNull();
    expect(state.episodios.ep0).toBe('disponible');
    expect(state.episodios.ep1).toBe('bloqueado');
  });

  it('save y load persisten correctamente', () => {
    const state = SaveManager.load();
    state.personaje = 'aprendiz_m';
    state.episodios.ep0 = 'completado';
    state.episodios.ep1 = 'disponible';
    SaveManager.save(state);
    const loaded = SaveManager.load();
    expect(loaded.personaje).toBe('aprendiz_m');
    expect(loaded.episodios.ep0).toBe('completado');
  });

  it('reset elimina el guardado', () => {
    const state = SaveManager.load();
    state.personaje = 'aprendiz_f';
    SaveManager.save(state);
    SaveManager.reset();
    expect(SaveManager.load().personaje).toBeNull();
  });

  it('completeMission marca misión y auto-desbloquea siguiente episodio', () => {
    const state = SaveManager.load();
    state.personaje = 'aprendiz_m';
    SaveManager.save(state);
    SaveManager.completeMission('ep0', 'mision_entrada');
    const s2 = SaveManager.load();
    expect(s2.misiones.ep0).toContain('mision_entrada');
  });
});
```

- [ ] **Step 2: Ejecutar test (debe fallar)**

```bash
npx vitest run
```

- [ ] **Step 3: Implementar SaveManager**

```js
// src/systems/SaveManager.js
const KEY = 'agropec_save';
const EPISODE_ORDER = ['ep0','ep1','ep2','ep3','ep4','ep5','ep6','ep7','ep_final'];

function initialState() {
  const episodios = {};
  EPISODE_ORDER.forEach((id, i) => { episodios[id] = i === 0 ? 'disponible' : 'bloqueado'; });
  return { personaje: null, episodios, misiones: {}, timestamp: Date.now() };
}

export const SaveManager = {
  load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : initialState();
    } catch { return initialState(); }
  },

  save(state) {
    state.timestamp = Date.now();
    localStorage.setItem(KEY, JSON.stringify(state));
  },

  reset() { localStorage.removeItem(KEY); },

  completeMission(episodeId, missionId) {
    const state = this.load();
    if (!state.misiones[episodeId]) state.misiones[episodeId] = [];
    if (!state.misiones[episodeId].includes(missionId)) {
      state.misiones[episodeId].push(missionId);
    }
    this.save(state);
  },

  completeEpisode(episodeId, totalMissions) {
    const state = this.load();
    const done = (state.misiones[episodeId] ?? []).length;
    if (done >= totalMissions) {
      state.episodios[episodeId] = 'completado';
      const idx = EPISODE_ORDER.indexOf(episodeId);
      if (idx >= 0 && idx + 1 < EPISODE_ORDER.length) {
        const next = EPISODE_ORDER[idx + 1];
        if (state.episodios[next] === 'bloqueado') state.episodios[next] = 'disponible';
      }
      this.save(state);
      return true;
    }
    return false;
  },

  hasSave() { return localStorage.getItem(KEY) !== null; }
};
```

- [ ] **Step 4: Ejecutar tests**

```bash
npx vitest run
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/systems/SaveManager.js src/__tests__/SaveManager.test.js
git commit -m "feat: add SaveManager with localStorage persistence and tests"
```

---

## Task 13: DialogueBox (UI)

**Files:**
- Create: `src/ui/DialogueBox.js`

- [ ] **Step 1: Crear DialogueBox.js**

```js
// src/ui/DialogueBox.js
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

    // Background panel
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.82)';
    ctx.strokeStyle = '#39A900';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(BOX_X, BOX_Y, BOX_W, BOX_H, 8);
    ctx.fill();
    ctx.stroke();

    // Portrait
    if (this._node.face) {
      try {
        const img = AssetLoader.get(this._node.face);
        ctx.drawImage(img, BOX_X + PAD, BOX_Y + PAD, FACE_SIZE, FACE_SIZE);
      } catch {}
    }

    const textX = BOX_X + PAD + FACE_SIZE + PAD;
    const textW = BOX_W - FACE_SIZE - PAD * 3;

    if (this._node.type === 'dialogue') {
      // Speaker name
      ctx.fillStyle = '#39A900';
      ctx.font = 'bold 22px monospace';
      ctx.fillText(this._node.speaker ?? '', textX, BOX_Y + PAD + 22);
      // Dialogue text
      ctx.fillStyle = '#fff';
      ctx.font = '20px monospace';
      this._wrapText(ctx, this._node.text, textX, BOX_Y + PAD + 56, textW, 26);
      // Prompt
      ctx.fillStyle = '#aaa';
      ctx.font = '16px monospace';
      ctx.fillText('[ESPACIO / ENTER]', BOX_X + BOX_W - 220, BOX_Y + BOX_H - 16);

    } else if (this._node.type === 'quiz') {
      ctx.fillStyle = '#FDC300';
      ctx.font = 'bold 20px monospace';
      this._wrapText(ctx, this._node.question, textX, BOX_Y + PAD + 24, textW, 26);

      const optY = BOX_Y + PAD + 80;
      this._node.options.forEach((opt, i) => {
        const isSelected = i === this._selectedOption;
        ctx.fillStyle = isSelected ? '#39A900' : '#ccc';
        ctx.font = isSelected ? 'bold 19px monospace' : '19px monospace';
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
    let line = '';
    let curY = y;
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, x, curY);
        line = word;
        curY += lineH;
      } else { line = test; }
    }
    if (line) ctx.fillText(line, x, curY);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/ui/DialogueBox.js
git commit -m "feat: add DialogueBox UI with dialogue and quiz rendering"
```

---

## Task 14: DialogueSystem

**Files:**
- Create: `src/systems/DialogueSystem.js`
- Create: `src/__tests__/DialogueSystem.test.js`

- [ ] **Step 1: Escribir test**

```js
// src/__tests__/DialogueSystem.test.js
import { describe, it, expect, vi } from 'vitest';
import { DialogueSystem } from '../systems/DialogueSystem.js';

vi.mock('../ui/DialogueBox.js', () => ({
  DialogueBox: class { setNode() {} setFeedback() {} selectOption() {} draw() {} }
}));
vi.mock('../systems/InputManager.js', () => ({
  InputManager: { dialogueActive: false, consumeKey: () => false, consumeClick: () => null, click: null }
}));

const nodes = [
  { type: 'dialogue', speaker: 'X', face: null, text: 'Hola' },
  { type: 'dialogue', speaker: 'X', face: null, text: 'Adiós' }
];

describe('DialogueSystem', () => {
  it('no está activo antes de start()', () => {
    const ds = new DialogueSystem();
    expect(ds.isActive).toBe(false);
  });

  it('está activo después de start()', () => {
    const ds = new DialogueSystem();
    ds.start(nodes, () => {});
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
```

- [ ] **Step 2: Ejecutar test (debe fallar)**

```bash
npx vitest run
```

- [ ] **Step 3: Implementar DialogueSystem**

```js
// src/systems/DialogueSystem.js
import { DialogueBox } from '../ui/DialogueBox.js';
import { InputManager } from '../systems/InputManager.js';

export class DialogueSystem {
  constructor() {
    this._box = new DialogueBox();
    this._nodes = [];
    this._idx = 0;
    this._onComplete = null;
    this.isActive = false;
    this._selectedOption = 0;
    this._waitingFeedback = false;
    this._feedbackTimer = 0;
  }

  start(nodes, onComplete) {
    this._nodes = nodes;
    this._idx = 0;
    this._onComplete = onComplete;
    this.isActive = true;
    InputManager.dialogueActive = true;
    this._showCurrent();
  }

  _showCurrent() {
    const node = this._nodes[this._idx];
    this._selectedOption = 0;
    this._waitingFeedback = false;
    this._box.setNode(node, 0);
  }

  _advance() {
    this._idx++;
    if (this._idx >= this._nodes.length) {
      this.isActive = false;
      InputManager.dialogueActive = false;
      this._box.setNode(null);
      this._onComplete?.();
    } else {
      this._showCurrent();
    }
  }

  update(dt) {
    if (!this.isActive) return;
    const node = this._nodes[this._idx];

    if (this._waitingFeedback) {
      this._feedbackTimer -= dt;
      if (this._feedbackTimer <= 0) {
        if (this._feedbackOk) this._advance();
        else { this._waitingFeedback = false; this._box.setFeedback(null, false); }
      }
      return;
    }

    if (node.type === 'dialogue') {
      if (InputManager.consumeKey('Space') || InputManager.consumeKey('Enter') || InputManager.consumeClick()) {
        this._advance();
      }
    } else if (node.type === 'quiz') {
      if (InputManager.consumeKey('ArrowUp') || InputManager.consumeKey('KeyW')) {
        this._selectedOption = Math.max(0, this._selectedOption - 1);
        this._box.selectOption(this._selectedOption);
      }
      if (InputManager.consumeKey('ArrowDown') || InputManager.consumeKey('KeyS')) {
        this._selectedOption = Math.min(node.options.length - 1, this._selectedOption + 1);
        this._box.selectOption(this._selectedOption);
      }
      // Number keys 1-4
      for (let i = 0; i < node.options.length; i++) {
        if (InputManager.consumeKey(`Digit${i + 1}`)) {
          this._selectedOption = i;
          this._box.selectOption(i);
        }
      }
      if (InputManager.consumeKey('Space') || InputManager.consumeKey('Enter')) {
        const correct = this._selectedOption === node.correct;
        this._feedbackOk = correct;
        this._box.setFeedback(correct ? node.feedback_ok : node.feedback_err, correct);
        this._waitingFeedback = true;
        this._feedbackTimer = correct ? 1.5 : 2.0;
      }
    }
  }

  draw(ctx) {
    if (!this.isActive) return;
    this._box.draw(ctx);
  }
}
```

- [ ] **Step 4: Ejecutar tests**

```bash
npx vitest run
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/systems/DialogueSystem.js src/__tests__/DialogueSystem.test.js
git commit -m "feat: add DialogueSystem with dialogue and quiz flow"
```

---

## Task 15: HUD

**Files:**
- Create: `src/ui/HUD.js`

- [ ] **Step 1: Crear HUD.js**

```js
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

    // Background pill
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.beginPath();
    ctx.roundRect(10, 10, 340, 60, 8);
    ctx.fill();

    // Player portrait
    if (playerFaceKey) {
      try {
        const img = AssetLoader.get(playerFaceKey);
        ctx.drawImage(img, 16, 14, 52, 52);
      } catch {}
    }

    // Episode name
    ctx.fillStyle = '#FDC300';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(this._episodeName, 76, 32);

    // Progress bar
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
```

- [ ] **Step 2: Commit**

```bash
git add src/ui/HUD.js
git commit -m "feat: add HUD with episode name and mission progress bar"
```

---

## Task 16: Scene base

**Files:**
- Create: `src/scenes/Scene.js`

- [ ] **Step 1: Crear Scene.js**

```js
// src/scenes/Scene.js
export class Scene {
  constructor(engine) {
    this.engine = engine;
  }
  init()        {}
  update(_dt)   {}
  draw(_ctx)    {}
  destroy()     {}
}
```

- [ ] **Step 2: Commit**

```bash
git add src/scenes/Scene.js
git commit -m "feat: add Scene base class"
```

---

## Task 17: TitleScene

**Files:**
- Create: `src/scenes/TitleScene.js`

- [ ] **Step 1: Crear TitleScene.js**

```js
// src/scenes/TitleScene.js
import { Scene } from './Scene.js';
import { InputManager } from '../systems/InputManager.js';
import { SaveManager } from '../systems/SaveManager.js';
import { CharacterSelectScene } from './CharacterSelectScene.js';
import { WorldMapScene } from './WorldMapScene.js';

const BTN = { x: 810, y: 560, w: 300, h: 60 };
const BTN2 = { x: 810, y: 640, w: 300, h: 60 };

export class TitleScene extends Scene {
  constructor(engine) {
    super(engine);
    this._hasSave = false;
    this._hovered = null;
  }

  init() {
    this._hasSave = SaveManager.hasSave();
  }

  update(_dt) {
    const click = InputManager.consumeClick();
    if (click) {
      if (this._inBtn(click, BTN)) {
        SaveManager.reset();
        this.engine.sceneManager.replace(new CharacterSelectScene(this.engine));
      } else if (this._hasSave && this._inBtn(click, BTN2)) {
        this.engine.sceneManager.replace(new WorldMapScene(this.engine));
      }
    }
    if (InputManager.consumeKey('Enter') || InputManager.consumeKey('Space')) {
      SaveManager.reset();
      this.engine.sceneManager.replace(new CharacterSelectScene(this.engine));
    }
  }

  draw(ctx) {
    // Background
    ctx.fillStyle = '#00304D';
    ctx.fillRect(0, 0, 1920, 1080);

    // Title
    ctx.fillStyle = '#39A900';
    ctx.font = 'bold 72px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('AGROPEC QUEST', 960, 280);

    ctx.fillStyle = '#FDC300';
    ctx.font = '32px monospace';
    ctx.fillText('La Finca del Saber', 960, 340);

    ctx.fillStyle = '#aaa';
    ctx.font = '18px monospace';
    ctx.fillText('SENA — Centro Agroindustrial del Meta', 960, 390);

    // Buttons
    this._drawBtn(ctx, BTN, 'NUEVA PARTIDA', '#39A900');
    if (this._hasSave) this._drawBtn(ctx, BTN2, 'CONTINUAR', '#FDC300');

    ctx.textAlign = 'left';
  }

  _inBtn(pt, btn) {
    return pt.x >= btn.x && pt.x <= btn.x + btn.w && pt.y >= btn.y && pt.y <= btn.y + btn.h;
  }

  _drawBtn(ctx, btn, label, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 8);
    ctx.fill();
    ctx.fillStyle = '#00304D';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, btn.x + btn.w / 2, btn.y + btn.h / 2 + 9);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/scenes/TitleScene.js
git commit -m "feat: add TitleScene with play and continue buttons"
```

---

## Task 18: CharacterSelectScene

**Files:**
- Create: `src/scenes/CharacterSelectScene.js`

- [ ] **Step 1: Crear CharacterSelectScene.js**

```js
// src/scenes/CharacterSelectScene.js
import { Scene } from './Scene.js';
import { InputManager } from '../systems/InputManager.js';
import { AssetLoader } from '../engine/AssetLoader.js';
import { SaveManager } from '../systems/SaveManager.js';
import { WorldMapScene } from './WorldMapScene.js';

const CHARACTERS = [
  { id: 'aprendiz_m', name: 'Andrés', role: 'Aprendiz SENA', faceKey: 'face_andres',
    attrs: { Salud: 80, Agilidad: 90, Conocimiento: 70, Gestión: 60 },
    habilidad: 'Aprendizaje Acelerado' },
  { id: 'aprendiz_f', name: 'Valentina', role: 'Aprendiz SENA', faceKey: 'face_valentina',
    attrs: { Salud: 75, Agilidad: 80, Conocimiento: 85, Gestión: 60 },
    habilidad: 'Ojo Clínico' }
];

export class CharacterSelectScene extends Scene {
  constructor(engine) {
    super(engine);
    this._selected = 0;
  }

  update(_dt) {
    if (InputManager.consumeKey('ArrowLeft'))  this._selected = 0;
    if (InputManager.consumeKey('ArrowRight')) this._selected = 1;

    const click = InputManager.consumeClick();
    if (click) {
      if (click.x < 960) this._selected = 0;
      else this._selected = 1;
      if (this._inCard(click, this._selected)) this._confirm();
    }
    if (InputManager.consumeKey('Enter') || InputManager.consumeKey('Space')) this._confirm();
  }

  _confirm() {
    const ch = CHARACTERS[this._selected];
    const state = SaveManager.load();
    state.personaje = ch.id;
    SaveManager.save(state);
    this.engine.sceneManager.replace(new WorldMapScene(this.engine));
  }

  _inCard(pt, idx) {
    const x = idx === 0 ? 200 : 1020;
    return pt.x >= x && pt.x <= x + 700 && pt.y >= 200 && pt.y <= 900;
  }

  draw(ctx) {
    ctx.fillStyle = '#00304D';
    ctx.fillRect(0, 0, 1920, 1080);

    ctx.fillStyle = '#FDC300';
    ctx.font = 'bold 40px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('¿Quién será tu personaje?', 960, 100);

    CHARACTERS.forEach((ch, i) => {
      const x = i === 0 ? 200 : 1020;
      const isSelected = this._selected === i;

      ctx.fillStyle = isSelected ? 'rgba(57,169,0,0.2)' : 'rgba(255,255,255,0.05)';
      ctx.strokeStyle = isSelected ? '#39A900' : '#555';
      ctx.lineWidth = isSelected ? 4 : 2;
      ctx.beginPath();
      ctx.roundRect(x, 150, 700, 780, 12);
      ctx.fill(); ctx.stroke();

      // Portrait
      try {
        const img = AssetLoader.get(ch.faceKey);
        ctx.drawImage(img, x + 175, 180, 350, 350);
      } catch {}

      ctx.textAlign = 'center';
      ctx.fillStyle = '#FDC300';
      ctx.font = 'bold 32px monospace';
      ctx.fillText(ch.name, x + 350, 570);

      ctx.fillStyle = '#aaa';
      ctx.font = '20px monospace';
      ctx.fillText(ch.role, x + 350, 605);

      ctx.fillStyle = '#39A900';
      ctx.font = '18px monospace';
      ctx.fillText(`★ ${ch.habilidad}`, x + 350, 640);

      let attrY = 680;
      Object.entries(ch.attrs).forEach(([k, v]) => {
        ctx.fillStyle = '#ccc';
        ctx.font = '16px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(k, x + 80, attrY);
        ctx.fillStyle = '#333';
        ctx.fillRect(x + 200, attrY - 14, 300, 16);
        ctx.fillStyle = '#39A900';
        ctx.fillRect(x + 200, attrY - 14, Math.floor(300 * v / 100), 16);
        attrY += 30;
      });

      if (isSelected) {
        ctx.fillStyle = '#39A900';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('[ ENTER para confirmar ]', x + 350, 870);
      }
    });

    ctx.textAlign = 'left';
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/scenes/CharacterSelectScene.js
git commit -m "feat: add CharacterSelectScene with attribute cards"
```

---

## Task 19: WorldMapScene

**Files:**
- Create: `src/scenes/WorldMapScene.js`

Nota: Las coordenadas de los hotspots son estimadas para el mapa isométrico. Ajustar visualmente tras `npm run dev`.

- [ ] **Step 1: Crear WorldMapScene.js**

```js
// src/scenes/WorldMapScene.js
import { Scene } from './Scene.js';
import { InputManager } from '../systems/InputManager.js';
import { AssetLoader } from '../engine/AssetLoader.js';
import { SaveManager } from '../systems/SaveManager.js';
import { EP0Scene } from './EP0Scene.js';
import { EP1Scene } from './EP1Scene.js';
import { EP2Scene } from './EP2Scene.js';
import { EP3Scene } from './EP3Scene.js';
import { EP4Scene } from './EP4Scene.js';
import { EP5Scene } from './EP5Scene.js';
import { EP6Scene } from './EP6Scene.js';
import { EP7Scene } from './EP7Scene.js';
import { FinalScene } from './FinalScene.js';

const SCENE_MAP = {
  ep0: EP0Scene, ep1: EP1Scene, ep2: EP2Scene, ep3: EP3Scene,
  ep4: EP4Scene, ep5: EP5Scene, ep6: EP6Scene, ep7: EP7Scene,
  ep_final: FinalScene
};

const HOTSPOTS = [
  { id: 'ep0',     x: 350,  y: 820, r: 40, label: 'Entrada a la Finca' },
  { id: 'ep1',     x: 480,  y: 650, r: 40, label: 'El Potrero Perdido' },
  { id: 'ep2',     x: 680,  y: 460, r: 40, label: 'La Sala de Ordeño' },
  { id: 'ep3',     x: 870,  y: 500, r: 40, label: 'La Maternidad' },
  { id: 'ep4',     x: 1060, y: 450, r: 40, label: 'La Enfermería' },
  { id: 'ep5',     x: 1230, y: 570, r: 40, label: 'El Silo y la Dieta' },
  { id: 'ep6',     x: 1460, y: 420, r: 40, label: 'La Oficina del Gerente' },
  { id: 'ep7',     x: 1620, y: 680, r: 40, label: 'El Mercado Verde' },
  { id: 'ep_final',x: 960,  y: 300, r: 50, label: 'Episodio Final' },
];

export class WorldMapScene extends Scene {
  constructor(engine) {
    super(engine);
    this._state = null;
    this._hovered = null;
    this._pulseTimer = 0;
  }

  init() {
    this._state = SaveManager.load();
  }

  update(dt) {
    this._pulseTimer += dt;
    this._state = SaveManager.load();

    const click = InputManager.consumeClick();
    const mouse = InputManager.click;

    this._hovered = null;
    if (mouse) {
      const h = HOTSPOTS.find(h => Math.hypot(mouse.x - h.x, mouse.y - h.y) <= h.r);
      if (h) this._hovered = h.id;
    }

    if (click) {
      const h = HOTSPOTS.find(h => Math.hypot(click.x - h.x, click.y - h.y) <= h.r);
      if (h) {
        const st = this._state.episodios[h.id];
        if (st === 'disponible' || st === 'en_progreso') {
          const SceneCls = SCENE_MAP[h.id];
          if (SceneCls) this.engine.sceneManager.replace(new SceneCls(this.engine));
        }
      }
    }
  }

  draw(ctx) {
    const bg = AssetLoader.get('world_map');
    ctx.drawImage(bg, 0, 0, 1920, 1080);

    HOTSPOTS.forEach(h => {
      const st = this._state?.episodios[h.id] ?? 'bloqueado';
      const pulse = 1 + Math.sin(this._pulseTimer * 4) * 0.15;

      if (st === 'bloqueado') {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#555';
        ctx.beginPath(); ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#aaa';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('🔒', h.x, h.y + 8);
        ctx.restore();
      } else if (st === 'completado') {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath(); ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#00304D';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('★', h.x, h.y + 8);
      } else {
        // disponible / en_progreso — pulsante
        const color = st === 'en_progreso' ? '#FDC300' : '#39A900';
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(h.x, h.y, h.r * pulse * 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // Tooltip on hover
      if (this._hovered === h.id) {
        const tw = ctx.measureText(h.label).width + 20;
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.beginPath();
        ctx.roundRect(h.x - tw / 2, h.y - h.r - 40, tw, 28, 6);
        ctx.fill();
        ctx.fillStyle = '#FDC300';
        ctx.font = '18px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(h.label, h.x, h.y - h.r - 20);
      }
    });

    ctx.textAlign = 'left';
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/scenes/WorldMapScene.js
git commit -m "feat: add WorldMapScene with 9 interactive hotspots"
```

---

## Task 20: EpisodeScene base

**Files:**
- Create: `src/scenes/EpisodeScene.js`

- [ ] **Step 1: Crear EpisodeScene.js**

```js
// src/scenes/EpisodeScene.js
import { Scene } from './Scene.js';
import { AssetLoader } from '../engine/AssetLoader.js';
import { InputManager } from '../systems/InputManager.js';
import { SaveManager } from '../systems/SaveManager.js';
import { Player } from '../entities/Player.js';
import { NPC } from '../entities/NPC.js';
import { HUD } from '../ui/HUD.js';
import { DialogueSystem } from '../systems/DialogueSystem.js';
import { Vector2 } from '../utils/Vector2.js';
import { WorldMapScene } from './WorldMapScene.js';

export class EpisodeScene extends Scene {
  constructor(engine, config) {
    super(engine);
    this._config = config;
    this._player = null;
    this._npcs = [];
    this._hud = new HUD();
    this._dialogue = new DialogueSystem();
    this._missionData = null;
    this._completedMissions = new Set();
    this._exitConfirm = false;
  }

  async init() {
    const { backgroundKey, episodeId, playerStart, npcs } = this._config;
    const state = SaveManager.load();
    const spriteKey = state.personaje === 'aprendiz_f' ? 'walk_valentina' : 'walk_andres';
    const faceKey  = state.personaje === 'aprendiz_f' ? 'face_valentina' : 'face_andres';
    this._playerFaceKey = faceKey;

    this._player = new Player(spriteKey, playerStart.x, playerStart.y);
    this._npcs = npcs.map(cfg => new NPC(cfg));

    // Load mission data
    try {
      const res = await fetch(`src/data/misiones/${episodeId}.json`);
      this._missionData = await res.json();
    } catch { this._missionData = { misiones: [] }; }

    // Restore already completed missions from save
    const savedMissions = state.misiones?.[episodeId] ?? [];
    savedMissions.forEach(id => this._completedMissions.add(id));

    this._hud.show(this._config.episodeName, this._missionData.misiones.length);
    this._hud.setProgress(this._completedMissions.size);

    if (state.episodios[episodeId] === 'disponible') {
      state.episodios[episodeId] = 'en_progreso';
      SaveManager.save(state);
    }
  }

  update(dt) {
    this._dialogue.update(dt);

    if (!InputManager.dialogueActive) {
      // Check for NPC activation
      const nearNPC = this._npcs.find(n => Vector2.distance(this._player, n) <= 80);
      this._npcs.forEach(n => { n.inRange = n === nearNPC; });

      const peekClick = InputManager.click;
      const clickedNPC = peekClick && this._npcs.find(n => Vector2.distance(peekClick, n) <= 50);

      if (nearNPC && InputManager.consumeKey('Space')) {
        this._activateNPC(nearNPC);
      } else if (clickedNPC) {
        InputManager.consumeClick();
        this._activateNPC(clickedNPC);
      } else {
        this._player.update(dt);
      }

      // ESC to exit
      if (InputManager.consumeKey('Escape')) {
        this._exitConfirm = !this._exitConfirm;
      }
      if (this._exitConfirm) {
        if (InputManager.consumeKey('Enter')) this._exitToMap();
        if (InputManager.consumeKey('KeyN'))  this._exitConfirm = false;
      }
    }

    this._npcs.forEach(n => n.update(dt));
  }

  async _activateNPC(npc) {
    try {
      const res = await fetch(`src/data/dialogos/${this._config.episodeId}.json`);
      const data = await res.json();
      const nodes = data[npc.dialogueKey] ?? [];
      this._dialogue.start(nodes, () => this._onDialogueComplete(npc.dialogueKey));
    } catch { console.warn(`No dialogue data for ${this._config.episodeId}`); }
  }

  _onDialogueComplete(dialogueKey) {
    const mission = this._missionData?.misiones.find(m => m.dialogueKey === dialogueKey);
    if (mission && !this._completedMissions.has(mission.id)) {
      this._completedMissions.add(mission.id);
      SaveManager.completeMission(this._config.episodeId, mission.id);
      this._hud.setProgress(this._completedMissions.size);
      const total = this._missionData.misiones.length;
      if (SaveManager.completeEpisode(this._config.episodeId, total)) {
        setTimeout(() => this._exitToMap(), 2000);
      }
    }
  }

  _exitToMap() {
    this.engine.sceneManager.replace(new WorldMapScene(this.engine));
  }

  draw(ctx) {
    const bg = AssetLoader.get(this._config.backgroundKey);
    ctx.drawImage(bg, 0, 0, 1920, 1080);

    this._npcs.forEach(n => n.draw(ctx));
    this._player.draw(ctx);
    this._hud.draw(ctx, this._playerFaceKey);
    this._dialogue.draw(ctx);

    if (this._exitConfirm) {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(610, 440, 700, 200);
      ctx.strokeStyle = '#FDC300';
      ctx.lineWidth = 3;
      ctx.strokeRect(610, 440, 700, 200);
      ctx.fillStyle = '#FDC300';
      ctx.font = 'bold 28px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('¿Salir al mapa?', 960, 500);
      ctx.fillStyle = '#fff';
      ctx.font = '22px monospace';
      ctx.fillText('[ENTER] Sí    [N] No', 960, 560);
      ctx.restore();
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/scenes/EpisodeScene.js
git commit -m "feat: add EpisodeScene base with player, NPCs, HUD, dialogue and mission tracking"
```

---

## Task 21: main.js + bootstrap

**Files:**
- Modify: `src/engine/main.js` (crear)

- [ ] **Step 1: Crear main.js**

```js
// src/engine/main.js
import { GameEngine } from './GameEngine.js';
import { SceneManager } from './SceneManager.js';
import { AssetLoader } from './AssetLoader.js';
import { InputManager } from '../systems/InputManager.js';
import { TitleScene } from '../scenes/TitleScene.js';

const canvas = document.getElementById('gameCanvas');

// Loading screen
const ctx = canvas.getContext('2d');
canvas.width = 1920;
canvas.height = 1080;

function drawLoading(progress) {
  ctx.fillStyle = '#00304D';
  ctx.fillRect(0, 0, 1920, 1080);
  ctx.fillStyle = '#39A900';
  ctx.font = 'bold 48px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('AGROPEC QUEST', 960, 460);
  ctx.fillStyle = '#333';
  ctx.fillRect(560, 520, 800, 30);
  ctx.fillStyle = '#39A900';
  ctx.fillRect(560, 520, Math.floor(800 * progress), 30);
  ctx.strokeStyle = '#39A900';
  ctx.lineWidth = 2;
  ctx.strokeRect(560, 520, 800, 30);
  ctx.fillStyle = '#aaa';
  ctx.font = '20px monospace';
  ctx.fillText(`Cargando... ${Math.floor(progress * 100)}%`, 960, 590);
  ctx.textAlign = 'left';
}

async function main() {
  drawLoading(0);
  await AssetLoader.loadAll(p => drawLoading(p));

  const engine = new GameEngine(canvas);
  const sceneManager = new SceneManager();
  engine.sceneManager = sceneManager;

  InputManager.init(canvas);
  sceneManager.push(new TitleScene(engine));
  engine.start(sceneManager);
}

main().catch(err => {
  console.error('Error al iniciar el juego:', err);
  ctx.fillStyle = '#e00';
  ctx.font = '24px monospace';
  ctx.fillText(`Error: ${err.message}`, 60, 540);
});
```

- [ ] **Step 2: Verificar el juego arranca**

```bash
npm run dev
```

Abrir `http://localhost:3000`. Debe aparecer: barra de carga → pantalla título con "AGROPEC QUEST" y botón "NUEVA PARTIDA".

- [ ] **Step 3: Commit**

```bash
git add src/engine/main.js
git commit -m "feat: add main.js bootstrap with loading screen"
```

---

## Task 22: Datos JSON — EP0

**Files:**
- Create: `src/data/dialogos/ep0.json`
- Create: `src/data/misiones/ep0.json`
- Create: `src/scenes/EP0Scene.js`

- [ ] **Step 1: Crear ep0.json (diálogos)**

```json
{
  "npc_don_carlos": [
    { "type": "dialogue", "speaker": "Don Carlos", "face": "face_carlos",
      "text": "¡Bienvenido a La Esperanza! Soy Don Carlos, administrador de esta finca ganadera. Aquí aprenderás todo sobre la producción bovina sostenible." },
    { "type": "dialogue", "speaker": "Don Carlos", "face": "face_carlos",
      "text": "La finca tiene 200 hectáreas dedicadas a ganadería de doble propósito: carne y leche. Contamos con cerca de 150 bovinos de razas Holstein y Brahman." },
    { "type": "quiz",
      "question": "¿Cuál es el sistema de producción de La Esperanza?",
      "options": ["Solo carne", "Doble propósito (carne y leche)", "Solo leche"],
      "correct": 1,
      "feedback_ok": "¡Correcto! El doble propósito maximiza los ingresos de la finca.",
      "feedback_err": "No es correcto. La finca produce tanto carne como leche." },
    { "type": "dialogue", "speaker": "Don Carlos", "face": "face_carlos",
      "text": "Explora la finca y habla con nuestro equipo. ¡Hay mucho por aprender! Puedes moverte con las teclas WASD o haciendo clic en el suelo." }
  ],
  "npc_chigui": [
    { "type": "dialogue", "speaker": "Chigui", "face": "face_chigui",
      "text": "¡Hola! Soy Chigui, la mascota oficial de la finca. Soy un chigüiro y represento la biodiversidad del llano colombiano." },
    { "type": "quiz",
      "question": "¿Qué animal es el chigüiro?",
      "options": ["El roedor más grande del mundo", "Un tipo de cerdo salvaje", "Un reptil de los llanos"],
      "correct": 0,
      "feedback_ok": "¡Exacto! El chigüiro (Hydrochoerus hydrochaeris) es el roedor más grande del mundo.",
      "feedback_err": "¡No! El chigüiro es el roedor más grande del mundo, nativo de Suramérica." }
  ]
}
```

- [ ] **Step 2: Crear ep0.json (misiones)**

```json
{
  "misiones": [
    {
      "id": "mision_don_carlos",
      "descripcion": "Habla con Don Carlos para conocer la finca",
      "trigger": "dialogue_complete",
      "dialogueKey": "npc_don_carlos"
    },
    {
      "id": "mision_chigui",
      "descripcion": "Conoce a Chigui, la mascota de la finca",
      "trigger": "dialogue_complete",
      "dialogueKey": "npc_chigui"
    }
  ]
}
```

- [ ] **Step 3: Crear EP0Scene.js**

```js
// src/scenes/EP0Scene.js
import { EpisodeScene } from './EpisodeScene.js';

export class EP0Scene extends EpisodeScene {
  constructor(engine) {
    super(engine, {
      backgroundKey: 'ep0_entrada',
      episodeId:     'ep0',
      episodeName:   'Entrada a la Finca',
      playerStart:   { x: 300, y: 800 },
      npcs: [
        { id: 'don_carlos', x: 750,  y: 650, spriteKey: 'walk_carlos',  faceKey: 'face_carlos',  dialogueKey: 'npc_don_carlos' },
        { id: 'chigui',     x: 1200, y: 700, spriteKey: 'walk_chigui',  faceKey: 'face_chigui',  dialogueKey: 'npc_chigui' }
      ]
    });
  }
}
```

- [ ] **Step 4: Verificar EP0 funciona**

```bash
npm run dev
```
Iniciar nueva partida → seleccionar personaje → clic en hotspot EP0 → debe cargar el escenario con fondo ep0_entrada, personaje jugable, Don Carlos y Chigui como NPCs. Acercarse a Don Carlos → presionar Espacio → debe abrir diálogo.

- [ ] **Step 5: Commit**

```bash
git add src/scenes/EP0Scene.js src/data/dialogos/ep0.json src/data/misiones/ep0.json
git commit -m "feat: add EP0 - Entrada a la Finca with dialogue and missions"
```

---

## Task 23: EP1 — El Potrero Perdido

**Files:**
- Create: `src/scenes/EP1Scene.js`
- Create: `src/data/dialogos/ep1.json`
- Create: `src/data/misiones/ep1.json`

- [ ] **Step 1: Crear ep1.json (diálogos)**

```json
{
  "npc_veterinario": [
    { "type": "dialogue", "speaker": "Dr. Ramírez", "face": "face_ramirez",
      "text": "Este potrero está en mal estado. La mitad del pasto está degradado por el sobrepastoreo. Necesitamos implementar un sistema de rotación urgente." },
    { "type": "quiz",
      "question": "¿Cada cuántos días se debe rotar el ganado en un sistema de pastoreo rotacional?",
      "options": ["7 a 15 días", "30 a 45 días", "60 a 90 días"],
      "correct": 0,
      "feedback_ok": "¡Correcto! La rotación frecuente permite que el pasto se recupere.",
      "feedback_err": "Incorrecto. La rotación debe ser cada 7-15 días para una correcta recuperación del pasto." },
    { "type": "dialogue", "speaker": "Dr. Ramírez", "face": "face_ramirez",
      "text": "También debemos resembrar con pastos mejorados como Brachiaria y Tanzania. Son resistentes a la sequía del llano y tienen alto valor nutricional." },
    { "type": "quiz",
      "question": "¿Qué pasto mejorado es ideal para el llano colombiano?",
      "options": ["Ryegrass", "Brachiaria", "Kikuyo"],
      "correct": 1,
      "feedback_ok": "¡Exacto! La Brachiaria es el pasto más adaptado a las condiciones del llano.",
      "feedback_err": "No. El Brachiaria es el más adecuado para las condiciones del llano." }
  ],
  "npc_don_carlos": [
    { "type": "dialogue", "speaker": "Don Carlos", "face": "face_carlos",
      "text": "El pastoreo rotacional nos ha aumentado la producción de leche en un 20%. Dividimos el potrero en 8 potreros pequeños y rotamos el ganado." },
    { "type": "quiz",
      "question": "¿Cuántos potreros usa Don Carlos en su sistema rotacional?",
      "options": ["4 potreros", "8 potreros", "12 potreros"],
      "correct": 1,
      "feedback_ok": "¡Correcto! 8 potreros permiten 7 días de pastoreo y 49 días de descanso.",
      "feedback_err": "Don Carlos usa 8 potreros para su sistema de rotación." }
  ]
}
```

- [ ] **Step 2: Crear ep1.json (misiones)**

```json
{
  "misiones": [
    { "id": "mision_veterinario_potrero", "descripcion": "Aprende sobre rotación de potreros con el Dr. Ramírez", "trigger": "dialogue_complete", "dialogueKey": "npc_veterinario" },
    { "id": "mision_carlos_rotacion",    "descripcion": "Conoce el sistema rotacional de Don Carlos",           "trigger": "dialogue_complete", "dialogueKey": "npc_don_carlos" }
  ]
}
```

- [ ] **Step 3: Crear EP1Scene.js**

```js
// src/scenes/EP1Scene.js
import { EpisodeScene } from './EpisodeScene.js';

export class EP1Scene extends EpisodeScene {
  constructor(engine) {
    super(engine, {
      backgroundKey: 'ep1_potrero',
      episodeId:     'ep1',
      episodeName:   'El Potrero Perdido',
      playerStart:   { x: 200, y: 750 },
      npcs: [
        { id: 'veterinario', x: 850,  y: 600, spriteKey: 'walk_ramirez', faceKey: 'face_ramirez', dialogueKey: 'npc_veterinario' },
        { id: 'don_carlos',  x: 1350, y: 650, spriteKey: 'walk_carlos',  faceKey: 'face_carlos',  dialogueKey: 'npc_don_carlos' }
      ]
    });
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/scenes/EP1Scene.js src/data/dialogos/ep1.json src/data/misiones/ep1.json
git commit -m "feat: add EP1 - El Potrero Perdido with pasture rotation content"
```

---

## Task 24: EP2 — La Sala de Ordeño

**Files:**
- Create: `src/scenes/EP2Scene.js`
- Create: `src/data/dialogos/ep2.json`
- Create: `src/data/misiones/ep2.json`

- [ ] **Step 1: Crear ep2.json (diálogos)**

```json
{
  "npc_veterinario": [
    { "type": "dialogue", "speaker": "Dr. Ramírez", "face": "face_ramirez",
      "text": "Las buenas prácticas de ordeño son fundamentales para obtener leche de calidad. El proceso debe ser higiénico desde el inicio hasta el enfriamiento." },
    { "type": "quiz",
      "question": "¿Cuál es la temperatura correcta para enfriar la leche después del ordeño?",
      "options": ["Entre 0°C y 4°C", "Entre 8°C y 12°C", "Entre 15°C y 20°C"],
      "correct": 0,
      "feedback_ok": "¡Correcto! La leche debe enfriarse a 0-4°C para conservar su calidad.",
      "feedback_err": "Incorrecto. La leche debe enfriarse a entre 0°C y 4°C lo más rápido posible." }
  ],
  "npc_don_carlos": [
    { "type": "dialogue", "speaker": "Don Carlos", "face": "face_carlos",
      "text": "Antes de ordeñar cada vaca, lavamos los pezones con agua tibia y los secamos con toallas individuales desechables. Esto previene la mastitis." },
    { "type": "quiz",
      "question": "¿Por qué se usan toallas individuales por vaca en el ordeño?",
      "options": ["Para ahorrar agua", "Para evitar contagio de mastitis entre vacas", "Por requisito legal"],
      "correct": 1,
      "feedback_ok": "¡Exacto! Evitar el contagio de mastitis es clave para la salud del hato.",
      "feedback_err": "El principal motivo es evitar el contagio de mastitis entre vacas." }
  ]
}
```

- [ ] **Step 2: Crear ep2.json (misiones)**

```json
{
  "misiones": [
    { "id": "mision_ordeno_calidad",  "descripcion": "Aprende buenas prácticas de ordeño con Dr. Ramírez", "trigger": "dialogue_complete", "dialogueKey": "npc_veterinario" },
    { "id": "mision_ordeno_higiene",  "descripcion": "Conoce el protocolo de higiene de Don Carlos",        "trigger": "dialogue_complete", "dialogueKey": "npc_don_carlos" }
  ]
}
```

- [ ] **Step 3: Crear EP2Scene.js**

```js
// src/scenes/EP2Scene.js
import { EpisodeScene } from './EpisodeScene.js';

export class EP2Scene extends EpisodeScene {
  constructor(engine) {
    super(engine, {
      backgroundKey: 'ep2_ordeno',
      episodeId:     'ep2',
      episodeName:   'La Sala de Ordeño',
      playerStart:   { x: 200, y: 750 },
      npcs: [
        { id: 'veterinario', x: 800,  y: 580, spriteKey: 'walk_ramirez', faceKey: 'face_ramirez', dialogueKey: 'npc_veterinario' },
        { id: 'don_carlos',  x: 1400, y: 620, spriteKey: 'walk_carlos',  faceKey: 'face_carlos',  dialogueKey: 'npc_don_carlos' }
      ]
    });
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/scenes/EP2Scene.js src/data/dialogos/ep2.json src/data/misiones/ep2.json
git commit -m "feat: add EP2 - La Sala de Ordeño with milking best practices"
```

---

## Task 25: EP3 — La Maternidad

**Files:**
- Create: `src/scenes/EP3Scene.js`
- Create: `src/data/dialogos/ep3.json`
- Create: `src/data/misiones/ep3.json`

- [ ] **Step 1: Crear ep3.json (diálogos)**

```json
{
  "npc_veterinario": [
    { "type": "dialogue", "speaker": "Dr. Ramírez", "face": "face_ramirez",
      "text": "El manejo de la maternidad es crítico. El calostro es el primer alimento que debe recibir el ternero en las primeras 6 horas de vida." },
    { "type": "quiz",
      "question": "¿En cuántas horas debe recibir el ternero el calostro después de nacer?",
      "options": ["En las primeras 2 horas", "En las primeras 6 horas", "En las primeras 24 horas"],
      "correct": 1,
      "feedback_ok": "¡Correcto! Las primeras 6 horas son clave para la absorción de anticuerpos.",
      "feedback_err": "El calostro debe suministrarse en las primeras 6 horas para máxima absorción de anticuerpos." }
  ],
  "npc_don_carlos": [
    { "type": "dialogue", "speaker": "Don Carlos", "face": "face_carlos",
      "text": "Registramos cada nacimiento: fecha, peso, sexo y número de la madre. Este registro nos ayuda a tomar decisiones de selección genética." },
    { "type": "quiz",
      "question": "¿Para qué sirve el registro de nacimientos en una finca?",
      "options": ["Solo para requisitos legales", "Para selección genética y manejo del hato", "No tiene utilidad práctica"],
      "correct": 1,
      "feedback_ok": "¡Correcto! Los registros son la base de la gestión técnica de la finca.",
      "feedback_err": "Los registros permiten hacer selección genética y mejorar el manejo del hato." }
  ]
}
```

- [ ] **Step 2: Crear ep3.json (misiones)**

```json
{
  "misiones": [
    { "id": "mision_calostro",   "descripcion": "Aprende sobre el calostro con Dr. Ramírez",          "trigger": "dialogue_complete", "dialogueKey": "npc_veterinario" },
    { "id": "mision_registros",  "descripcion": "Conoce la importancia de los registros con Don Carlos", "trigger": "dialogue_complete", "dialogueKey": "npc_don_carlos" }
  ]
}
```

- [ ] **Step 3: Crear EP3Scene.js**

```js
// src/scenes/EP3Scene.js
import { EpisodeScene } from './EpisodeScene.js';

export class EP3Scene extends EpisodeScene {
  constructor(engine) {
    super(engine, {
      backgroundKey: 'ep3_maternidad',
      episodeId:     'ep3',
      episodeName:   'La Maternidad',
      playerStart:   { x: 200, y: 750 },
      npcs: [
        { id: 'veterinario', x: 750,  y: 600, spriteKey: 'walk_ramirez', faceKey: 'face_ramirez', dialogueKey: 'npc_veterinario' },
        { id: 'don_carlos',  x: 1350, y: 640, spriteKey: 'walk_carlos',  faceKey: 'face_carlos',  dialogueKey: 'npc_don_carlos' }
      ]
    });
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/scenes/EP3Scene.js src/data/dialogos/ep3.json src/data/misiones/ep3.json
git commit -m "feat: add EP3 - La Maternidad with calostrum and birth records content"
```

---

## Task 26: EP4 — La Enfermería

**Files:**
- Create: `src/scenes/EP4Scene.js`
- Create: `src/data/dialogos/ep4.json`
- Create: `src/data/misiones/ep4.json`

- [ ] **Step 1: Crear ep4.json (diálogos)**

```json
{
  "npc_veterinario": [
    { "type": "dialogue", "speaker": "Dr. Ramírez", "face": "face_ramirez",
      "text": "La bioseguridad es la base de la sanidad animal. Toda persona que ingrese a la finca debe pasar por el pediluvio y desinfectar su calzado." },
    { "type": "quiz",
      "question": "¿Qué es un pediluvio en una finca ganadera?",
      "options": ["Un bebedero para el ganado", "Un recipiente con desinfectante para los pies", "Una ducha para animales"],
      "correct": 1,
      "feedback_ok": "¡Correcto! El pediluvio previene el ingreso de patógenos a la finca.",
      "feedback_err": "El pediluvio es un recipiente con desinfectante donde se sumerge el calzado para evitar entrada de patógenos." }
  ],
  "npc_chigui": [
    { "type": "dialogue", "speaker": "Chigui", "face": "face_chigui",
      "text": "El calendario de vacunación es muy importante. En Colombia, la vacuna contra fiebre aftosa y brucelosis son obligatorias por ley." },
    { "type": "quiz",
      "question": "¿Cuál vacuna bovina es OBLIGATORIA por ley en Colombia?",
      "options": ["Carbón bacteriano", "Fiebre aftosa", "Leptospirosis"],
      "correct": 1,
      "feedback_ok": "¡Correcto! La vacunación contra fiebre aftosa es obligatoria en Colombia.",
      "feedback_err": "La fiebre aftosa es la vacuna obligatoria por el ICA en Colombia." }
  ]
}
```

- [ ] **Step 2: Crear ep4.json (misiones)**

```json
{
  "misiones": [
    { "id": "mision_bioseguridad",  "descripcion": "Aprende bioseguridad con Dr. Ramírez",          "trigger": "dialogue_complete", "dialogueKey": "npc_veterinario" },
    { "id": "mision_vacunacion",    "descripcion": "Conoce el calendario de vacunación con Chigui", "trigger": "dialogue_complete", "dialogueKey": "npc_chigui" }
  ]
}
```

- [ ] **Step 3: Crear EP4Scene.js**

```js
// src/scenes/EP4Scene.js
import { EpisodeScene } from './EpisodeScene.js';

export class EP4Scene extends EpisodeScene {
  constructor(engine) {
    super(engine, {
      backgroundKey: 'ep4_enfermeria',
      episodeId:     'ep4',
      episodeName:   'La Enfermería',
      playerStart:   { x: 200, y: 750 },
      npcs: [
        { id: 'veterinario', x: 800,  y: 580, spriteKey: 'walk_ramirez', faceKey: 'face_ramirez', dialogueKey: 'npc_veterinario' },
        { id: 'chigui',      x: 1400, y: 620, spriteKey: 'walk_chigui',  faceKey: 'face_chigui',  dialogueKey: 'npc_chigui' }
      ]
    });
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/scenes/EP4Scene.js src/data/dialogos/ep4.json src/data/misiones/ep4.json
git commit -m "feat: add EP4 - La Enfermería with biosecurity and vaccination content"
```

---

## Task 27: EP5 — El Silo y la Dieta

**Files:**
- Create: `src/scenes/EP5Scene.js`
- Create: `src/data/dialogos/ep5.json`
- Create: `src/data/misiones/ep5.json`

- [ ] **Step 1: Crear ep5.json (diálogos)**

```json
{
  "npc_veterinario": [
    { "type": "dialogue", "speaker": "Dr. Ramírez", "face": "face_ramirez",
      "text": "Una vaca de alta producción necesita una dieta balanceada. El ensilaje de maíz es una excelente fuente de energía para mantener la producción de leche." },
    { "type": "quiz",
      "question": "¿Cuál es la función principal del ensilaje en la alimentación bovina?",
      "options": ["Fuente de proteína", "Reserva de energía para épocas de sequía", "Suplemento mineral"],
      "correct": 1,
      "feedback_ok": "¡Correcto! El ensilaje es la principal reserva energética para la época seca.",
      "feedback_err": "El ensilaje es una reserva de energía esencial para la época de sequía del llano." }
  ],
  "npc_don_carlos": [
    { "type": "dialogue", "speaker": "Don Carlos", "face": "face_carlos",
      "text": "Suplementamos con sal mineralizada y melaza. La sal mineralizada aporta calcio, fósforo y oligoelementos esenciales para la reproducción." },
    { "type": "quiz",
      "question": "¿Qué mineral es esencial para la reproducción bovina?",
      "options": ["Hierro", "Fósforo", "Sodio"],
      "correct": 1,
      "feedback_ok": "¡Correcto! El fósforo es fundamental para los procesos reproductivos del ganado.",
      "feedback_err": "El fósforo es el mineral más importante para la reproducción bovina." }
  ]
}
```

- [ ] **Step 2: Crear ep5.json (misiones)**

```json
{
  "misiones": [
    { "id": "mision_ensilaje",   "descripcion": "Aprende sobre ensilaje con Dr. Ramírez",       "trigger": "dialogue_complete", "dialogueKey": "npc_veterinario" },
    { "id": "mision_minerales",  "descripcion": "Conoce la suplementación mineral con Don Carlos", "trigger": "dialogue_complete", "dialogueKey": "npc_don_carlos" }
  ]
}
```

- [ ] **Step 3: Crear EP5Scene.js**

```js
// src/scenes/EP5Scene.js
import { EpisodeScene } from './EpisodeScene.js';

export class EP5Scene extends EpisodeScene {
  constructor(engine) {
    super(engine, {
      backgroundKey: 'ep5_silo',
      episodeId:     'ep5',
      episodeName:   'El Silo y la Dieta',
      playerStart:   { x: 200, y: 750 },
      npcs: [
        { id: 'veterinario', x: 750,  y: 600, spriteKey: 'walk_ramirez', faceKey: 'face_ramirez', dialogueKey: 'npc_veterinario' },
        { id: 'don_carlos',  x: 1350, y: 640, spriteKey: 'walk_carlos',  faceKey: 'face_carlos',  dialogueKey: 'npc_don_carlos' }
      ]
    });
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/scenes/EP5Scene.js src/data/dialogos/ep5.json src/data/misiones/ep5.json
git commit -m "feat: add EP5 - El Silo y la Dieta with nutrition content"
```

---

## Task 28: EP6 — La Oficina del Gerente

**Files:**
- Create: `src/scenes/EP6Scene.js`
- Create: `src/data/dialogos/ep6.json`
- Create: `src/data/misiones/ep6.json`

- [ ] **Step 1: Crear ep6.json (diálogos)**

```json
{
  "npc_don_carlos": [
    { "type": "dialogue", "speaker": "Don Carlos", "face": "face_carlos",
      "text": "La gestión agroempresarial define el éxito de la finca. Llevamos registros de producción, costos e ingresos para calcular la rentabilidad mensual." },
    { "type": "quiz",
      "question": "¿Qué es la rentabilidad de una finca ganadera?",
      "options": ["El total de litros producidos", "La diferencia entre ingresos y costos de producción", "El número de animales"],
      "correct": 1,
      "feedback_ok": "¡Correcto! Rentabilidad = Ingresos - Costos. Es el indicador clave del negocio.",
      "feedback_err": "La rentabilidad es la diferencia entre ingresos y costos de producción." }
  ],
  "npc_chigui": [
    { "type": "dialogue", "speaker": "Chigui", "face": "face_chigui",
      "text": "Los indicadores técnicos como el intervalo entre partos (IEP) y la tasa de natalidad nos dicen si el hato está bien manejado." },
    { "type": "quiz",
      "question": "¿Cuál es el intervalo entre partos (IEP) ideal en ganadería de doble propósito?",
      "options": ["Menos de 12 meses", "Entre 12 y 14 meses", "Más de 18 meses"],
      "correct": 1,
      "feedback_ok": "¡Correcto! Un IEP de 12-14 meses indica buena eficiencia reproductiva.",
      "feedback_err": "El IEP ideal es entre 12 y 14 meses para una buena eficiencia reproductiva." }
  ]
}
```

- [ ] **Step 2: Crear ep6.json (misiones)**

```json
{
  "misiones": [
    { "id": "mision_rentabilidad",  "descripcion": "Aprende sobre rentabilidad con Don Carlos", "trigger": "dialogue_complete", "dialogueKey": "npc_don_carlos" },
    { "id": "mision_indicadores",   "descripcion": "Conoce los indicadores técnicos con Chigui", "trigger": "dialogue_complete", "dialogueKey": "npc_chigui" }
  ]
}
```

- [ ] **Step 3: Crear EP6Scene.js**

```js
// src/scenes/EP6Scene.js
import { EpisodeScene } from './EpisodeScene.js';

export class EP6Scene extends EpisodeScene {
  constructor(engine) {
    super(engine, {
      backgroundKey: 'ep6_oficina',
      episodeId:     'ep6',
      episodeName:   'La Oficina del Gerente',
      playerStart:   { x: 200, y: 700 },
      npcs: [
        { id: 'don_carlos', x: 800,  y: 550, spriteKey: 'walk_carlos',  faceKey: 'face_carlos',  dialogueKey: 'npc_don_carlos' },
        { id: 'chigui',     x: 1400, y: 600, spriteKey: 'walk_chigui',  faceKey: 'face_chigui',  dialogueKey: 'npc_chigui' }
      ]
    });
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/scenes/EP6Scene.js src/data/dialogos/ep6.json src/data/misiones/ep6.json
git commit -m "feat: add EP6 - La Oficina del Gerente with business management content"
```

---

## Task 29: EP7 — El Mercado Verde

**Files:**
- Create: `src/scenes/EP7Scene.js`
- Create: `src/data/dialogos/ep7.json`
- Create: `src/data/misiones/ep7.json`

- [ ] **Step 1: Crear ep7.json (diálogos)**

```json
{
  "npc_don_carlos": [
    { "type": "dialogue", "speaker": "Don Carlos", "face": "face_carlos",
      "text": "La comercialización sostenible implica vender productos con valor agregado. La leche certificada como libre de brucelosis tiene mejor precio en el mercado." },
    { "type": "quiz",
      "question": "¿Qué ventaja tiene tener certificación sanitaria para vender ganado?",
      "options": ["Solo es un trámite burocrático", "Permite acceder a mejores mercados y precios", "No tiene ninguna ventaja"],
      "correct": 1,
      "feedback_ok": "¡Correcto! La certificación sanitaria abre puertas a mercados más exigentes y mejor pagados.",
      "feedback_err": "La certificación sanitaria permite acceder a mejores mercados y obtener mejores precios." }
  ],
  "npc_chigui": [
    { "type": "dialogue", "speaker": "Chigui", "face": "face_chigui",
      "text": "La ganadería sostenible protege el medio ambiente. Reducir la huella de carbono y conservar las fuentes de agua aumenta el valor de la finca." },
    { "type": "quiz",
      "question": "¿Cuál práctica ganadera contribuye a la sostenibilidad ambiental?",
      "options": ["Tala de árboles para ampliar potreros", "Silvopastoreo con árboles nativos", "Uso de herbicidas en pasturas"],
      "correct": 1,
      "feedback_ok": "¡Correcto! El silvopastoreo integra ganado, pastos y árboles para mayor sostenibilidad.",
      "feedback_err": "El silvopastoreo es la práctica más sostenible: integra árboles, pastos y ganado." }
  ]
}
```

- [ ] **Step 2: Crear ep7.json (misiones)**

```json
{
  "misiones": [
    { "id": "mision_certificacion",  "descripcion": "Aprende sobre comercialización certificada con Don Carlos", "trigger": "dialogue_complete", "dialogueKey": "npc_don_carlos" },
    { "id": "mision_sostenibilidad", "descripcion": "Conoce la ganadería sostenible con Chigui",                "trigger": "dialogue_complete", "dialogueKey": "npc_chigui" }
  ]
}
```

- [ ] **Step 3: Crear EP7Scene.js**

```js
// src/scenes/EP7Scene.js
import { EpisodeScene } from './EpisodeScene.js';

export class EP7Scene extends EpisodeScene {
  constructor(engine) {
    super(engine, {
      backgroundKey: 'ep7_mercado',
      episodeId:     'ep7',
      episodeName:   'El Mercado Verde',
      playerStart:   { x: 200, y: 750 },
      npcs: [
        { id: 'don_carlos', x: 800,  y: 580, spriteKey: 'walk_carlos',  faceKey: 'face_carlos',  dialogueKey: 'npc_don_carlos' },
        { id: 'chigui',     x: 1400, y: 630, spriteKey: 'walk_chigui',  faceKey: 'face_chigui',  dialogueKey: 'npc_chigui' }
      ]
    });
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/scenes/EP7Scene.js src/data/dialogos/ep7.json src/data/misiones/ep7.json
git commit -m "feat: add EP7 - El Mercado Verde with sustainable commercialization content"
```

---

## Task 30: Episodio Final

**Files:**
- Create: `src/scenes/FinalScene.js`
- Create: `src/data/dialogos/ep_final.json`
- Create: `src/data/misiones/ep_final.json`

- [ ] **Step 1: Crear ep_final.json (diálogos)**

```json
{
  "npc_don_carlos": [
    { "type": "dialogue", "speaker": "Don Carlos", "face": "face_carlos",
      "text": "Has recorrido toda La Esperanza. Ahora demuestra que integraste los conocimientos de ganadería sostenible. ¡Este es tu examen final!" },
    { "type": "quiz",
      "question": "¿Cuál es el primer paso del sistema de pastoreo rotacional?",
      "options": ["Dividir el potrero en cuarteles", "Comprar más ganado", "Aplicar herbicidas"],
      "correct": 0,
      "feedback_ok": "¡Excelente! Dividir el potrero es el fundamento del pastoreo rotacional.",
      "feedback_err": "Dividir el potrero en cuarteles es el primer paso del sistema rotacional." },
    { "type": "quiz",
      "question": "¿Cuántas horas después del nacimiento debe recibir el calostro el ternero?",
      "options": ["48 horas", "24 horas", "6 horas"],
      "correct": 2,
      "feedback_ok": "¡Correcto! Las primeras 6 horas son críticas para la inmunidad del ternero.",
      "feedback_err": "El calostro debe suministrarse en las primeras 6 horas de vida." }
  ],
  "npc_veterinario": [
    { "type": "dialogue", "speaker": "Dr. Ramírez", "face": "face_ramirez",
      "text": "Ahora integra todo lo aprendido sobre sanidad animal." },
    { "type": "quiz",
      "question": "¿Qué vacuna es OBLIGATORIA para el ganado bovino en Colombia?",
      "options": ["Rabia", "Fiebre Aftosa", "Carbón sintomático"],
      "correct": 1,
      "feedback_ok": "¡Correcto! La fiebre aftosa es de vacunación obligatoria por el ICA.",
      "feedback_err": "La fiebre aftosa es la única de vacunación obligatoria por ley en Colombia." },
    { "type": "dialogue", "speaker": "Dr. Ramírez", "face": "face_ramirez",
      "text": "¡Felicitaciones, Aprendiz SENA! Has demostrado dominar las competencias de ganadería sostenible. ¡La Finca del Saber es tuya!" }
  ],
  "npc_chigui": [
    { "type": "dialogue", "speaker": "Chigui", "face": "face_chigui",
      "text": "¡Lo lograste! Recuerda siempre que una ganadería sostenible es rentable, responsable con el ambiente y respetuosa con los animales. ¡Orgullo SENA!" }
  ]
}
```

- [ ] **Step 2: Crear ep_final.json (misiones)**

```json
{
  "misiones": [
    { "id": "mision_integracion_gestion",  "descripcion": "Demuestra tu conocimiento de gestión con Don Carlos",    "trigger": "dialogue_complete", "dialogueKey": "npc_don_carlos" },
    { "id": "mision_integracion_sanidad",  "descripcion": "Demuestra tu conocimiento de sanidad con Dr. Ramírez",   "trigger": "dialogue_complete", "dialogueKey": "npc_veterinario" },
    { "id": "mision_despedida_chigui",     "descripcion": "Recibe la despedida de Chigui",                          "trigger": "dialogue_complete", "dialogueKey": "npc_chigui" }
  ]
}
```

- [ ] **Step 3: Crear FinalScene.js**

```js
// src/scenes/FinalScene.js
import { EpisodeScene } from './EpisodeScene.js';

export class FinalScene extends EpisodeScene {
  constructor(engine) {
    super(engine, {
      backgroundKey: 'ep_final',
      episodeId:     'ep_final',
      episodeName:   'Episodio Final',
      playerStart:   { x: 860, y: 800 },
      npcs: [
        { id: 'don_carlos',  x: 650,  y: 550, spriteKey: 'walk_carlos',  faceKey: 'face_carlos',  dialogueKey: 'npc_don_carlos' },
        { id: 'veterinario', x: 960,  y: 500, spriteKey: 'walk_ramirez', faceKey: 'face_ramirez', dialogueKey: 'npc_veterinario' },
        { id: 'chigui',      x: 1270, y: 560, spriteKey: 'walk_chigui',  faceKey: 'face_chigui',  dialogueKey: 'npc_chigui' }
      ]
    });
  }
}
```

- [ ] **Step 4: Verificación final completa**

```bash
npm run dev
```

Recorrer el juego completo:
1. Pantalla título → Nueva Partida → seleccionar personaje
2. Mapa Mundial → EP0 disponible, resto bloqueados
3. Completar EP0 → EP1 se desbloquea automáticamente
4. Verificar que `CONTINUAR` aparece en TitleScene al recargar la página
5. Verificar diálogos, quizzes con feedback correcto/incorrecto
6. Completar todos los episodios → FinalScene accesible

- [ ] **Step 5: Ejecutar tests unitarios finales**

```bash
npx vitest run
```
Expected: PASS — todos los tests (Vector2, SpriteSheet, SceneManager, SaveManager, DialogueSystem).

- [ ] **Step 6: Commit final**

```bash
git add src/scenes/FinalScene.js src/data/dialogos/ep_final.json src/data/misiones/ep_final.json
git commit -m "feat: add FinalScene - Episodio Final with integration assessment

Completes the full AGROPEC QUEST game engine implementation:
- 9 episodes with educational dialogue and quizzes
- Full progression system with unlock chain
- Auto-save with localStorage
- World map navigation

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Resumen de archivos creados

| Archivo | Tarea |
|---|---|
| `package.json` (modificado) | 1 |
| `vitest.config.js` | 1 |
| `src/ui/styles.css` | 2 |
| `src/utils/Vector2.js` | 3 |
| `src/engine/AssetLoader.js` | 4 |
| `src/engine/GameEngine.js` | 5 |
| `src/engine/SceneManager.js` | 6 |
| `src/systems/InputManager.js` | 7 |
| `src/utils/SpriteSheet.js` | 8 |
| `src/entities/Entity.js` | 9 |
| `src/entities/Player.js` | 10 |
| `src/entities/NPC.js` | 11 |
| `src/systems/SaveManager.js` | 12 |
| `src/ui/DialogueBox.js` | 13 |
| `src/systems/DialogueSystem.js` | 14 |
| `src/ui/HUD.js` | 15 |
| `src/scenes/Scene.js` | 16 |
| `src/scenes/TitleScene.js` | 17 |
| `src/scenes/CharacterSelectScene.js` | 18 |
| `src/scenes/WorldMapScene.js` | 19 |
| `src/scenes/EpisodeScene.js` | 20 |
| `src/engine/main.js` | 21 |
| `src/scenes/EP0Scene.js` + datos | 22 |
| `src/scenes/EP1Scene.js` + datos | 23 |
| `src/scenes/EP2Scene.js` + datos | 24 |
| `src/scenes/EP3Scene.js` + datos | 25 |
| `src/scenes/EP4Scene.js` + datos | 26 |
| `src/scenes/EP5Scene.js` + datos | 27 |
| `src/scenes/EP6Scene.js` + datos | 28 |
| `src/scenes/EP7Scene.js` + datos | 29 |
| `src/scenes/FinalScene.js` + datos | 30 |
| Tests: `src/__tests__/*.test.js` | 1,3,6,8,12,14 |
