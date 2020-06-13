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

    this.init();
    this.initEventHandlers();
  }

  init() {
    const { player } = this;
    const { scene } = player;

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

  initEventHandlers() {
    const { player } = this;

    player.on('animationstart', this.resizeBodyOnAnim, this);
    player.on('animationupdate', this.resizeBodyOnAnim, this);
    player.on('animationcomplete', this.resizeBodyOnAnim, this);

    player.on('animationstart-idle', this.calcIdleAnim, this);
    player.on('animationrepeat-idle', this.calcIdleAnim, this);
  }

  /**
   * Set animation based on player state
   */
  update() {
    const { STATES, FRAMES } = AnimationManager.CONFIG;
    const { player } = this;

    switch (player.state) {
      case STATES.IDLING: {
        player.anims.play('idle', true);
        break;
      }
      case STATES.RUNNING: {
        player.anims.play('run', true);
        break;
      }
      case STATES.DUCKING: {
        player.anims.play('duck', true);
        break;
      }
      case STATES.DEAD: {
        player.anims.stop();
        player.setFrame(FRAMES.DEAD);
        break;
      }
      case STATES.JUMPING:
      default: {
        player.anims.stop();
        player.setFrame(FRAMES.JUMPING);
        break;
      }
    }
  }

  /**
   * Calculate next idle animation blink effect duration
   * @param {Phaser.Animations.Animation} idleAnim
   */
  calcIdleAnim = idleAnim => {
    const { BLINK } = AnimationManager.CONFIG;

    const eyeFrame = idleAnim.getFrameAt(0);
    const blinkFrame = idleAnim.getFrameAt(1);

    // add random duration to eyeFrame
    eyeFrame.duration = Phaser.Math.RND.between(0, BLINK.DELAY);
    // set blinkFrame to BLINK_DURATION in ms
    blinkFrame.duration = -1 * idleAnim.msPerFrame + BLINK.DURATION;
  };

  /**
   * Resize body on animation events
   * @param {Phaser.Animations.Animation} anim
   * @param {Phaser.Animations.AnimationFrame} frame
   */
  resizeBodyOnAnim(anim, frame) {
    const { body } = this.player;
    const { name, width, height } = frame.frame;

    // resize body to reduce player collisions
    // jumping, idling & running anim frames have equal dimensions
    if (
      name === AnimationManager.CONFIG.FRAMES.JUMPING ||
      AnimationManager.CONFIG.FRAMES.IDLING.includes(name) ||
      AnimationManager.CONFIG.FRAMES.RUNNING.includes(name)
    ) {
      const headZone = 15;
      const tailZone = 25;
      const topZone = 4;

      body.setSize(width - headZone - tailZone, height - topZone);
      body.setOffset(tailZone, topZone);
    } else if (AnimationManager.CONFIG.FRAMES.DUCKING.includes(name)) {
      const headZone = 35;
      const tailZone = 25;
      const topZone = 6;

      body.setSize(width - headZone - tailZone, height - topZone);
      body.setOffset(tailZone, topZone);
    }
  }
}

export default AnimationManager;
