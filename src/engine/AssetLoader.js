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
