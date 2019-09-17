import Phaser from 'phaser';

class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture = 'player', frame) {
    super(scene, x, y, texture, frame);

    this.init();
    this.scene.add.existing(this);
  }

  init() {
    // image
    this.setScale(0.1, 0.1);

    // physics
    this.scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    this.body.setMaxVelocity(500);
    this.body.setAngularDrag(15);
    this.body.maxAngular = 100;
    this.body.setBounceY(1);

    // input
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.body.onFloor()) {
      const camera = this.scene.cameras.main;
      camera.shakeEffect.reset();
      camera.shake(1000, 0.01);
    }

    this.body.setAngularAcceleration(0);
    if (this.cursors.left.isDown) {
      this.body.setAngularAcceleration(-100);
    } else if (this.cursors.right.isDown) {
      this.body.setAngularAcceleration(100);
    }
  }
}

export default Player;
