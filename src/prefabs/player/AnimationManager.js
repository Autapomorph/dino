import Phaser from 'phaser';

import CONFIG from '../../config/game';

/**
 * Player animation manager
 * @class AnimationManager
 */
class AnimationManager {
  static CONFIG = CONFIG.PREFABS.PLAYER;

  /**
   * Creates an instance of AnimationManager
   * @param {Player} player - The Player to which this AnimationManager belongs
   */
  constructor(player) {
    this.player = player;

    this.initAnimations();

    // Register event handlers
    player.on('animationstart', this.onAnimationEvents, this);
    player.on('animationupdate', this.onAnimationEvents, this);
    player.on('animationcomplete', this.onAnimationEvents, this);
    player.on('animationstart-idle', this.randomizeidleAnimation, this);
    player.on('animationrepeat-idle', this.randomizeidleAnimation, this);
  }

  /**
   * Init animations
   */
  initAnimations() {
    const { scene } = this.player;

    const idleFrames = scene.anims.generateFrameNames('dino', {
      frames: AnimationManager.CONFIG.FRAMES.IDLING,
    });
    scene.anims.create({
      key: 'idle',
      frames: idleFrames,
      frameRate: 1,
      repeat: -1,
    });

    const runFrames = scene.anims.generateFrameNames('dino', {
      frames: AnimationManager.CONFIG.FRAMES.RUNNING,
    });
    scene.anims.create({ key: 'run', frames: runFrames, frameRate: 10, repeat: -1 });

    const duckFrames = scene.anims.generateFrameNames('dino', {
      frames: AnimationManager.CONFIG.FRAMES.DUCKING,
    });
    scene.anims.create({ key: 'duck', frames: duckFrames, frameRate: 10, repeat: -1 });
  }

  /**
   * Set animation based on player state
   */
  update() {
    const { STATES, FRAMES } = AnimationManager.CONFIG;
    const { player } = this;

    switch (player.state) {
      case STATES.IDLING:
        player.anims.play('idle', true);
        break;
      case STATES.RUNNING:
        player.anims.play('run', true);
        break;
      case STATES.DUCKING:
        player.anims.play('duck', true);
        break;
      case STATES.DEAD:
        player.anims.stop();
        player.setFrame(FRAMES.DEAD);
        break;
      case STATES.JUMPING:
      default:
        player.anims.stop();
        player.setFrame(FRAMES.JUMPING);
        player.resizeBodyToMatchFrame(player.frame);
        break;
    }
  }

  /**
   * Handle animation events
   * @param {Phaser.Animations.Animation} animation - Animation that triggered the event
   * @param {Phaser.Animations.AnimationFrame} frame - Current Animation Frame
   */
  onAnimationEvents(animation, frame) {
    this.player.resizeBodyToMatchFrame(frame.frame);
  }

  /**
   * Randomize next idle animation blink effect duration
   * @param {Phaser.Animations.Animation} idleAnimation - Idle animation
   */
  randomizeidleAnimation = idleAnimation => {
    const { BLINK } = AnimationManager.CONFIG;
    const eyeFrame = idleAnimation.getFrameAt(0);
    const blinkFrame = idleAnimation.getFrameAt(1);
    eyeFrame.duration = Phaser.Math.RND.between(0, BLINK.DELAY);
    blinkFrame.duration = -1 * idleAnimation.msPerFrame + BLINK.DURATION;
  };
}

export default AnimationManager;
