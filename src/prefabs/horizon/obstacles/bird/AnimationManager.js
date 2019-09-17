import CONFIG from '../../../../config/game';

/**
 * Bird AnimationManager
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

    this.init();
    this.initEventHandlers();
  }

  init() {
    const { bird } = this;
    const { scene } = bird;

    const flyFrames = scene.anims.generateFrameNames('dino', {
      frames: AnimationManager.CONFIG.FRAMES.FLYING,
    });
    scene.anims.create({ key: 'fly', frames: flyFrames, frameRate: 6, repeat: -1 });
  }

  initEventHandlers() {
    const { bird } = this;

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

    // set body offset & size to match sprite pos & size
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
