import Phaser from 'phaser';

import CONFIG from '../../config/game';
import InputManager from './InputManager';
import SoundManager from './SoundManager';
import ResizeManager from './ResizeManager';
import LocalScoreManager from './score/LocalScoreManager';
import TelegramScoreManager from './score/TelegramScoreManager';
import UI from './UI';
import Intro from './Intro';
import Player from '../../prefabs/player/Player';
import Horizon from '../../prefabs/horizon/Horizon';
import isTelegramMode from '../../utils/telegram/isTelegramMode';

/**
 * Main game scene
 * @class GameScene
 * @extends {Phaser.Scene}
 */
class GameScene extends Phaser.Scene {
  static CONFIG = CONFIG.SCENES.GAME;

  constructor() {
    super(GameScene.CONFIG.NAME);
  }

  init() {
    this.initVars();
    this.initEventHandlers();
  }

  /**
   * Init variables
   */
  initVars() {
    this.width = this.scale.gameSize.width;

    this.isInitialStart = true;
    this.isPlaying = false;
    this.readyToRestart = false;

    this.speed = 0;
    this.maxSpeed = 0;
    this.initSpeed();
    this.distance = 0;
    this.highScore = 0;

    this.soundManager = new SoundManager(this);
    this.inputManager = new InputManager(this);
    this.resizeManager = new ResizeManager(this, {
      canvas: this.onResizeCanvas.bind(this),
      camera: this.onResizeCamera.bind(this),
      gameSpeed: this.onResizeGameSpeed.bind(this),
      gameObjects: this.onResizeGameObjects.bind(this),
    });
    this.scoreManager = isTelegramMode()
      ? new TelegramScoreManager(this.events)
      : new LocalScoreManager(this.events);

    // Register event handlers
    this.events.on(CONFIG.EVENTS.GAME_START, this.onGameStart, this);
    this.events.on(CONFIG.EVENTS.GAME_INTRO_START, this.onIntroStart, this);
    this.events.on(CONFIG.EVENTS.GAME_INTRO_COMPLETE, this.onIntroComplete, this);
    this.events.on(CONFIG.EVENTS.GAME_RESTART, this.onGameRestart, this);
    this.events.on(CONFIG.EVENTS.GAME_OVER, this.onGameOver, this);
    this.events.on(CONFIG.EVENTS.HIGH_SCORE_RECORD, this.onHighScoreUpdate, this);
    this.events.on(CONFIG.EVENTS.HIGH_SCORE_RESET, this.onHighScoreUpdate, this);
    // High score async events
    this.events.on(CONFIG.EVENTS.HIGH_SCORE_SAVE.SUCCESS, this.onHighScoreSave, this);
    // Input events
    this.input.once('pointerup', this.resumeAudioContext, this);
    this.input.keyboard.once('keyup', this.resumeAudioContext, this);
  }

  /**
   * Init game speed
   */
  initSpeed() {
    const { width } = this.scale.gameSize;
    const { INITIAL, MAX, MOBILE_COEFFICIENT } = GameScene.CONFIG.GAME.OBSTACLES.SPEED;

    if (width === CONFIG.GAME.WIDTH.LANDSCAPE) {
      this.speed = INITIAL;
      this.maxSpeed = MAX;
    } else if (width === CONFIG.GAME.WIDTH.PORTRAIT) {
      this.speed = INITIAL / MOBILE_COEFFICIENT;
      this.maxSpeed = MAX / MOBILE_COEFFICIENT;
    }
  }

  create() {
    this.ui = new UI(this);
    this.intro = new Intro(this.events);

    this.player = new Player(this);

    this.horizon = new Horizon(this);
    this.ground = this.horizon.ground;
    this.obstacles = this.horizon.obstacles;
    this.nightMode = this.horizon.nightMode;

    this.physics.add.collider(this.player, this.ground);
    this.physics.add.overlap(this.player, this.obstacles, this.onPlayerHitObstacle, null, this);

    this.resizeManager.resize(this.scale.gameSize, this.scale.parentSize);

    this.scoreManager
      .getHighScore()
      .then(highScore => {
        this.highScore = highScore;
      })
      .catch(() => {});
  }

  update() {
    const { gameSize } = this.scale;
    const isMobile = gameSize.width === CONFIG.GAME.WIDTH.PORTRAIT;

    this.inputManager.update();
    this.ui.update(this.isPlaying, gameSize, this.score);

    if (this.isPlaying) {
      this.player.update();

      if (this.intro.isComplete) {
        const { GAME, NIGHTMODE } = GameScene.CONFIG;
        const { OBSTACLES } = GAME;

        if (this.speed < this.maxSpeed) {
          this.speed += OBSTACLES.ACCELERATION;
        } else {
          this.speed = this.maxSpeed;
        }

        this.distance += this.speed;

        if (this.shouldNightModeStart) {
          this.nightMode.enable();
          this.time.delayedCall(NIGHTMODE.DURATION, () => {
            if (this.isPlaying && this.nightMode.isEnabled) {
              this.nightMode.disable();
            }
          });
        }

        this.horizon.update(this.speed, isMobile);
      }
    }
  }

