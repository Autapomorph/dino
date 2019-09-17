import CONFIG from '../../config/game';

import Ground from './ground/Ground';
import Obstacles from './obstacles/Obstacles';
import Clouds from './clouds/Clouds';
import NightMode from './NightMode';

/**
 * Horizon
 * @class Horizon
 */
class Horizon {
  static CONFIG = {
    OBSTACLES: CONFIG.SCENES.GAME.GAME.OBSTACLES,
    CLOUDS: CONFIG.PREFABS.CLOUD,
  };

  /**
   * Creates an instance of Horizon
   * @param {Phaser.Scene} scene - The Scene to which this Horizon belongs
   */
  constructor(scene) {
    this.scene = scene;

    this.init();
  }

  /**
   * Init
   */
  init() {
    this.initVars();
    this.initEventHandlers();
  }

  /**
   * Init variables
   */
  initVars() {
    const { scene } = this;

    this.ground = new Ground(scene);
    this.obstacles = new Obstacles(scene);
    this.clouds = new Clouds(scene);
    this.nightMode = new NightMode(scene);
  }

  /**
   * Init event handlers
   */
  initEventHandlers() {
    this.scene.events.on(CONFIG.EVENTS.GAME_INTRO_COMPLETE, this.start, this);
    this.scene.events.on(CONFIG.EVENTS.GAME_RESTART, this.reset, this);
  }

  /**
   * Set 1st horizon state
   */
  start() {
    const { speed } = this.scene;

    this.spawnInitialCloud(speed);
    this.spawnInitialObstacle(speed);
  }

  /**
   * Spawn 1st cloud
   * @param {number} speed - Current game speed
   */
  spawnInitialCloud(speed) {
    this.clouds.spawnItem(speed);
  }

  /**
   * Spawn 1st obstacle
   * @param {number} speed - Current game speed
   * @param {boolean} isMobile - Whether game is running in mobile mode
   */
  spawnInitialObstacle(speed, isMobile) {
    const obstacleSpawnDelay = Horizon.CONFIG.OBSTACLES.SPAWN.DELAY;

    this.scene.time.delayedCall(obstacleSpawnDelay, () =>
      this.obstacles.spawnItem(speed, isMobile),
    );
  }

  /**
   * Update horizon
   * @param {number} speed - Current game speed
   * @param {boolean} isMobile - Whether game is running in mobile mode
   */
  update(speed, isMobile) {
    this.ground.update(speed);
    this.obstacles.update(speed, isMobile);
    this.clouds.update(Horizon.CONFIG.CLOUDS.SPEED);
    this.nightMode.update();
  }

  /**
   * Reset horizon
   */
  reset() {
    const { speed } = this.scene;

    this.ground.reset();
    this.obstacles.reset();
    this.nightMode.reset();
    this.spawnInitialObstacle(speed);
  }
}

export default Horizon;
