import CONFIG from '../../config/game';

/**
 * Sound manager
 * @class SoundManager
 */
class SoundManager {
  /**
   * Creates an instance of SoundManager.
   * @param {Phaser.Scene} scene - The Scene to which this SoundManager belongs
   */
  constructor(scene) {
    this.scene = scene;

    this.init();
    this.initEventHandlers();
  }

  /**
   * Init
   */
  init() {
    const { scene } = this;

    this.playerAction = scene.sound.add('player-action');
    this.achievement = scene.sound.add('achievement');
    this.gameover = scene.sound.add('gameover');
  }

  /**
   * Init event handlers
   */
  initEventHandlers() {
    const { scene } = this;

    scene.events.on(CONFIG.EVENTS.PLAYER_ACTION, this.playPlayerAction, this);
    scene.events.on(CONFIG.EVENTS.ACHIEVEMENT, this.playAchievement, this);
    scene.events.on(CONFIG.EVENTS.GAME_OVER, this.playGameOver, this);
  }

  /**
   * Play player action sound
   */
  playPlayerAction() {
    this.playerAction.play();
  }

  /**
   * Play achievement sound
   */
  playAchievement() {
    this.achievement.play();
  }

  /**
   * Play gameover sound
   */
  playGameOver() {
    this.gameover.play();
  }
}

export default SoundManager;