  /**
   * Handle player collision with obstacle
   */
  onPlayerHitObstacle() {
    this.events.emit(CONFIG.EVENTS.GAME_OVER, this.score, this.highScore);
  }

  /**
   * Handle game start
   */
  onGameStart() {
    this.isPlaying = true;
    this.isInitialStart = false;

    this.player.jump();

    this.ui.highScorePanel.setScore(this.highScore);
  }

  /**
   * Handle game intro start
   */
  onIntroStart() {
    const { width } = this.scale.gameSize;

    this.tweens.add({
      targets: this.cameras.main,
      duration: GameScene.CONFIG.INTRO.DURATION,
      width,
    });
  }

  /**
   * Handle game intro complete
   */
  onIntroComplete() {
    const { canvas, gameSize, parentSize } = this.scale;
    const originalTransition = canvas.style.transition;
    const newTransition = `${CONFIG.SCENES.GAME.STYLES.TRANSITION}, ${originalTransition}`;

    canvas.style.transition = newTransition;
    this.resizeManager.resizeCanvas(gameSize, parentSize);
    canvas.addEventListener('transitionend', () => {
      canvas.style.transition = originalTransition;
      this.resizeManager.resizeCanvas(gameSize, parentSize);
    });
  }

  /**
   * Handle game restart
   */
  onGameRestart() {
    this.isPlaying = true;
    this.readyToRestart = false;

    this.distance = 0;
    this.speed = 0;
    this.maxSpeed = 0;
    this.initSpeed();

    this.physics.resume();

    this.scoreManager
      .getHighScore()
      .then(highScore => {
        this.highScore = highScore;
      })
      .catch(() => {});
  }

  /**
   * Handle gameover
   */
  onGameOver() {
    const { width: gameWidth, height: gameHeight } = this.scale.gameSize;

    this.isPlaying = false;
    this.physics.pause();
    this.scale.resize(gameWidth, gameHeight);

    if (this.game.device.features.vibration) {
      navigator.vibrate(GameScene.CONFIG.GAMEOVER.VIBRATION);
    }

    if (this.score > this.highScore) {
      this.events.emit(CONFIG.EVENTS.HIGH_SCORE_UPDATE, this.score);
    }
  }

  /**
   * Handle high score update
   * @param {number} highScore - Updated high score
   */
  onHighScoreUpdate(highScore) {
    this.scoreManager
      .saveHighScore(highScore)
      .then(() => {
        this.highScore = highScore;
      })
      .catch(() => {});
  }

  /**
   * Get current score
   * @readonly
   * @returns {number} - Current score
   */
  get score() {
    return Math.ceil(this.distance * GameScene.CONFIG.GAME.SCORE.COEFFICIENT);
  }

  /**
   * Check if night mode should start
   * @readonly
   */
  get shouldNightModeStart() {
    const { score, nightMode } = this;
    const { DISTANCE } = GameScene.CONFIG.NIGHTMODE;

    return score > 0 && score % DISTANCE === 0 && !nightMode.isEnabled;
  }

  /**
   * Handle canvas resize
   * @param {Phaser.Structs.Size} gameSize - Current game size
   */
  onResizeCanvas(gameSize) {
    const { width, height } = gameSize;

    if (!this.intro.isComplete) {
      return {
        width: width * 0.8,
        height: height * 0.8,
      };
    }

    return {
      width,
      height,
    };
  }

  /**
   * Handle game speed resize
   * @param {Phaser.Structs.Size} gameSize - Current game size
   */
  onResizeGameSpeed(gameSize) {
    const { MAX, MOBILE_COEFFICIENT } = GameScene.CONFIG.GAME.OBSTACLES.SPEED;

    if (gameSize.width === CONFIG.GAME.WIDTH.LANDSCAPE) {
      this.speed *= MOBILE_COEFFICIENT;
      this.maxSpeed = MAX;
    } else if (gameSize.width === CONFIG.GAME.WIDTH.PORTRAIT) {
      this.speed /= MOBILE_COEFFICIENT;
      this.maxSpeed = MAX / MOBILE_COEFFICIENT;
    }
  }

  /**
   * Handle camera resize
   * @param {Phaser.Structs.Size} gameSize - Current game size
   */
  onResizeCamera(gameSize) {
    const { width, height } = gameSize;
    const { main: mainCamera } = this.cameras;

    mainCamera.setOrigin(0, 0.5);

    if (this.intro.isComplete) {
      mainCamera.setViewport(0, 0, width, height);
    } else {
      mainCamera.setViewport(0, 0, GameScene.CONFIG.INTRO.CAMERA.WIDTH, height);
    }
  }

  /**
   * Handle gameobjects resize
   * @param {Phaser.Structs.Size} gameSize - Current game size
   */
  onResizeGameObjects(gameSize) {
    this.ui.resize(gameSize);
    this.ground.resize(gameSize);
  }

  /**
   * Resume audio context if suspended
   */
  resumeAudioContext() {
    const { context } = this.game.sound;
    if (context && context.state === 'suspended') {
      context.resume();
    }
  }
}

export default GameScene;
