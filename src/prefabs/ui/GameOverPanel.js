import Phaser from 'phaser';

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

    const gameOverTextBounds = this.gameOverText.getTextBounds().global;
    const restartImgBounds = this.restartImg.getBounds();
    this.zone = this.scene.add
      .zone(
        gameOverTextBounds.x,
        gameOverTextBounds.y,
        gameOverTextBounds.width,
        restartImgBounds.y + restartImgBounds.height - gameOverTextBounds.y,
      )
      .setOrigin(0, 0);
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
    this.gameOverText.setVisible(true);
    this.restartImg.setVisible(true);
    this.zone.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(0, 0, this.zone.width, this.zone.height),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: false,
    });
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
  resize({ width }) {
    const { x, y } = this.gameOverText.getTextBounds().global;

    this.gameOverText.x = width / 2;
    this.restartImg.x = width / 2;
    this.zone.setPosition(x, y);
  }
}

export default GameOverPanel;
