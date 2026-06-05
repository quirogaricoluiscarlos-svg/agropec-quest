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
