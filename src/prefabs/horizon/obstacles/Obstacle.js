import Phaser from 'phaser';

import CONFIG from '../../../config/game';

/**
 * Obstacle
 * @class Obstacle
 * @extends {Phaser.Physics.Arcade.Sprite}
 */
class Obstacle extends Phaser.Physics.Arcade.Sprite {
  /**
   * Creates an instance of Obstacle
   * @param {Phaser.Scene} scene - The Scene to which this Obstacle belongs
   * @param {number} x - The horizontal position of this Obstacle in the world
   * @param {number} y - The vertical position of this Obstacle in the world
   * @param {string} frame - The frame from the Texture this Obstacle is rendering with
   */
  constructor(scene, x, y, frame) {
    super(scene, x, y, 'dino', frame);

    // Gap before next Obstacle
    this.gap = 0;

    // Init image
    this.setOrigin(0, 1);
    this.setDepth(900);

    // Register event handlers
    this.scene.events.on(CONFIG.EVENTS.GAME_OVER, this.freeze, this);

    this.scene.add.existing(this);
  }

  /**
   * Update obstacle
   * @param {number} speed - Current game speed
   */
  update(speed) {
    this.move(speed);

    if (this.x + this.width < 0) {
      this.setVisible(false);
    }
  }

  /**
   * Move obstacle
   * @param {number} speed - Current game speed
   */
  move(speed) {
    this.x -= speed;
  }

  /**
   * Set obstacle gap
   */
  setGap(gap) {
    this.gap = gap;
  }

  /**
   * Freeze obstacle
   */
  freeze() {
    this.scene.events.off(CONFIG.EVENTS.GAME_OVER, this.freeze);
  }

  /**
   * Kill obstacle
   */
  die() {
    this.freeze();
    this.destroy();
  }

  /**
   * Reset obstacle
   */
  reset() {
    this.die();
  }
}

export default Obstacle;
