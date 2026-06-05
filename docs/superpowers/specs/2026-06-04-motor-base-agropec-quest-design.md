# Diseño: Motor Base AGROPEC QUEST

**Fecha:** 2026-06-04  
**Autor:** Luis Carlos Quiroga Rico  
**Proyecto:** AGROPEC QUEST: La Finca del Saber  
**Institución:** SENA — Centro Agroindustrial del Meta  
**Estado:** Aprobado

---

## Contexto

RPG educativo ganadero en HTML5 Canvas + JavaScript ES6+ Vanilla (sin frameworks). Todos los assets visuales están listos: 9 fondos PNG, 5 spritesheets de personajes, 4 retratos para diálogos, mapa mundial. El código del juego es cero — este diseño define el motor completo a construir.

---

## Flujo del jugador

```
Pantalla Título
  → Selección de Personaje (Andrés ♂ / Valentina ♀)
    → Mapa Mundial (9 zonas clickeables)
      → EpisodioN (libre exploración + activación de NPCs)
        → Diálogo / Quiz
          → Misión completada → de vuelta al Mapa Mundial
```

Episodios se desbloquean en orden (EP0 → EP1 → ... → EP_Final). Al completar todos → pantalla de logro final.

---

## Arquitectura: Módulos ES6

Todos los módulos son clases ES6, comunicados por interfaces definidas. Sin bundler — `type="module"` en `index.html`.

### Árbol de archivos

```
src/
├── engine/
│   ├── main.js              ← Bootstrap: AssetLoader → GameEngine → TitleScene
│   ├── GameEngine.js        ← Game loop (rAF, deltaTime, canvas scaling 16:9)
│   ├── SceneManager.js      ← push/pop/replace + fade negro 300ms
│   └── AssetLoader.js       ← Precarga assets desde manifiesto, barra de progreso
├── systems/
│   ├── InputManager.js      ← Teclado + clic/toque unificados, flag dialogueActive
│   ├── DialogueSystem.js    ← Ejecuta nodos dialogue/quiz en secuencia, onComplete()
│   └── SaveManager.js       ← localStorage key: "agropec_save", load/save/reset
├── entities/
│   ├── Entity.js            ← Base: x, y, width, height, update(dt), draw(ctx)
│   ├── Player.js            ← Input WASD/flechas + clic destino, animación spritesheet
│   └── NPC.js               ← Posición fija, zona activación 60px, ícono flotante
├── scenes/
│   ├── Scene.js             ← Base: init(), update(dt), draw(ctx), destroy()
│   ├── TitleScene.js        ← Logo + botones JUGAR / CONTINUAR
│   ├── CharacterSelectScene.js ← Retratos Andrés/Valentina con atributos
│   ├── WorldMapScene.js     ← World_Map_background + 9 hotspots con estado
│   ├── EpisodeScene.js      ← Base episodio: fondo + Player + NPC[] + HUD
│   ├── EP0Scene.js          ← Entrada a la Finca
│   ├── EP1Scene.js          ← El Potrero Perdido
│   ├── EP2Scene.js          ← La Sala de Ordeño
│   ├── EP3Scene.js          ← La Maternidad
│   ├── EP4Scene.js          ← La Enfermería
│   ├── EP5Scene.js          ← El Silo y la Dieta
│   ├── EP6Scene.js          ← La Oficina del Gerente
│   ├── EP7Scene.js          ← El Mercado Verde
│   └── FinalScene.js        ← Episodio Final — integración de competencias
├── ui/
│   ├── styles.css           ← Canvas centrado, fondo negro, cursor pointer sobre hotspots
│   ├── HUD.js               ← Retrato + nombre episodio + barra misiones (canvas render)
│   └── DialogueBox.js       ← Panel semitransparente inferior, retrato 64×64, opciones quiz
├── data/
│   ├── personajes/
│   │   └── personajes.json  ← Ya existe (5 personajes con atributos)
│   ├── dialogos/
│   │   ├── ep0.json … ep7.json + ep_final.json
│   └── misiones/
│       ├── ep0.json … ep7.json + ep_final.json
└── utils/
    ├── SpriteSheet.js       ← getFrame(row, col) → {sx, sy, sw, sh}
    └── Vector2.js           ← {x,y}, distancia, normalización, lerp
```

---

## Sistemas en detalle

