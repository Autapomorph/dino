import Phaser from 'phaser';

import CONFIG from '../../config/game';
import GameScene from '../game/GameScene';

/**
 * BootScene
 * @class BootScene
 * @extends {Phaser.Scene}
 */
class BootScene extends Phaser.Scene {
  static CONFIG = CONFIG.SCENES.BOOT;

  /**
   * Creates an instance of BootScene
   */
  constructor() {
    super(BootScene.CONFIG.NAME);
  }

  preload() {
    this.load.atlas('dino', 'assets/sprites/dino-atlas.png', 'assets/sprites/dino-atlas.json');

    this.load.bitmapFont(
      'joystix',
      'assets/fonts/joystix_monospace.png',
      'assets/fonts/joystix_monospace.fnt',
    );

    this.load.audio('player-action', 'assets/sounds/player-action.mp3');
    this.load.audio('achievement', 'assets/sounds/achievement.mp3');
    this.load.audio('gameover', 'assets/sounds/gameover.mp3');
  }

  create() {
    this.scene.start(GameScene.CONFIG.NAME);
  }
}

export default BootScene;
