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

    this.registerResizeHandler();
    this.addScenes();
    this.startScene();
  }

  /**
   * Register reize handler
   */
  registerResizeHandler() {
    this.scale.on('resize', () => {
      const { parentSize } = this.scale;
      const { width, height } = parentSize;

      if (width === this.prevParentWidth && height === this.prevParentHeight) {
        return;
      }

      this.prevParentWidth = width;
      this.prevParentHeight = height;

      this.resize(parentSize);
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
    const gameWidth =
      parentWidth < parentHeight ? Game.CONFIG.WIDTH.PORTRAIT : Game.CONFIG.WIDTH.LANDSCAPE;
    const gameHeight = Game.CONFIG.HEIGHT;

    this.canvas.style.width = `${parentWidth}px`;
    this.canvas.style.height = `${gameHeight * (parentWidth / gameWidth)}px`;

    this.scale.resize(gameWidth, gameHeight);
  }
}

export default Game;
