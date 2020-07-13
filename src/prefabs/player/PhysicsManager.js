import CONFIG from '../../config/game';

/**
 * Player physics manager
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

    // Init physics
    this.scene.physics.world.enable(player);
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

  /**
   * Resize body to match frame dimensions
   * @param {Phaser.Textures.Frame} frame - Current Player texture frame
   */
  resizeBodyToMatchFrame(frame) {
    const { body } = this.player;
    const { name, width, height } = frame;

    // Resize body to reduce player collisions
    if (
      name === PhysicsManager.CONFIG.FRAMES.JUMPING ||
      PhysicsManager.CONFIG.FRAMES.IDLING.includes(name) ||
      PhysicsManager.CONFIG.FRAMES.RUNNING.includes(name)
    ) {
      const headZone = 15;
      const tailZone = 25;
      const topZone = 4;
      body.setSize(width - headZone - tailZone, height - topZone);
      body.setOffset(tailZone, topZone);
    } else if (PhysicsManager.CONFIG.FRAMES.DUCKING.includes(name)) {
      const headZone = 35;
      const tailZone = 25;
      const topZone = 6;
      body.setSize(width - headZone - tailZone, height - topZone);
      body.setOffset(tailZone, topZone);
    }
  }
}

export default PhysicsManager;
