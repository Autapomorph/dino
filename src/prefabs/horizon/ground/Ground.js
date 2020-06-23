import Phaser from 'phaser';

import CONFIG from '../../../config/game';

/**
 * Ground
 * @class Ground
 * @extends {Phaser.GameObjects.TileSprite}
 */
class Ground extends Phaser.GameObjects.TileSprite {
  static CONFIG = CONFIG.PREFABS.GROUND;

  /**
   * Creates an instance of Ground
   * @param {Phaser.Scene} scene - The Scene to which this Ground belongs
   * @param {number} [x=Ground.CONFIG.POS.X] - The horizontal position of this Ground in the world
   * @param {number} [y=Ground.CONFIG.POS.Y] - The vertical position of this Ground in the world
   */
  constructor(scene, x = Ground.CONFIG.POS.X, y = Ground.CONFIG.POS.Y) {
    super(scene, x, y, 0, 0, 'dino', 'ground');

    // Init image
    const gameSize = this.scene.scale;
    this.setY(gameSize.height);
    this.setOrigin(0, 2);
    this.setSize(gameSize.width, this.height);

    // Init physics
    this.scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY);
    this.body.setOffset(0, Ground.CONFIG.BODY.OFFSET.Y);

    this.scene.add.existing(this);
  }

  /**
   * Update ground
   * @param {number} speed - Current game speed
   */
  update(speed) {
    this.move(speed);
  }

  /**
   * Move ground
   * @param {number} speed - Current game speed
   */
  move(speed) {
    this.tilePositionX += speed;
  }

  /**
   * Resize ground
   * @param {Phaser.Structs.Size} gameSize - Current game size
   */
  resize({ width }) {
    this.width = width;
    this.body.width = width;
  }

  /**
   * Reset ground
   */
  reset() {
    this.tilePositionX = 0;
  }
}

export default Ground;
