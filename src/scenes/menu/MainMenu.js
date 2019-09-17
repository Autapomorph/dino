import Phaser from 'phaser';

import GameScene from '../Game';
import SceneButton from '../../prefabs/SceneButton';

class MainMenuScene extends Phaser.Scene {
  static name = 'MainMenuScene';

  constructor() {
    super(MainMenuScene.name);
  }

  create() {
    this.createPlayButton();
  }

  createPlayButton() {
    const { width, height } = this.scale.gameSize;
    const centerX = width / 2;
    const centerY = height / 2;

    this.gameButton = new SceneButton({
      scene: this,
      nextScene: GameScene.name,
      x: centerX,
      y: centerY,
      text: 'Play',
      textures: {
        default: 'button',
        hover: 'buttonHover',
      },
    });
  }
}

export default MainMenuScene;
