import Phaser from 'phaser';

import CONFIG from '../../config/game';

/**
 * Game input manager
 * @class InputManager
 */
class InputManager {
  /**
   * InputManager
   * @static
   */
  static CONFIG = CONFIG.SCENES.GAME;

  /**
   * Creates an instance of InputManager
   * @param {Phaser.Scene} scene - The Scene to which this InputManager belongs
   */
  constructor(scene) {
    this.scene = scene;

    this.init();
    this.initEventHandlers();
  }

  /**
   * Init
   */
  init() {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.enterKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  /**
   * Init event handlers
   */
  initEventHandlers() {
    this.scene.events.on(CONFIG.EVENTS.GAME_OVER, this.onGameOver, this);
  }

  /**
   * Update inputManager
   */
  update() {
    const { scene } = this;

    if (scene.isInitialStart) {
      if (this.isUpKeyPressed) {
        scene.events.emit(CONFIG.EVENTS.GAME_START);
      }
      return;
    }

    if (!scene.isPlaying) {
      if (this.isEnterKeyJustUp) {
        scene.events.emit(CONFIG.EVENTS.GAME_RESTART);
      }

      if (scene.readyToRestart) {
        if (this.isUpKeyJustUp) {
          scene.events.emit(CONFIG.EVENTS.GAME_RESTART);
        }
      }
    }
  }

  /**
   * Handle gameover
   */
  onGameOver() {
    const { scene } = this;

    scene.time.delayedCall(InputManager.CONFIG.RESTART.COOLDOWN, () => {
      scene.input.keyboard.resetKeys();

      if (!scene.isPlaying) {
        scene.readyToRestart = true;
      }
    });
  }

  /**
   * Check if up key is pressed
   * @readonly
   * @returns {boolean}
   */
  get isUpKeyPressed() {
    const { activePointer } = this.scene.input;

    return (
      this.cursors.up.isDown ||
      this.cursors.space.isDown ||
      (activePointer.isDown && activePointer.wasTouch)
    );
  }

  /**
   * Check if up key is just up
   * @readonly
   * @returns {boolean}
   */
  get isUpKeyJustUp() {
    return (
      Phaser.Input.Keyboard.JustUp(this.cursors.up) ||
      Phaser.Input.Keyboard.JustUp(this.cursors.space)
    );
  }

  /**
   * Check if enter key is just up
   * @readonly
   * @returns {boolean}
   */
  get isEnterKeyJustUp() {
    return Phaser.Input.Keyboard.JustUp(this.enterKey);
  }
}

export default InputManager;
