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
   * Enable physics
   */
  enable() {
    this.scene.physics.world.enable(this.player);
  }

  /**
   * Disable physics
   */
  disable() {
    this.scene.physics.world.disable(this.player);
  }

  /**
   * Handle player jump
   */
  jump() {
    this.player.setVelocityY(PhysicsManager.CONFIG.JUMP.VELOCITY.Y);
  }

  /**
   * Handle player dead
   */
  die() {
    this.player.setVelocityY(0);
    this.disable();
  }

  /**
   * Reset physicsManager
   */
  reset() {
    this.enable();
  }
}

export default PhysicsManager;
