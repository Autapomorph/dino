import CurrentScore from './CurrentScorePanel';
import HighScore from './HighScorePanel';

/**
 * Score panels zone
 * @class ScoreZone
 */
class ScoreZone {
  /**
   * Creates an instance of ScoreZone
   * @param {CurrentScorePanel} currentScorePanel - CurrentScorePanel to be placed inside this ScoreZone
   * @param {HighScorePanel} highScorePanel - HighScorePanel to be placed inside this ScoreZone
   */
  constructor(currentScorePanel, highScorePanel) {
    this.currentScorePanel = currentScorePanel;
    this.highScorePanel = highScorePanel;
  }

  /**
   * Adjust score zone position
   * @param {Phaser.Structs.Size} gameSize - Current game size
   */
  adjustPosition({ width }) {
    const { scoreText: currentScoreText } = this.currentScorePanel;
    const { scoreText: highScoreText } = this.highScorePanel;

    const currentScoreX = width * CurrentScore.CONFIG.POS.X.OFFSET;
    const currentScoreY = CurrentScore.CONFIG.POS.Y;
    currentScoreText.setPosition(currentScoreX, currentScoreY);

    const currentScoreWidth = currentScoreText.width;
    const highScoreX = currentScoreX - currentScoreWidth - HighScore.CONFIG.POS.X.OFFSET;
    const highScoreY = HighScore.CONFIG.POS.Y;
    highScoreText.setPosition(highScoreX, highScoreY);
  }

  /**
   * Update score zone
   * @param {Phaser.Structs.Size} gameSize - Current game size
   */
  update(gameSize) {
    this.adjustPosition(gameSize);
  }

  /**
   * Resize score zone
   * @param {Phaser.Structs.Size} gameSize - Current game size
   */
  resize(gameSize) {
    this.adjustPosition(gameSize);
  }
}

export default ScoreZone;
