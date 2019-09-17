import Phaser from 'phaser';

import CONFIG from '../../../../config/game';
import Obstacle from '../Obstacle';
import AnimationManager from './AnimationManager';

/**
 * Bird obstacle
 * @class Bird
 * @extends {Obstacle}
 */
class Bird extends Obstacle {
  static CONFIG = CONFIG.PREFABS.OBSTACLES.BIRD;

  /**
   * Creates an instance of Bird
   * @param {Phaser.Scene} scene - The Scene to which this Bird belongs
   * @param {number} x - The horizontal position of this Bird in the world
   * @param {number} y - The vertical position of this Bird in the world
   * @override
   */
  constructor(scene, x, y) {
    super(scene, x, y, Bird.CONFIG.FRAMES.INITIAL);
  }

  /**
   * Init variables
   * @override
   */
  initVars() {
    super.initVars();
    this.animationManager = new AnimationManager(this);
    this.speedOffset = Phaser.Math.RND.pick(Bird.CONFIG.SPEED.OFFSET);
  }

  /**
   * Update bird
   * @param {number} speed - Current game speed
   * @override
   */
  update(speed) {
    this.animationManager.update();
    super.update(speed);
  }

  /**
   * Move bird
   * @param {number} speed - Current game speed
   * @override
   */
  move(speed) {
    this.x -= speed + this.speedOffset;
  }

  /**
   * Freeze bird
   * @override
   */
  freeze() {
    super.freeze();
    this.animationManager.stop();
  }
}

export default Bird;
