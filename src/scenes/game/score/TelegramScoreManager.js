import BaseScoreManager from './BaseScoreManager';
import getTokenParam from '../../../utils/telegram/getTokenParam';
import fetchTimeout from '../../../utils/fetchTimeout';

/**
 * Telegram score manager
 * @class TelegramScoreManager
 * @extends {BaseScoreManager}
 */
class TelegramScoreManager extends BaseScoreManager {
  API_ENDPOINT = process.env.API_ENDPOINT;

  token = getTokenParam();

  /**
   * Get high score for current user from Telegram
   * @async
   * @override
   * @returns {Promise<number>}
   */
  async getHighScore() {
    super.getHighScore();

    try {
      const response = await fetchTimeout(`${this.API_ENDPOINT}`, 3000, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      const scoreData = await response.json();

      if (scoreData.ok === false) {
        throw new Error(scoreData.message);
      }

      const userHighScore = scoreData.userScore ? scoreData.userScore.score : 0;
      this.onGetSuccess(userHighScore);
      return userHighScore;
    } catch (error) {
      this.onGetFail();
      throw error;
    }
  }

  /**
   * Submit current user high score to Telegram
   * @async
   * @override
   * @param {number} highScore - High score
   * @returns {Promise<number>}
   */
  async saveHighScore(score) {
    super.saveHighScore();

    try {
      const response = await fetchTimeout(`${this.API_ENDPOINT}`, 3000, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          score,
        }),
      });

      const scoreData = await response.json();

      if (scoreData.ok === false) {
        throw new Error(scoreData.message);
      }

      this.onSaveSuccess(scoreData.score);
      return scoreData.score;
    } catch (error) {
      this.onSaveFail();
      throw error;
    }
  }
}

export default TelegramScoreManager;
