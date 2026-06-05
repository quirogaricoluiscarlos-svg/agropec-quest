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