### GameEngine
- Loop: `requestAnimationFrame` con `deltaTime = (now - last) / 1000` (segundos)
- Canvas scaling: escala al viewport manteniendo relación 16:9 (1920×1080 virtual)
- Delega `update(dt)` y `draw()` a `SceneManager.current()`
- Expone `canvas` y `ctx` globalmente vía singleton

### SceneManager
- Pila de escenas (`stack: Scene[]`)
- `push(scene)` — apila (preserva anterior, útil para pausa)
- `pop()` — desapila y restaura anterior
- `replace(scene)` — destruye actual, activa nueva
- Todas las transiciones hacen fade a negro en 300ms antes de cambiar

### AssetLoader
Manifiesto de assets precargados:
```js
const MANIFEST = {
  // Fondos
  world_map:      'assets/images/backgrounds/World_Map_background.png',
  ep0_entrada:    'assets/images/backgrounds/ep0_entrada.png',
  // ... ep1–ep7 + ep_final
  // Sprites
  walk_andres:    'assets/images/sprites/aprendiz_m/walk/andres_walk.png',
  walk_valentina: 'assets/images/sprites/aprendiz_f/walk/valentina_walk.png',
  walk_carlos:    'assets/images/sprites/administrador/walk/carlos_walk.png',
  walk_chigui:    'assets/images/sprites/chigui/walk/chigui_walk.png',
  walk_ramirez:   'assets/images/sprites/veterinario/walk/Dr__Ramirez_walk.png',
  // Retratos
  face_andres:    'assets/images/ui/faces/andres_face.png',
  face_valentina: 'assets/images/ui/faces/valentina_face.png',
  face_carlos:    'assets/images/ui/faces/carlos_face.png',
  face_chigui:    'assets/images/ui/faces/chigui_face.png',
  face_ramirez:   'assets/images/ui/faces/Dr__Ramirez_face.png',
}
```
Muestra barra de progreso sobre fondo negro hasta cargar todo. `AssetLoader.get(key)` devuelve `HTMLImageElement`.

### InputManager
- Escucha `keydown`, `keyup`, `mousedown`, `mousemove`, `touchstart`
- Expone: `InputManager.isDown(key)`, `InputManager.consumeClick()` → `{x, y}` o null
- Flag `InputManager.dialogueActive` — cuando `true`, Player ignora input de movimiento
- Coordenadas de clic se transforman al espacio virtual 1920×1080

### DialogueSystem
Formato de nodo en JSON:
```json
[
  {
    "type": "dialogue",
    "speaker": "Dr. Ramírez",
    "face": "face_ramirez",
    "text": "Este potrero necesita rotación cada 15 días."
  },
  {
    "type": "quiz",
    "question": "¿Cada cuántos días se debe rotar el potrero?",
    "options": ["15 días", "30 días", "60 días"],
    "correct": 0,
    "feedback_ok": "¡Correcto! La rotación frecuente recupera el pasto.",
    "feedback_err": "Intenta de nuevo. Piensa en la recuperación del pasto."
  }
]
```
- Ejecuta nodos en orden, avanza con Espacio/Enter o clic
- Quiz: permite reintentar hasta acertar, luego avanza
- Al terminar: llama `onComplete(dialogueKey)` → la escena marca misión

### SaveManager
Estructura del objeto de guardado:
```json
{
  "personaje": "aprendiz_m",
  "episodios": {
    "ep0": "completado",
    "ep1": "en_progreso",
    "ep2": "bloqueado"
  },
  "misiones": {
    "ep1": ["mision_npc_veterinario"]
  },
  "timestamp": 1717459200000
}
```
- `SaveManager.save(gameState)` — serializa a localStorage
- `SaveManager.load()` — deserializa o devuelve estado inicial
- `SaveManager.reset()` — borra guardado (para nueva partida)
- Auto-guardado al completar cada misión y al salir de un episodio

---

## Entidades

### Entity (base)
```
x, y, width, height, visible
update(dt), draw(ctx)
```

### SpriteSheet
- Constructor: `(image, frameWidth, frameHeight, cols)`
- `getFrame(row, col)` → `{sx, sy, sw, sh}` para `ctx.drawImage`
- Animación: acumula `dt`, avanza frame cada 150ms
- Los spritesheets actuales tienen **3 filas × 6 columnas**: fila 0=idle frontal, fila 1=idle lateral, fila 2=caminata
- Dirección izquierda: fila 2 con `ctx.scale(-1, 1)` (espejado horizontal)
- La distribución exacta se confirma al implementar `SpriteSheet.js` inspeccionando cada imagen

