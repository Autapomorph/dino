import Obstacle from '../Obstacle';

/**
 * Cactus obstacle
 * @class Cactus
 * @extends {Obstacle}
 */
class Cactus extends Obstacle {
  /**
   * Update cactus
   * @param {number} speed - Current game speed
   */
  update(speed) {
    super.update(speed);

    // reduce body size by excluding borders
    const borderWidth = 2;
    this.setBodySize(this.width - borderWidth * 2, this.height - borderWidth);
    this.body.setOffset(borderWidth, borderWidth);
  }
}

export default Cactus;
