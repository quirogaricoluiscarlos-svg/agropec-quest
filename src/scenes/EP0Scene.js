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