### Player
- Velocidad: 200px/s (espacio virtual)
- **Teclado:** WASD o flechas → movimiento directo en 4 direcciones
- **Clic:** destino = punto de clic → se mueve en línea recta hasta llegar (tolerancia 4px)
- Idle: frame 0 de la dirección actual cuando velocidad = 0
- Al entrar en rango de NPC (≤60px): muestra indicador visual
- Al presionar Espacio o clicar NPC en rango: activa `DialogueSystem`

### NPC
- Posición fija definida en la escena
- Sprite estático o animación idle (loop frames fila 0)
- `dialogueKey`: clave del array en el JSON del episodio
- Ícono flotante `!` cuando Player está en rango (animación bounce simple)

---

## Escenas

### TitleScene
- Fondo negro, colores SENA
- Logo centrado + título
- Botón "JUGAR" → `replace(CharacterSelectScene)`
- Botón "CONTINUAR" (visible si existe guardado) → `replace(WorldMapScene)` con estado restaurado

### CharacterSelectScene
- Dos tarjetas lado a lado: Andrés y Valentina
- Cada tarjeta: retrato, nombre, rol, 4 barras de atributos (Salud, Agilidad, Conocimiento, Gestión)
- Selección con flechas ←→ o clic, confirmar con Enter
- Guarda selección y hace `replace(WorldMapScene)`

### WorldMapScene
- Fondo: `World_Map_background.png` a pantalla completa
- 9 hotspots con coordenadas manuales ajustadas al mapa
- Estado visual por hotspot:
  - `bloqueado` → ícono candado gris
  - `disponible` → círculo pulsante verde SENA
  - `en_progreso` → círculo amarillo
  - `completado` → estrella dorada
- Hover: tooltip con nombre del episodio
- Clic en disponible/en_progreso → `replace(EPnScene)`
- ESC → menú pausa (continuar / nueva partida)

### EpisodeScene (base)
Toda escena de episodio extiende esta clase y define solo:
- `backgroundKey` — clave del fondo en AssetLoader
- `npcs` — array de `{id, x, y, spriteKey, dialogueKey}`

La clase base se encarga de:
- Renderizar fondo a pantalla completa
- Instanciar Player en posición inicial
- Instanciar NPC[] con sus posiciones
- Activar HUD
- Escuchar completado de misiones → SaveManager → vuelta a WorldMap

---

## UI

### DialogueBox
Panel semitransparente (rgba 0,0,0,0.75) en mitad inferior del canvas:
```
┌────────────────────────────────────────────────────────┐
│  [retrato]   Nombre del NPC                            │
│  64×64px     Texto del diálogo que puede ser largo...  │
│                                        [▼ CONTINUAR]   │
└────────────────────────────────────────────────────────┘
```
Para quiz: panel expandido con pregunta y opciones A/B/C numeradas.
Respuesta correcta → feedback verde. Incorrecta → feedback rojo + reintentar.

### HUD
Renderizado sobre canvas, esquina superior izquierda:
- Retrato 32×32 del personaje activo
- Nombre del episodio (fuente pixelada)
- Barra de progreso: `[████░░] 2/3 misiones`
- ESC abre confirmación de salida al mapa

---

## Data: JSON de diálogos y misiones

### Diálogos (`data/dialogos/epN.json`)
Array de nodos indexado por `dialogueKey` del NPC.

### Misiones (`data/misiones/epN.json`)
```json
{
  "misiones": [
    {
      "id": "mision_npc_veterinario",
      "descripcion": "Habla con el Dr. Ramírez sobre rotación de potreros",
      "trigger": "dialogue_complete",
      "dialogueKey": "npc_veterinario"
    }
  ]
}
```
Un episodio se marca completado cuando todas sus misiones están en estado `completado`.

---

## Guardado y progresión

- Auto-guardado al completar misión y al salir de episodio
- Episodios se desbloquean en orden secuencial (EP0→EP1→...→Final)
- Nueva partida limpia el localStorage y vuelve a CharacterSelectScene

---

## Fuera del alcance (Fase 2+)

- Audio / música / efectos de sonido
- Minijuegos interactivos complejos (arrastrar objetos, etc.)
- Animaciones cinemáticas
- Multijugador
- Backend / servidor
- Accesibilidad avanzada
