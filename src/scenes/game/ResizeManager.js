import CONFIG from '../../config/game';

/**
 * ResizeManager
 * @class ResizeManager
 */
class ResizeManager {
  static CONFIG = CONFIG.SCENES.GAME;

  /**
   * Creates an instance of ResizeManager
   * @param {Phaser.Scene} scene - The Scene to which this ResizeManager belongs
   * @param {*} resizeCallbacks - Callback to be called
   * @memberof ResizeManager
   */
  constructor(scene, { canvas, camera, gameSpeed, gameObjects }) {
    this.game = scene.game;
    this.canvas = scene.game.canvas;
    this.scale = scene.scale;

    this.callbacks = {
      canvas,
      camera,
      gameSpeed,
      gameObjects,
    };

    this.init();
    this.initEventHandlers();
  }

  /**
   * Init
   */
  init() {
    this.gameWidth = this.scale.gameSize.width;
  }

  /**
   * Init event handlers
   */
  initEventHandlers() {
    this.scale.on('resize', () => {
      this.resize(this.scale.gameSize, this.scale.parentSize);
    });
  }

  /**
   * Resize scene
   * @param {Phaser.Structs.Size} gameSize - Current game size
   * @param {Phaser.Structs.Size} parentSize - Current parent size
   */
  resize(gameSize, parentSize) {
    this.resizeCanvas(gameSize, parentSize);
    this.resizeGameSpeed(gameSize);
    this.resizeCamera(gameSize);
    this.resizeGameObjects(gameSize);
  }

  /**
   * Resize canvas
   * @param {Phaser.Structs.Size} gameSize - Current game size
   * @param {Phaser.Structs.Size} parentSize - Current parent size
   */
  resizeCanvas(gameSize, parentSize) {
    const { width, height } = this.callbacks.canvas({
      width: parentSize.width,
      height: gameSize.height * (parentSize.width / gameSize.width),
    });

    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  /**
   * Resize game speed
   * @param {Phaser.Structs.Size} gameSize - Current game size
   * @param {Phaser.Structs.Size} parentSize - Current parent size
   */
  resizeGameSpeed(gameSize) {
    if (this.gameWidth !== gameSize.width) {
      this.callbacks.gameSpeed(gameSize);
    }

    this.gameWidth = gameSize.width;
  }

  /**
   * Resize camera
   * @param {Phaser.Structs.Size} gameSize - Current game size
   * @param {Phaser.Structs.Size} parentSize - Current parent size
   */
  resizeCamera(gameSize) {
    this.callbacks.camera(gameSize);
  }

  /**
   * Resize gameobjects
   * @param {Phaser.Structs.Size} gameSize - Current game size
   * @param {Phaser.Structs.Size} parentSize - Current parent size
   */
  resizeGameObjects(gameSize) {
    this.callbacks.gameObjects(gameSize);
  }
}

export default ResizeManager;
