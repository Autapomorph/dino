import Phaser from 'phaser';

import CONFIG from '../../config/game';
import ScorePanel from './ScorePanel';

/**
 * HighScorePanel
 * @class HighScorePanel
 * @extends {ScorePanel}
 */
class HighScorePanel extends ScorePanel {
  static CONFIG = CONFIG.SCENES.GAME.GAME.HIGH_SCORE;

  /**
   * Creates an instance of HighScorePanel
   * @param {Phaser.Scene} scene - The Scene to which this InputManager belongs
   * @param {number} [highScore=0] - High score
   * @override
   */
  constructor(scene, highScore = 0) {
    super(scene);

    this.scene = scene;
    this.highScore = highScore;
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

    const { x, y, width, height } = this.scoreText.getTextBounds().global;
    this.zone = scene.add.zone(x, y, width, height).setOrigin(0, 0);
  }

  /**
   * Init event handlers
   * @override
   */
  initEventHandlers() {
    super.initEventHandlers();
    this.zone.on('pointerdown', this.onClick, this);
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

    return super.createFlashTween(DURATION, ITERATIONS * 2, onStart, onComplete);
  }

  /**
   * Update high score panel
   * @param {number} score - Current game score
   * @override
   */
  update(score) {
    this.currentScore = score;
  }

  /**
   * Set score
   * @param {number} score - Current game score
   * @override
   */
  setScore(score) {
    super.setScore(score);
    this.highScore = score;
  }

  /**
   * Handle click
   */
  onClick() {
    if (!this.isFlashing) {
      this.flashScore();
    } else {
      this.reset();
      this.zone.disableInteractive();
      this.scene.events.emit(CONFIG.EVENTS.HIGH_SCORE_RESET);
    }
  }

  /**
   * Handle game start
   * @override
   */
  onStart() {
    this.setScore(this.highScore);
  }

  /**
   * Handle game restart
   * @override
   */
  onRestart() {
    this.reset();
    this.zone.disableInteractive();
    super.onRestart();
  }

  /**
   * Handle gameover
   * @override
   */
  onGameOver() {
    super.onGameOver();

    if (this.currentScore > this.highScore) {
      this.scene.events.emit(CONFIG.EVENTS.HIGH_SCORE_RECORD, this.currentScore);
    }

    this.setScore(Math.max(this.highScore, this.currentScore));

    const { x, y, width, height } = this.scoreText.getTextBounds().global;
    this.zone.setPosition(x, y);
    this.zone.setSize(width, height);
    this.zone.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(0, 0, this.zone.width, this.zone.height),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: false,
    });
  }
}

export default HighScorePanel;
