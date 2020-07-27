import CONFIG from '../../../config/game';
import BaseScoreManager from './BaseScoreManager';

/**
 * Local score manager. Operates with localstorage
 * @class LocalScoreManager
 * @extends {BaseScoreManager}
 */
class LocalScoreManager extends BaseScoreManager {
  storage = window.localStorage;

  static CONFIG = {
    STORAGE_KEY: CONFIG.SCENES.GAME.GAME.HIGH_SCORE.STORAGE_KEY,
  };

  /**
   * Get high score from localstorage
   * @async
   * @override
   * @returns {Promise<number>}
   */
  async getHighScore() {
    super.getHighScore();

    try {
      const { STORAGE_KEY } = LocalScoreManager.CONFIG;

      if (this.storage.getItem(STORAGE_KEY) === null) {
        this.resetHighScore();
      }

      const highScore = Number.parseInt(this.storage.getItem(STORAGE_KEY), 10) || 0;
      this.onGetSuccess(highScore);
      return highScore;
    } catch (error) {
      this.onGetFail();
      throw error;
    }
  }

  /**
   * Save high score to localstorage
   * @async
   * @override
   * @param {number} [highScore=0] - High score to save
   */
  async saveHighScore(highScore = 0) {
    super.saveHighScore();

    try {
      this.storage.setItem(LocalScoreManager.CONFIG.STORAGE_KEY, highScore);
      this.onSaveSuccess(highScore);
      return highScore;
    } catch (error) {
      this.onSaveFail();
      throw error;
    }
  }
}

export default LocalScoreManager;
