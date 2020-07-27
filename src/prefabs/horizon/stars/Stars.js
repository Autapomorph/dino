import Phaser from 'phaser';

import CONFIG from '../../../config/game';
import Star from './Star';

/**
 * Stars Group
 * @class Stars
 * @extends {Phaser.GameObjects.Group}
 */
class Stars extends Phaser.GameObjects.Group {
  static CONFIG = CONFIG.PREFABS.STAR;

  /**
   * Creates an instance of Stars
   * @param {Phaser.Scene} scene - The Scene to which this Stars group belongs
   */
  constructor(scene) {
    super(scene);

    this.scene.add.existing(this);
  }

  /**
   * Update stars group
   * @param {number} speed - Current game speed
   */
  update(speed) {
    const { width } = this.scene.scale.gameSize;

    this.children.each(star => {
      star.update(speed);

      if (star.x + star.width < 0) {
        star.setPosition(width, this.getRandomYPos());
        star.setFrame(this.getRandomFrame());
      }
    });
  }

  /**
   * Spawn stars
   */
  spawnItems() {
    const { MAX_COUNT } = CONFIG.SCENES.GAME.NIGHTMODE.STARS;

    for (let i = this.getLength(); i < MAX_COUNT; i += 1) {
      this.add(new Star(this.scene));
    }

    this.shuffleItems();
  }

  /**
   * Shuffle stars
   */
  shuffleItems() {
    const { width } = this.scene.scale.gameSize;
    const { MAX_COUNT } = CONFIG.SCENES.GAME.NIGHTMODE.STARS;
    const xWidth = width / MAX_COUNT;

    this.children.each((star, i) => {
      const frame = this.getRandomFrame();
      const x = this.getRandomXPos(xWidth, i);
      const y = this.getRandomYPos();

      star.setPosition(x, y);
      star.setFrame(frame);
    });
  }

  /**
   * Get random star frame
   */
  // eslint-disable-next-line class-methods-use-this
  getRandomFrame() {
    return Phaser.Math.RND.pick(Stars.CONFIG.FRAMES);
  }

  /**
   * Get random star x position
   */
  // eslint-disable-next-line class-methods-use-this
  getRandomXPos(xWidth, i) {
    return Phaser.Math.RND.between(xWidth * i, xWidth * (i + 1));
  }

  /**
   * Get random star y position
   */
  // eslint-disable-next-line class-methods-use-this
  getRandomYPos() {
    const { MIN, MAX } = Stars.CONFIG.POS.Y;
    return Phaser.Math.RND.between(MIN, MAX);
  }

  /**
   * Reset stars group
   */
  reset() {
    this.clear(true, true);
  }
}

export default Stars;
