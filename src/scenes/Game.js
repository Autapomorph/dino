import Phaser from 'phaser';

import Player from '../prefabs/Player';

class GameScene extends Phaser.Scene {
  static name = 'GameScene';

  constructor() {
    super(GameScene.name);
  }

  create() {
    const { width } = this.scale.gameSize;
    const centerX = width / 2;

    this.player = new Player(this, centerX, 150, 'player');
    this.createPlayerAnims(this.player);
  }

  update() {
    this.player.update();
  }

  createPlayerAnims(player) {
    this.tweens.add({
      targets: player,
      angle: 360,
      duration: 450,
      ease: Phaser.Math.Easing.Linear,
      loop: 3,
    });

    this.tweens.add({
      targets: player,
      scale: 0.8,
      duration: 2000,
      ease: Phaser.Math.Easing.Linear,
    });
  }
}

export default GameScene;
