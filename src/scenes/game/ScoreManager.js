import CONFIG from '../../config/game';

/**
 * ScoreManager
 */
class ScoreManager {
  static CONFIG = {
    COEFFICIENT: CONFIG.SCENES.GAME.GAME.SCORE.COEFFICIENT,
    STORAGE_KEY: CONFIG.SCENES.GAME.GAME.HIGH_SCORE.STORAGE_KEY,
  };

  /**
   * Get high score from localstorage
   * @static
   * @returns {number}
   */
  static getHighScore() {
    if (window.localStorage.getItem(ScoreManager.CONFIG.STORAGE_KEY) === null) {
      ScoreManager.resetHighScore();
    }

    return Number.parseInt(window.localStorage.getItem(ScoreManager.CONFIG.STORAGE_KEY), 10) || 0;
  }

  /**
   * Save high score to localstorage
   * @static
   * @param {number} highScore
   */
  static saveHighScore(highScore) {
    window.localStorage.setItem(ScoreManager.CONFIG.STORAGE_KEY, highScore);
  }

  /**
   * Reset high score in localstorage
   * @static
   * @param {number} [highScore=0]
   */
  static resetHighScore(highScore = 0) {
    window.localStorage.setItem(ScoreManager.CONFIG.STORAGE_KEY, highScore);
  }

  /**
   * Remove high score from localstorage
   * @static
   */
  static removeHighScore() {
    window.localStorage.removeItem(ScoreManager.CONFIG.STORAGE_KEY);
  }
}

export default ScoreManager;
