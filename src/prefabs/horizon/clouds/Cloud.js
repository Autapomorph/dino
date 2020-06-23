import Phaser from 'phaser';

/**
 * Cloud
 * @class Cloud
 * @extends {Phaser.GameObjects.Image}
 */
class Cloud extends Phaser.GameObjects.Image {
  /**
   * Creates an instance of Cloud
   * @param {Phaser.Scene} scene - The Scene to which this Cloud belongs
   * @param {number} x - The horizontal position of this Cloud in the world
   * @param {number} y - The vertical position of this Cloud in the world
   */
  constructor(scene, x, y) {
    super(scene, x, y, 'dino', 'cloud');

    // Gap before next Cloud
    this.gap = 0;

    // Init image
    this.setOrigin(0, 0);
    this.setDepth(300);

    this.scene.add.existing(this);
  }

  /**
   * Update cloud
   * @param {number} speed - Current game speed
   */
  update(speed) {
    this.move(speed);

    if (this.x + this.width < 0) {
      this.setVisible(false);
    }
  }

  /**
   * Move cloud
   * @param {number} speed - Current game speed
   */
  move(speed) {
    this.x -= speed;
  }

  /**
   * Set cloud gap
   */
  setGap(gap) {
    this.gap = gap;
  }

  /**
   * Kill cloud
   */
  die() {
    this.destroy();
  }
}

export default Cloud;
