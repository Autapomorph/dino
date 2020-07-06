import CONFIG from '../../config/game';

/**
 * Game intro
 * @class Intro
 */
class Intro {
  static CONFIG = CONFIG.SCENES.GAME.INTRO;

  /**
   * Creates an instance of Intro
   * @param {Phaser.Events.EventEmitter} eventEmitter - The EventEmitter which this Intro uses
   */
  constructor(eventEmitter) {
    this.eventEmitter = eventEmitter;
    this.setState(Intro.CONFIG.STATES.WAITING);
  }

  /**
   * Start intro
   */
  start() {
    this.setState(Intro.CONFIG.STATES.ONGOING);
    this.eventEmitter.emit(CONFIG.EVENTS.GAME_INTRO_START);
  }

  /**
   * Complete intro
   */
  complete() {
    this.setState(Intro.CONFIG.STATES.COMPLETE);
    this.eventEmitter.emit(CONFIG.EVENTS.GAME_INTRO_COMPLETE);
  }

  /**
   * Set intro state
   * @param {string} state - State to be set
   * @returns {Intro} this
   * @throws Will throw an error if state argument is invalid
   */
  setState(state) {
    if (Object.hasOwnProperty.call(Intro.CONFIG.STATES, state)) {
      this.state = state;
      return this;
    }

    throw new Error(`Invalid Intro State: ${state}`);
  }

  /**
   * Check if intro state is `waiting`
   * @readonly
   */
  get isWaiting() {
    return this.state === Intro.CONFIG.STATES.WAITING;
  }

  /**
   * Check if intro state is `ongoing`
   * @readonly
   */
  get isOngoing() {
    return this.state === Intro.CONFIG.STATES.ONGOING;
  }

  /**
   * Check if intro state is `complete`
   * @readonly
   */
  get isComplete() {
    return this.state === Intro.CONFIG.STATES.COMPLETE;
  }
}

export default Intro;
