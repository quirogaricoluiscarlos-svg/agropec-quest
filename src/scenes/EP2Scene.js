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
