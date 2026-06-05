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
