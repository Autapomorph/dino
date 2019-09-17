import CurrentScore from './CurrentScorePanel';
import HighScore from './HighScorePanel';

/**
 * ScoreZone
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
   * Update score zone
   * @param {Phaser.Structs.Size} gameSize - Current game size
   */
  update(gameSize) {
    this.resize(gameSize);
  }

  /**
   * Resize score zone
   * @param {Phaser.Structs.Size} gameSize - Current game size
   */
  resize({ width }) {
    const {
      X: { OFFSET: currentScoreXOffset },
      Y: currentScoreY,
    } = CurrentScore.CONFIG.POS;
    const {
      X: { OFFSET: highScoreXOffset },
      Y: highScoreY,
    } = HighScore.CONFIG.POS;

    const { scoreText: currentScoreText } = this.currentScorePanel;
    const { scoreText: highScoreText, zone: highScoreZone } = this.highScorePanel;

    const currentScoreX = width * currentScoreXOffset;
    const currentScoreWidth = currentScoreText.width;
    currentScoreText.setPosition(currentScoreX, currentScoreY);

    const highScoreX = currentScoreX - currentScoreWidth - highScoreXOffset;
    highScoreText.setPosition(highScoreX, highScoreY);

    const highScoreTextBounds = highScoreText.getTextBounds().global;
    highScoreZone.setPosition(highScoreTextBounds.x, highScoreTextBounds.y);
    highScoreZone.setSize(highScoreTextBounds.width, highScoreTextBounds.height);
  }
}

export default ScoreZone;
