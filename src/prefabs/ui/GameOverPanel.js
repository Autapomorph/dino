import CONFIG from '../../config/game';

/**
 * GameOverPanel
 * @class GameOverPanel
 */
class GameOverPanel {
  /**
   * Creates an instance of GameOverPanel
   * @param {Phaser.Scene} scene - The Scene to which this Player belongs
   */
  constructor(scene) {
    this.scene = scene;

    this.init();
  }

  /**
   * Init
   */
  init() {
    this.initImage();
    this.initEventHandlers();
  }

  /**
   * Init event handlers
   */
  initEventHandlers() {
    this.scene.events.on(CONFIG.EVENTS.GAME_OVER, this.show, this);
    this.scene.events.on(CONFIG.EVENTS.GAME_RESTART, this.hide, this);
    this.zone.on('pointerdown', this.onClick, this);
    this.zone.on('pointerup', this.onClick, this);
  }

  /**
   * Init image
   */
  initImage() {
    const { width, height } = this.scene.scale.gameSize;

    this.gameOverText = this.scene.add
      .bitmapText(width / 2, height / 2 - 75, 'joystix', 'G A M E  O V E R', 32)
      .setOrigin(0.5, 0.5)
      .setDepth(9999)
      .setVisible(false);

    this.restartImg = this.scene.add
      .image(width / 2, height / 2, 'dino', 'restart')
      .setOrigin(0.5, 0.5)
      .setDepth(9999)
      .setVisible(false);

    this.zone = this.scene.add.zone().setOrigin(0, 0);
  }

  /**
   * Handle click
   * @param {Phaser.Input.Pointer} pointer
   */
  onClick(pointer) {
    if (!pointer.wasTouch || pointer.noButtonDown()) {
      this.scene.events.emit(CONFIG.EVENTS.GAME_RESTART);
    }
  }

  /**
   * Show gameover panel
   */
  show() {
    const { x, y, width, height } = this.gameOverText;
    const { bottom } = this.restartImg.getBounds();

    this.gameOverText.setVisible(true);
    this.restartImg.setVisible(true);
    this.zone.setX(x - width / 2);
    this.zone.setY(y - height / 2);
    this.zone.setSize(width, bottom - (y - height / 2));
    this.zone.setInteractive();

    // uncomment this line to debug interactive area
    // this.scene.input.enableDebug(this.zone, 0x00ff00);
  }

  /**
   * Hide gameover panel
   */
  hide() {
    this.gameOverText.setVisible(false);
    this.restartImg.setVisible(false);
    this.zone.disableInteractive();
  }

  /**
   * Resize gameover panel
   * @param {Phaser.Structs.Size} gameSize - Current game size
   */
  resize(gameSize) {
    this.gameOverText.setX(gameSize.width / 2);
    this.restartImg.setX(gameSize.width / 2);

    const { x, y, width, height } = this.gameOverText;
    this.zone.setPosition(x - width / 2, y - height / 2);
  }
}

export default GameOverPanel;
