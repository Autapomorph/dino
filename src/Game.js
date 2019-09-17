import Phaser from 'phaser';

import CONFIG from './config/game';
import BootScene from './scenes/boot/BootScene';
import GameScene from './scenes/game/GameScene';

/**
 * Game
 * @class Game
 * @extends {Phaser.Game}
 */
class Game extends Phaser.Game {
  static CONFIG = CONFIG.GAME;

  /**
   * Creates an instance of Game
   * @param {Phaser.Types.Core.GameConfig} config - Game config
   */
  constructor(config) {
    super(config);

    this.initEventHandlers();
    this.addScenes();
    this.startScene();
  }

  /**
   * Init event handlers
   */
  initEventHandlers() {
    this.scale.on('resize', () => {
      this.resize(this.scale.parentSize);
    });
  }

  /**
   * Add scenes to game
   */
  addScenes() {
    this.scene.add(BootScene.CONFIG.NAME, BootScene);
    this.scene.add(GameScene.CONFIG.NAME, GameScene);
  }

  /**
   * Start scene
   */
  startScene() {
    this.scene.start(BootScene.CONFIG.NAME);
  }

  /**
   * Resize game
   * @param {Phaser.Structs.Size} parentSize - Current parent size
   */
  resize(parentSize) {
    const { width: parentWidth, height: parentHeight } = parentSize;

    let width;
    let height;

    if (parentWidth < parentHeight) {
      width = Game.CONFIG.WIDTH.PORTRAIT;
      height = Game.CONFIG.HEIGHT;
    } else {
      width = Game.CONFIG.WIDTH.LANDSCAPE;
      height = Game.CONFIG.HEIGHT;
    }

    this.canvas.style.width = `${parentWidth}px`;
    this.canvas.style.height = `${height * (parentWidth / width)}px`;

    if (parentWidth === this.prevParentWidth && parentHeight === this.prevParentHeight) {
      return;
    }

    this.prevParentWidth = parentWidth;
    this.prevParentHeight = parentHeight;

    this.scale.setGameSize(width, height);
  }
}

export default Game;
