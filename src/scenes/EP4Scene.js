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
