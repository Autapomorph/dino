import CONFIG from '../../../config/game';

/**
 * Base score manager
 * @class BaseScoreManager
 */
class BaseScoreManager {
  /**
   * Creates an instance of BaseScoreManager
   * @param {Phaser.Events.EventEmitter} eventEmitter - The game EventEmitter
   */
  constructor(eventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  /**
   * Get high score from localstorage
   * @async
   */
  async getHighScore() {
    this.eventEmitter.emit(CONFIG.EVENTS.HIGH_SCORE_FETCH.REQUEST);
  }

  /**
   * Handle fetch high score success
   * @param {number} highScore - Fetched high score
   */
  onGetSuccess(highScore) {
    this.eventEmitter.emit(CONFIG.EVENTS.HIGH_SCORE_FETCH.SUCCESS, highScore);
  }

  /**
   * Handle fetch high score fail
   */
  onGetFail() {
    this.eventEmitter.emit(CONFIG.EVENTS.HIGH_SCORE_FETCH.FAIL);
  }

  /**
   * Save high score to localstorage
   * @async
   */
  async saveHighScore() {
    this.eventEmitter.emit(CONFIG.EVENTS.HIGH_SCORE_SAVE.REQUEST);
  }

  /**
   * Handle save high score success
   * @param {number} highScore - Fetched high score
   */
  onSaveSuccess(highScore) {
    this.eventEmitter.emit(CONFIG.EVENTS.HIGH_SCORE_SAVE.SUCCESS, highScore);
  }

  /**
   * Handle save high score fail
   */
  onSaveFail() {
    this.eventEmitter.emit(CONFIG.EVENTS.HIGH_SCORE_SAVE.FAIL);
  }
}

export default BaseScoreManager;
