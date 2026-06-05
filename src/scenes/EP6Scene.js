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
