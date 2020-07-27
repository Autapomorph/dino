import CONFIG from '../../../config/game';

/**
 * Base score panel
 * @class BaseScorePanel
 */
class BaseScorePanel {
  static CONFIG = CONFIG.SCENES.GAME.GAME.SCORE;

  /**
   * Creates an instance of BaseScorePanel
   * @param {Phaser.Scene} scene - The Scene to which this Player belongs
   */
  constructor(scene) {
    this.scene = scene;

    this.init();
  }

  /**
   * Init
   */
  init() {
    this.initVars();
    this.initText();
    this.initEventHandlers();
  }

  /**
   * Init variables
   */
  initVars() {
    this.isFlashing = false;
    this.flashTween = this.createFlashTween();

    // set maxScore to 10^MAX_LENGTH - 1 e.g. MAX_LENGTH = 5 so maxScore = 10^5 - 1 = 99_999
    this.maxScoreLength = BaseScorePanel.CONFIG.MAX_LENGTH;
    this.maxScore = 10 ** (this.maxScoreLength - 1) - 1;

    this.defaultString = '';
  }

  /**
   * Create {Phaser.GameObjects. BitmapText} `scoreText`
   * @abstract
   * @throws Will throw an error if not implemented
   */
  // eslint-disable-next-line class-methods-use-this
  initText() {
    // create scoreText: BitmapText var here
    throw new Error('Method must be implemented by subclass');
  }

  /**
   * Init event handlers
   */
  initEventHandlers() {
    this.scene.events.on(CONFIG.EVENTS.GAME_START, this.onStart, this);
    this.scene.events.on(CONFIG.EVENTS.GAME_RESTART, this.onRestart, this);
    this.scene.events.on(CONFIG.EVENTS.GAME_OVER, this.onGameOver, this);
  }

  /**
   * Create score text flash tween
   * @param {number} duration - Tween duration
   * @param {number} iterations - Tween iterations
   * @param {function} [onStart=() => {}] - A function to be executed when tween starts
   * @param {function} [onComplete=() => {}] - A function to be executed when tween completes
   * @returns {Phaser.Tweens.Tween} Created Tween object
   */
  createFlashTween(duration, iterations, onStart = () => {}, onComplete = () => {}) {
    return this.scene.tweens.create({
      targets: this.scoreText,
      duration: 0,
      alpha: {
        start: 1,
        to: 0,
      },
      repeat: iterations,
      repeatDelay: duration,
      yoyo: true,
      hold: duration,
      completeDelay: duration * 2,
      onStart: () => {
        this.isFlashing = true;
        onStart();
      },
      onComplete: () => {
        this.isFlashing = false;
        this.scoreText.setAlpha(1);
        onComplete();
      },
    });
  }

  /**
   * Update score panel
   * @param {number} score - Current game score
   */
  update(score) {
    if (score >= this.maxScore) {
      this.maxScoreLength += 1;
      this.maxScore = 10 ** (this.maxScoreLength - 1) - 1;
    }
  }

  /**
   * Set score
   * @param {number} score - Current game score
   */
  setScore(score) {
    // create score string and padStart it to MAX_LENGTH with zeros
    // e.g. MAX_LENGTH = 5 and score = 418, so scoreString will be '00418'
    const scoreString = this.defaultString + score.toString().padStart(this.maxScoreLength, '0');
    this.scoreText.setText(scoreString);
  }

  /**
   * Clear score
   */
  clearScore() {
    this.setScore(0);
  }

  /**
   * Flash score text
   */
  flashScore() {
    this.flashTween = this.createFlashTween();
    this.flashTween.play();
  }

  /**
   * Reset score panel
   */
  reset() {
    this.flashTween.complete();
  }

  /**
   * Handle game start
   */
  // eslint-disable-next-line class-methods-use-this
  onStart() {}

  /**
   * Handle game restart
   */
  onRestart() {
    this.initVars();
  }

  /**
   * Handle gameover
   */
  onGameOver() {
    this.reset();
  }
}

export default BaseScorePanel;
