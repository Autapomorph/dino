import CONFIG from '../../config/game';
import ScorePanel from './ScorePanel';

/**
 * CurrentScorePanel
 * @class CurrentScorePanel
 * @extends {ScorePanel}
 */
class CurrentScorePanel extends ScorePanel {
  static CONFIG = CONFIG.SCENES.GAME.GAME.SCORE;

  /**
   * Create {Phaser.GameObjects. BitmapText} `scoreText`
   * @override
   */
  initText() {
    const { scene } = this;

    this.scoreText = scene.add
      .bitmapText(0, 0, 'joystix', '', 32)
      .setOrigin(1, 0)
      .setDepth(9999);
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
   * @param {number} score - Current game score
   * @override
   */
  update(isPlaying, score) {
    const { ACHIEVEMENT } = CurrentScorePanel.CONFIG;

    super.update(score);

    this.score = score;

    if (isPlaying && score > 0 && score % ACHIEVEMENT.DISTANCE === 0 && !this.isFlashing) {
      this.scene.events.emit(CONFIG.EVENTS.ACHIEVEMENT);
      this.flashScore();
    }

    if (isPlaying && !this.isFlashing) {
      this.setScore(score);
    }
  }

  /**
   * Handle gameover
   * @override
   */
  onGameOver() {
    super.onGameOver();
    this.setScore(this.score);
  }
}

export default CurrentScorePanel;
