// src/engine/main.js
import { GameEngine } from './GameEngine.js';
import { SceneManager } from './SceneManager.js';
import { AssetLoader } from './AssetLoader.js';
import { InputManager } from '../systems/InputManager.js';
import { TitleScene } from '../scenes/TitleScene.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1920;
canvas.height = 1080;

function drawLoading(progress) {
  ctx.fillStyle = '#00304D';
  ctx.fillRect(0, 0, 1920, 1080);
  ctx.fillStyle = '#39A900';
  ctx.font = 'bold 48px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('AGROPEC QUEST', 960, 460);
  ctx.fillStyle = '#333';
  ctx.fillRect(560, 520, 800, 30);
  ctx.fillStyle = '#39A900';
  ctx.fillRect(560, 520, Math.floor(800 * progress), 30);
  ctx.strokeStyle = '#39A900';
  ctx.lineWidth = 2;
  ctx.strokeRect(560, 520, 800, 30);
  ctx.fillStyle = '#aaa';
  ctx.font = '20px monospace';
  ctx.fillText(`Cargando... ${Math.floor(progress * 100)}%`, 960, 590);
  ctx.textAlign = 'left';
}

async function main() {
  drawLoading(0);
  await AssetLoader.loadAll(p => drawLoading(p));

  const engine = new GameEngine(canvas);
  const sceneManager = new SceneManager();
  engine.sceneManager = sceneManager;

  InputManager.init(canvas);
  sceneManager.push(new TitleScene(engine));
  engine.start(sceneManager);
}

main().catch(err => {
  console.error('Error al iniciar el juego:', err);
  ctx.fillStyle = '#e00';
  ctx.font = '24px monospace';
  ctx.fillText(`Error: ${err.message}`, 60, 540);
});
