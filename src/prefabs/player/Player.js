import Phaser from 'phaser';

import CONFIG from '../../config/game';
import PhysicsManager from './PhysicsManager';
import InputManager from './InputManager';
import AnimationManager from './AnimationManager';

/**
 * Player
 * @class Player
 * @extends {Phaser.Physics.Arcade.Sprite}
 */
class Player extends Phaser.Physics.Arcade.Sprite {
  static CONFIG = CONFIG.PREFABS.PLAYER;

  /**
   * Creates an instance of Player
   * @param {Phaser.Scene} scene - The Scene to which this Player belongs
   * @param {number} [x=Player.CONFIG.POS.INITIAL_X] - The horizontal position of this Player in the world
   * @param {number} [y=Player.CONFIG.POS.Y] - The vertical position of this Player in the world
   */
  constructor(scene, x = Player.CONFIG.POS.INITIAL_X, y = Player.CONFIG.POS.Y) {
    super(scene, x, y, 'dino', Player.CONFIG.FRAMES.INITIAL);

    this.init();
    this.start();
    this.scene.add.existing(this);
  }

  /**
   * Init
   */
  init() {
    this.initVars();
    this.initImage();
    this.initEventHandlers();
  }

  /**
   * Init variables
   */
  initVars() {
    this.physicsManager = new PhysicsManager(this);
    this.inputManager = new InputManager(this);
    this.animationManager = new AnimationManager(this);

    this.readyToIntro = false;
  }

  /**
   * Init event handlers
   */
  initEventHandlers() {
    this.scene.events.on(CONFIG.EVENTS.GAME_INTRO_START, this.intro, this);
    this.scene.events.on(CONFIG.EVENTS.GAME_OVER, this.die, this);
    this.scene.events.on(CONFIG.EVENTS.GAME_RESTART, this.reset, this);
  }

  /**
   * Init image
   */
  initImage() {
    this.setOrigin(0, 1);
    this.setDepth(1000);
  }

  /**
   * Set 1st player state
   */
  start() {
    this.idle();
    this.animationManager.update();
  }

  /**
   * Update player
   */
  update() {
    this.inputManager.update();
    this.animationManager.update();
  }

  /**
   * Handle game intro
   */
  intro() {
    this.scene.tweens.add({
      targets: this,
      duration: CONFIG.SCENES.GAME.INTRO.DURATION,
      x: Player.CONFIG.POS.X,
      onComplete: () => {
        this.scene.intro.complete();
      },
    });
  }

  /**
   * Set player idling
   */
  idle() {
    this.setState(Player.CONFIG.STATES.IDLING);
  }

  /**
   * Set player running
   */
  run() {
    this.setState(Player.CONFIG.STATES.RUNNING);

    if (this.readyToIntro && this.scene.intro.isWaiting) {
      this.scene.intro.start();
    }

    // when initial jump ends set readyToIntro to false
    this.readyToIntro = true;
  }

  /**
   * Set player ducking
   */
  duck() {
    this.setState(Player.CONFIG.STATES.DUCKING);
  }

  /**
   * Set player jumping
   */
  jump() {
    this.setState(Player.CONFIG.STATES.JUMPING);
    this.physicsManager.jump();

    if (!this.scene.intro.isWaiting) {
      this.scene.events.emit(CONFIG.EVENTS.PLAYER_ACTION);
    }
  }

  /**
   * Set player dead | Handle gameover
   */
  die() {
    this.setState(Player.CONFIG.STATES.DEAD);
    this.animationManager.update();
    this.physicsManager.reset();

    // set dead sprite pos to match run|jump sprite pos (substract 4px)
    this.setY(this.y - 4);
  }

  /**
   * Reset player | Handle game restart
   */
  reset() {
    this.setState(Player.CONFIG.STATES.IDLING);
    this.animationManager.update();
    this.setY(Player.CONFIG.POS.Y);
  }

  /**
   * Check if player is idling
   * @readonly
   * @returns {boolean}
   */
  get isIdling() {
    return this.state === Player.CONFIG.STATES.IDLING;
  }

  /**
   * Check if player is running
   * @readonly
   * @returns {boolean}
   */
  get isRunning() {
    return this.state === Player.CONFIG.STATES.RUNNING;
  }

  /**
   * Check if player is ducking
   * @readonly
   * @returns {boolean}
   */
  get isDucking() {
    return this.state === Player.CONFIG.STATES.DUCKING;
  }

  /**
   * Check if player is jumping
   * @readonly
   * @returns {boolean}
   */
  get isJumping() {
    return this.state === Player.CONFIG.STATES.JUMPING;
  }

  /**
   * Check if player is dead
   * @readonly
   * @returns {boolean}
   */
  get isDead() {
    return this.state === Player.CONFIG.STATES.DEAD;
  }

  /**
   * Check if player is on floor
   * @readonly
   * @returns {boolean}
   */
  get isOnFloor() {
    return this.physicsManager.isOnFloor;
  }

  /**
   * Set player state
   * @param {Player.state} state
   * @returns {Player}
   */
  setState(state) {
    if (Object.hasOwnProperty.call(Player.CONFIG.STATES, state)) {
      this.state = state;
      return this;
    }

    const possibleValuesString = Object.values(Player.CONFIG.STATES)
      .map(v => `'${v}'`)
      .join(', ');

    throw new Error(
      `Invalid Intro State\nPassed: '${state}'\nPossible values: ${possibleValuesString}`,
    );
  }
}

export default Player;
