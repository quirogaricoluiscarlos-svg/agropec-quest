// src/scenes/EpisodeScene.js
import { Scene } from './Scene.js';
import { AssetLoader } from '../engine/AssetLoader.js';
import { InputManager } from '../systems/InputManager.js';
import { SaveManager } from '../systems/SaveManager.js';
import { Player } from '../entities/Player.js';
import { NPC } from '../entities/NPC.js';
import { HUD } from '../ui/HUD.js';
import { DialogueSystem } from '../systems/DialogueSystem.js';
import { Vector2 } from '../utils/Vector2.js';
import { WorldMapScene } from './WorldMapScene.js';

export class EpisodeScene extends Scene {
  constructor(engine, config) {
    super(engine);
    this._config = config;
    this._player = null;
    this._npcs = [];
    this._hud = new HUD();
    this._dialogue = new DialogueSystem();
    this._missionData = null;
    this._completedMissions = new Set();
    this._playerFaceKey = null;
    this._exitConfirm = false;
    this._initialized = false;
  }

  async init() {
    const { episodeId, playerStart, npcs } = this._config;
    const state = SaveManager.load();
    const spriteKey = state.personaje === 'aprendiz_f' ? 'walk_valentina' : 'walk_andres';
    const faceKey   = state.personaje === 'aprendiz_f' ? 'face_valentina' : 'face_andres';
    this._playerFaceKey = faceKey;

    this._player = new Player(spriteKey, playerStart.x, playerStart.y);
    this._npcs = npcs.map(cfg => new NPC(cfg));

    try {
      const res = await fetch(`src/data/misiones/${episodeId}.json`);
      this._missionData = await res.json();
    } catch { this._missionData = { misiones: [] }; }

    const savedMissions = state.misiones?.[episodeId] ?? [];
    savedMissions.forEach(id => this._completedMissions.add(id));

    this._hud.show(this._config.episodeName, this._missionData.misiones.length);
    this._hud.setProgress(this._completedMissions.size);

    if (state.episodios[episodeId] === 'disponible') {
      state.episodios[episodeId] = 'en_progreso';
      SaveManager.save(state);
    }
    this._initialized = true;
  }

  update(dt) {
    if (!this._initialized) return;
    this._dialogue.update(dt);

    if (!InputManager.dialogueActive) {
      const nearNPC = this._npcs.find(n => Vector2.distance(this._player, n) <= 80);
      this._npcs.forEach(n => { n.inRange = n === nearNPC; });

      const peekClick = InputManager.click;
      const clickedNPC = peekClick && this._npcs.find(n => Vector2.distance(peekClick, n) <= 50);

      if (nearNPC && InputManager.consumeKey('Space')) {
        this._activateNPC(nearNPC);
      } else if (clickedNPC) {
        InputManager.consumeClick();
        this._activateNPC(clickedNPC);
      } else {
        this._player.update(dt);
      }

      if (InputManager.consumeKey('Escape')) {
        this._exitConfirm = !this._exitConfirm;
      }
      if (this._exitConfirm) {
        if (InputManager.consumeKey('Enter')) this._exitToMap();
        if (InputManager.consumeKey('KeyN'))  this._exitConfirm = false;
      }
    }

    this._npcs.forEach(n => n.update(dt));
  }

  async _activateNPC(npc) {
    try {
      const res = await fetch(`src/data/dialogos/${this._config.episodeId}.json`);
      const data = await res.json();
      const nodes = data[npc.dialogueKey] ?? [];
      this._dialogue.start(nodes, () => this._onDialogueComplete(npc.dialogueKey));
    } catch { console.warn(`No dialogue data for ${this._config.episodeId}`); }
  }

  _onDialogueComplete(dialogueKey) {
    const mission = this._missionData?.misiones.find(m => m.dialogueKey === dialogueKey);
    if (mission && !this._completedMissions.has(mission.id)) {
      this._completedMissions.add(mission.id);
      SaveManager.completeMission(this._config.episodeId, mission.id);
      this._hud.setProgress(this._completedMissions.size);
      const total = this._missionData.misiones.length;
      if (SaveManager.completeEpisode(this._config.episodeId, total)) {
        setTimeout(() => this._exitToMap(), 2000);
      }
    }
  }

  _exitToMap() {
    this.engine.sceneManager.replace(new WorldMapScene(this.engine));
  }

  draw(ctx) {
    const bg = AssetLoader.get(this._config.backgroundKey);
    ctx.drawImage(bg, 0, 0, 1920, 1080);

    if (!this._initialized) {
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(0, 0, 1920, 1080);
      ctx.fillStyle = '#FDC300';
      ctx.font = 'bold 36px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Cargando episodio...', 960, 540);
      ctx.textAlign = 'left';
      return;
    }

    this._npcs.forEach(n => n.draw(ctx));
    this._player.draw(ctx);
    this._hud.draw(ctx, this._playerFaceKey);
    this._dialogue.draw(ctx);

    if (this._exitConfirm) {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(610, 440, 700, 200);
      ctx.strokeStyle = '#FDC300';
      ctx.lineWidth = 3;
      ctx.strokeRect(610, 440, 700, 200);
      ctx.fillStyle = '#FDC300';
      ctx.font = 'bold 28px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('¿Salir al mapa?', 960, 500);
      ctx.fillStyle = '#fff';
      ctx.font = '22px monospace';
      ctx.fillText('[ENTER] Sí    [N] No', 960, 560);
      ctx.restore();
    }
  }
}
