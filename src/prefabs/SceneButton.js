import Phaser from 'phaser';

import BootScene from '../scenes/Boot';

class SceneButton extends Phaser.GameObjects.Container {
  constructor({ scene, nextScene, x, y, text, textures }) {
    super(scene);

    this.scene = scene;
    this.x = x;
    this.y = y;

    this.button = this.scene.add.sprite(0, 0, textures.default).setInteractive();
    this.text = this.scene.add.text(0, 0, text, { fontSize: '32px', fill: '#fff' });
    Phaser.Display.Align.In.Center(this.text, this.button);

    this.add(this.button);
    this.add(this.text);

    this.button.on('pointerdown', () => {
      this.scene.scene.start(BootScene.name, { scene: nextScene });
    });

    this.button.on('pointerover', () => {
      this.button.setTexture(textures.hover);
    });

    this.button.on('pointerout', () => {
      this.button.setTexture(textures.default);
    });

    this.scene.add.existing(this);
  }
}

export default SceneButton;
