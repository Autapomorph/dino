import CONFIG from '../../../config/game';

/**
 * Game over panel
 * @class GameOverPanel
 */
class GameOverPanel {
  /**
   * Creates an instance of GameOverPanel
   * @param {Phaser.Scene} scene - The Scene to which this Player belongs
   */
  constructor(scene) {
    const gameWidth = scene.scale.gameSize.width;
    const gameHeight = scene.scale.gameSize.height;

    this.scene = scene;
    this.zone = scene.add.zone().setOrigin(0, 0);
    this.gameOverText = scene.add
      .bitmapText(gameWidth / 2, gameHeight / 2 - 75, 'joystix', 'G A M E  O V E R', 32)
      .setOrigin(0.5, 0.5)
      .setDepth(9999)
      .setVisible(false);
    this.restartImg = scene.add
      .image(gameWidth / 2, gameHeight / 2, 'dino', 'restart')
      .setOrigin(0.5, 0.5)
      .setDepth(9999)
      .setVisible(false);

    // Register event handlers
    this.scene.events.on(CONFIG.EVENTS.GAME_OVER, this.show, this);
    this.scene.events.on(CONFIG.EVENTS.GAME_RESTART, this.hide, this);
    this.zone.on('pointerdown', this.onClick, this);
    this.zone.on('pointerup', this.onClick, this);
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
