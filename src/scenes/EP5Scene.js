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
