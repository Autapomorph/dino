import Phaser from 'phaser';

import CONFIG from '../../config/game';
import InputManager from './InputManager';
import SoundManager from './SoundManager';
import ScoreManager from './ScoreManager';
import ResizeManager from './ResizeManager';
import UI from './UI';
import Intro from './Intro';
import Player from '../../prefabs/player/Player';
import Horizon from '../../prefabs/horizon/Horizon';

/**
 * GameScene
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
    this.initCanvasStyles();
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

    this.soundManager = new SoundManager(this);
    this.inputManager = new InputManager(this);
    this.resizeManager = new ResizeManager(this, {
      canvas: this.onResizeCanvas.bind(this),
      camera: this.onResizeCamera.bind(this),
      gameSpeed: this.onResizeGameSpeed.bind(this),
      gameObjects: this.onResizeGameObjects.bind(this),
    });
  }

  /**
   * Init event handlers
   */
  initEventHandlers() {
    this.events.on(CONFIG.EVENTS.GAME_START, this.onGameStart, this);
    this.events.on(CONFIG.EVENTS.GAME_INTRO_START, this.onIntroStart, this);
    this.events.on(CONFIG.EVENTS.GAME_INTRO_COMPLETE, this.onIntroComplete, this);
    this.events.on(CONFIG.EVENTS.GAME_RESTART, this.onGameRestart, this);
    this.events.on(CONFIG.EVENTS.GAME_OVER, this.onGameOver, this);
    this.events.on(CONFIG.EVENTS.HIGH_SCORE_RECORD, this.onHighScoreRecord, this);
    this.events.on(CONFIG.EVENTS.HIGH_SCORE_RESET, this.onHighScoreReset, this);

    this.input.once('pointerup', this.resumeAudioContext, this);
    this.input.keyboard.once('keyup', this.resumeAudioContext, this);
  }

  /**
   * Init canvas styles
   */
  initCanvasStyles() {
    const styles = Object.entries(GameScene.CONFIG.STYLES).map(([k, v]) => [k.toLowerCase(), v]);

    styles.forEach(([k, v]) => {
      this.game.canvas.style[k] = v;
    });
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
    this.events.emit(CONFIG.EVENTS.GAME_OVER);
  }

  /**
   * Handle game start
   */
  onGameStart() {
    this.isPlaying = true;
    this.isInitialStart = false;

    this.player.jump();
    this.ui.highScorePanel.setScore(ScoreManager.getHighScore());
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
    this.resizeManager.resizeCanvas(this.scale.gameSize, this.scale.parentSize);
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
  }

  /**
   * Handle gameover
   */
  onGameOver() {
    this.isPlaying = false;

    this.physics.pause();

    if (this.game.device.features.vibration) {
      navigator.vibrate(GameScene.CONFIG.GAMEOVER.VIBRATION);
    }
  }

  /**
   * Handle high score
   * @param {number} highScore - New high score record
   */
  // eslint-disable-next-line class-methods-use-this
  onHighScoreRecord(highScore) {
    ScoreManager.saveHighScore(highScore);
  }

  /**
   * Handle high score reset
   */
  onHighScoreReset() {
    ScoreManager.resetHighScore(0);
    this.ui.highScorePanel.setScore(0);
  }

  /**
   * Get current score
   * @readonly
   */
  get score() {
    return Math.round(Math.ceil(this.distance * GameScene.CONFIG.GAME.SCORE.COEFFICIENT));
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
   * @readonly
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
   * @readonly
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
   * @readonly
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
   * @readonly
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
