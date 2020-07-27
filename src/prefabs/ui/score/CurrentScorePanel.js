import CONFIG from '../../../config/game';
import BaseScorePanel from './BaseScorePanel';

/**
 * Current score panel
 * @class CurrentScorePanel
 * @extends {BaseScorePanel}
 */
class CurrentScorePanel extends BaseScorePanel {
  static CONFIG = CONFIG.SCENES.GAME.GAME.SCORE;

  /**
   * Create {Phaser.GameObjects. BitmapText} `scoreText`
   * @override
   */
  initText() {
    const { scene } = this;

    this.scoreText = scene.add.bitmapText(0, 0, 'joystix', '', 32).setOrigin(1, 0).setDepth(9999);
  }

  /**
   * Create score text flash tween
   * @returns {Phaser.Tweens.Tween} Created Tween object
   * @override
   */
  createFlashTween() {
    const { DURATION, ITERATIONS } = CurrentScorePanel.CONFIG.ACHIEVEMENT.FLASH;
    return super.createFlashTween(DURATION, ITERATIONS);
  }

  /**
   * Update high score panel
   * @param {boolean} isPlaying - Whether game is running
   * @param {number} currentScore - Current game score
   * @override
   */
  update(isPlaying, currentScore) {
    super.update(currentScore);

    if (
      isPlaying &&
      currentScore > 0 &&
      currentScore % CurrentScorePanel.CONFIG.DISTANCE === 0 &&
      !this.isFlashing
    ) {
      this.scene.events.emit(CONFIG.EVENTS.ACHIEVEMENT);
      this.flashScore();
    }

    if (isPlaying && !this.isFlashing) {
      this.setScore(currentScore);
    }
  }

  /**
   * Handle gameover
   * @override
   * @param {number} currentScore - Current game score
   */
  onGameOver(currentScore) {
    super.onGameOver();
    this.setScore(currentScore);
  }
}

export default CurrentScorePanel;
