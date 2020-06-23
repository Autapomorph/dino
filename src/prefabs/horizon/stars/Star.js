import Phaser from 'phaser';

import CONFIG from '../../../config/game';

/**
 * Star
 * @class Star
 * @extends {Phaser.GameObjects.Image}
 */
class Star extends Phaser.GameObjects.Image {
  static CONFIG = CONFIG.PREFABS.STAR;

  /**
   * Creates an instance of Star
   * @param {Phaser.Scene} scene - The Scene to which this Star belongs
   * @param {number} [x=Player.CONFIG.POS.INITIAL_X] - The horizontal position of this Star in the world
   * @param {number} [y=Player.CONFIG.POS.Y] - The vertical position of this Star in the world
   * @param {Phaser.Animations.AnimationFrame} [frame=Phaser.Math.RND.pick(Star.CONFIG.FRAMES)] - The frame to display this Star
   */
  constructor(scene, x, y, frame = Phaser.Math.RND.pick(Star.CONFIG.FRAMES)) {
    super(scene, x, y, 'dino', frame);

    // Init image
    this.setOrigin(0, 0);
    this.setDepth(100);

    this.scene.add.existing(this);
  }

  /**
   * Update star
   * @param {number} speed - Current game speed
   */
  update(speed) {
    this.move(speed);
  }

  /**
   * Move star
   * @param {number} speed - Current game speed
   */
  move(speed) {
    this.x -= speed;
  }
}

export default Star;
