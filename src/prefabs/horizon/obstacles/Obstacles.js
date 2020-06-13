import Phaser from 'phaser';

import CONFIG from '../../../config/game';
import HorizonItems from '../HorizonItems';
import Cactus from './cactus/Cactus';
import Bird from './bird/Bird';

/**
 * Obstacles group
 * @class Obstacles
 * @extends {HorizonItems}
 */
class Obstacles extends HorizonItems {
  static CONFIG = {
    TYPES: CONFIG.SCENES.GAME.GAME.OBSTACLES.TYPES,
    MAX_DUPLICATION: CONFIG.SCENES.GAME.GAME.OBSTACLES.SPAWN.MAX_DUPLICATION,
    GAP: CONFIG.SCENES.GAME.GAME.OBSTACLES.GAP,
  };

  /**
   * Creates an instance of Obstacles
   * @param {Phaser.Scene} scene - The Scene to which this Obstacles group belongs
   * @override
   */
  constructor(scene) {
    super(scene);

    this.initVars();
  }

  /**
   * Init variables
   */
  initVars() {
    this.obstacleHistory = [];
  }

  /**
   * Check if next obstacle is duplicate
   * @param {Obstacle} nextObstacle - next obstacle object
   * @param {number} maxDuplication - max duplication count
   * @returns {boolean}
   */
  checkDuplication(nextObstacle, maxDuplication) {
    if (this.obstacleHistory.some(obstacle => obstacle.FRAME !== nextObstacle.FRAME)) {
      return false;
    }

    return this.obstacleHistory.length >= maxDuplication;
  }

  /**
   * Spawn obstacle
   * @param {number} speed - Current game speed
   * @param {boolean} isMobile - Whether game is running in mobile mode
   * @override
   */
  spawnItem(speed, isMobile) {
    const { MAX_DUPLICATION } = Obstacles.CONFIG;
    const { BIRD, CACTUS } = Obstacles.CONFIG.TYPES;
    let obstacleType;

    // only allow bird spawn if we have enough speed
    if (speed > BIRD.SPAWN.SPEED.MIN) {
      obstacleType = Phaser.Math.RND.pick([BIRD, CACTUS.SMALL, CACTUS.LARGE]);
    } else {
      obstacleType = Phaser.Math.RND.pick([CACTUS.SMALL, CACTUS.LARGE]);
    }

    if (this.checkDuplication(obstacleType, MAX_DUPLICATION)) {
      this.spawnItem(speed, isMobile);
      return;
    }

    this.obstacleHistory.push(obstacleType);
    if (this.obstacleHistory.length > MAX_DUPLICATION) {
      this.obstacleHistory = this.obstacleHistory.slice(-MAX_DUPLICATION);
    }

    if (obstacleType === BIRD) {
      this.spawnBird(speed, isMobile);
    } else {
      let cactusSize = 1;

      const cactusSizingSpeed = !isMobile
        ? obstacleType.SIZING.SPEED.MIN
        : obstacleType.SIZING.SPEED.MIN_MOBILE;
      if (speed > cactusSizingSpeed) {
        cactusSize = Phaser.Math.RND.pick(CONFIG.PREFABS.OBSTACLES.CACTUS.SIZES);
      }

      this.spawnCactus(speed, isMobile, `${obstacleType.FRAME}-${cactusSize}`);
    }
  }

  /**
   * Spawn bird obstacle
   * @param {number} speed - Current game speed
   * @param {boolean} isMobile - Whether game is running in mobile mode
   */
  spawnBird(speed, isMobile) {
    const { width } = this.scene.scale.gameSize;
    const { BIRD } = CONFIG.PREFABS.OBSTACLES;

    const y = !isMobile
      ? Phaser.Math.RND.pick(BIRD.POS.Y)
      : Phaser.Math.RND.pick(BIRD.POS.Y_MOBILE);

    const newObstacle = new Bird(this.scene, width, y);
    this.add(newObstacle);

    const gap = this.getGap(speed, BIRD.GAP.MIN, newObstacle.width);
    newObstacle.setGap(gap);
  }

  /**
   * Spawn cactus obstacle
   * @param {number} speed - Current game speed
   * @param {boolean} isMobile - Whether game is running in mobile mode
   * @param {Phaser.Animations.AnimationFrame} frame - Frame to display cactus obstacle
   */
  spawnCactus(speed, isMobile, frame) {
    const { width } = this.scene.scale.gameSize;
    const { CACTUS } = CONFIG.PREFABS.OBSTACLES;

    const newObstacle = new Cactus(this.scene, width, CACTUS.POS.Y, frame);
    this.add(newObstacle);

    const gap = this.getGap(speed, CACTUS.GAP.MIN, newObstacle.width);
    newObstacle.setGap(gap);
  }

  /**
   * Get random gap
   * @param {number} speed - Current game speed
   * @param {number} minGap - Minimum gap
   * @param {number} width - Obstacle width
   * @returns {number} - random gap
   */
  // eslint-disable-next-line class-methods-use-this
  getGap(speed, minGap, width) {
    const { MAX_MULIPLIER } = Obstacles.CONFIG.GAP;

    // min gap is based on speed
    const min = Math.round(width * speed + minGap);
    const max = Math.round(min * MAX_MULIPLIER);

    return Phaser.Math.RND.between(min, max);
  }

  reset() {
    super.reset();
    this.initVars();
  }
}

export default Obstacles;
