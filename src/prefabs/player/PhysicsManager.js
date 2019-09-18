import CONFIG from '../../config/game';

/**
 * PhysicsManager
 * @class PhysicsManager
 */
class PhysicsManager {
  static CONFIG = CONFIG.PREFABS.PLAYER;

  /**
   * Creates an instance of PhysicsManager
   * @param {Player} player - The Player to which this PhysicsManager belongs
   */
  constructor(player) {
    this.player = player;
    this.scene = player.scene;

    this.init();
  }

  /**
   * Init
   */
  init() {
    const { scene, player } = this;

    scene.physics.world.enable(player);
    player.setCollideWorldBounds(true);
    player.setGravityY(PhysicsManager.CONFIG.GRAVITY.Y);
    player.setAccelerationY(PhysicsManager.CONFIG.JUMP.ACCELERATION);
  }

  /**
   * Check if player is on floor
   * @readonly
   * @returns {boolean}
   */
  get isOnFloor() {
    return this.player.body.onFloor();
  }

  /**
   * Handle player jump
   */
  jump() {
    this.player.setVelocityY(PhysicsManager.CONFIG.JUMP.VELOCITY.Y);
  }

  /**
   * Reset physicsManager
   */
  reset() {
    this.player.setVelocityY(0);
  }
}

export default PhysicsManager;
