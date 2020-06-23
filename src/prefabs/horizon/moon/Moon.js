import Phaser from 'phaser';

import CONFIG from '../../../config/game';

/**
 * Moon
 * @class Moon
 * @extends {Phaser.GameObjects.Image}
 */
class Moon extends Phaser.GameObjects.Image {
  static CONFIG = CONFIG.PREFABS.MOON;

  /**
   *Creates an instance of Moon
   * @param {Phaser.Scene} scene - The Scene to which this Moon belongs
   * @param {number} x - The horizontal position of this Moon in the world
   * @param {number} y - The vertical position of this Moon in the world
   * @param {Phaser.Animations.AnimationFrame} [frame=Moon.CONFIG.FRAMES[0]] - The frame to display this Moon phase
   */
  constructor(scene, x, y, frame = Moon.CONFIG.FRAMES[0]) {
    super(scene, x, y, 'dino', frame);

    // Current moon phase
    this.phase = 0;

    // Init image
    this.setOrigin(0, 0);
    this.setDepth(200);

    this.scene.add.existing(this);
  }

  /**
   * Update moon
   * @param {number} speed - Current game speed
   */
  update(speed) {
    this.move(speed);
  }

  /**
   * Move moon
   * @param {number} speed - Current game speed
   */
  move(speed) {
    this.x -= speed;
  }

  /**
   * Set moon phase
   * @param {number} phase - Moon phase to be set
   */
  setPhase(phase) {
    if (phase >= Moon.CONFIG.FRAMES.length) {
      this.phase = 0;
    } else {
      this.phase = phase;
    }

    this.setFrame(Moon.CONFIG.FRAMES[this.phase]);
  }

  /**
   * Increment moon phase
   */
  nextPhase() {
    this.setPhase(this.phase + 1);
  }

  /**
   * Reset moon
   */
  reset() {
    this.setPhase(0);
  }
}

export default Moon;
