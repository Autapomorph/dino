import Phaser from 'phaser';

import CONFIG from '../../../config/game';
import BaseScorePanel from './BaseScorePanel';

/**
 * High score panel
 * @class HighScorePanel
 * @extends {BaseScorePanel}
 */
class HighScorePanel extends BaseScorePanel {
  static CONFIG = CONFIG.SCENES.GAME.GAME.HIGH_SCORE;

  /**
   * Creates an instance of HighScorePanel
   * @param {Phaser.Scene} scene - The Scene to which this InputManager belongs
   * @param {boolean} [disableReset=false] - Is resetting disabled
   * @override
   */
  constructor(scene, disableReset = false) {
    super(scene);

    this.scene = scene;
    this.defaultString = 'HI ';

    // Register event handlers
    this.scene.events.on(CONFIG.EVENTS.HIGH_SCORE_FETCH.SUCCESS, this.onFetchScore, this);
    this.scene.events.on(CONFIG.EVENTS.HIGH_SCORE_SAVE.SUCCESS, this.onSaveScore, this);
    if (!disableReset) {
      this.scoreText.on('pointerdown', this.onClick, this);
    }
  }

  /**
   * Init variables
   * @override
   */
  initVars() {
    super.initVars();
    this.defaultString = 'HI ';
  }

  /**
   * Create {Phaser.GameObjects. BitmapText} `scoreText`
   * @override
   */
  initText() {
    const { scene } = this;

    this.scoreText = scene.add
      .bitmapText(0, 0, 'joystix', '', 32)
      .setTintFill(0x757575)
      .setOrigin(1, 0)
      .setDepth(9999);
  }

  /**
   * Create score text flash tween
   * @returns {Phaser.Tweens.Tween} Created Tween object
   * @override
   */
  createFlashTween() {
    const { DURATION, ITERATIONS } = HighScorePanel.CONFIG.GAMEOVER.FLASH;
    const onStart = () => this.scoreText.clearTint();
    const onComplete = () => this.scoreText.setTintFill(0x757575);

    return super.createFlashTween(DURATION, ITERATIONS, onStart, onComplete);
  }

  /**
   * Handle high score success fetch
   * @param {number} highScore - Fetched high score
   */
  onFetchScore(highScore) {
    this.setScore(highScore);
  }

  /**
   * Handle high score success save
   * @param {number} highScore - Saved high score
   */
  onSaveScore(highScore) {
    this.setScore(highScore);
  }

  /**
   * Handle click
   */
  onClick() {
    if (!this.isFlashing) {
      this.flashScore();
    } else {
      this.reset();
      this.scoreText.disableInteractive();
      this.scene.events.emit(CONFIG.EVENTS.HIGH_SCORE_UPDATE, 0);
    }
  }

  /**
   * Handle game restart
   * @override
   */
  onRestart() {
    this.reset();
    this.scoreText.disableInteractive();
    super.onRestart();
  }

  /**
   * Handle gameover
   * @override
   */
  onGameOver() {
    super.onGameOver();
    const { width, height } = this.scoreText;
    this.scoreText.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(0, 0, width, height),
    });

    // uncomment this line to debug interactive area
    // this.scene.input.enableDebug(this.scoreText, 0x00ff00);
  }
}

export default HighScorePanel;
