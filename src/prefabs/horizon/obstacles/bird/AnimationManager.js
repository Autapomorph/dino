import CONFIG from '../../../../config/game';

/**
 * Bird animation manager
 * @class AnimationManager
 */
class AnimationManager {
  static CONFIG = CONFIG.PREFABS.OBSTACLES.BIRD;

  /**
   * Creates an instance of AnimationManager
   * @param {Bird} bird - The Bird to which this AnimationManager belongs
   */
  constructor(bird) {
    this.bird = bird;

    // Init animation
    const flyFrames = bird.scene.anims.generateFrameNames('dino', {
      frames: AnimationManager.CONFIG.FRAMES.FLYING,
    });
    bird.scene.anims.create({ key: 'fly', frames: flyFrames, frameRate: 6, repeat: -1 });

    // Register event handlers
    bird.on('animationstart', this.resizeBodyOnAnim, this);
    bird.on('animationupdate', this.resizeBodyOnAnim, this);
  }

  /**
   * Update anims
   */
  update() {
    this.bird.anims.play('fly', true);
  }

  /**
   * Stop anims
   */
  stop() {
    this.bird.anims.stop();
  }

  /**
   * Resize body on animation events
   * @param {Phaser.Animations.Animation} anim
   * @param {Phaser.Animations.AnimationFrame} frame
   */
  resizeBodyOnAnim(anim, frame) {
    const { body } = this.bird;
    const { name } = frame.frame;

    const bodyZoneWidth = 76;
    const bodyZoneHeight = 44;
    const bodyZoneXOffset = 12;
    const bodyZoneYOffset = 12;

    // Resize body to match frame dimensions
    if (name === AnimationManager.CONFIG.FRAMES.FLYING[0]) {
      const frameYOffset = 12;
      body.setSize(bodyZoneWidth, bodyZoneHeight);
      body.setOffset(bodyZoneXOffset, frameYOffset + bodyZoneYOffset);
    } else if (name === AnimationManager.CONFIG.FRAMES.FLYING[1]) {
      body.setSize(bodyZoneWidth, bodyZoneHeight);
      body.setOffset(bodyZoneXOffset, bodyZoneYOffset);
    }
  }
}

export default AnimationManager;
