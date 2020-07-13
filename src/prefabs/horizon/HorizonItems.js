import Phaser from 'phaser';

/**
 * HorizonItems Group
 * @class HorizonItems
 * @extends {Phaser.Physics.Arcade.Group}
 */
class HorizonItems extends Phaser.Physics.Arcade.Group {
  /**
   * Creates an instance of HorizonItems
   * @param {Phaser.Scene} scene - The Scene to which this HorizonItems group belongs
   */
  constructor(scene) {
    super(scene.physics.world, scene);
  }

  /**
   * Update horizon items group
   * @param {number} speed - Current game speed
   * @param {boolean} isMobile - Whether game is running in mobile mode
   */
  update(speed, isMobile) {
    const { width } = this.scene.scale.gameSize;

    this.children.each(item => item.update(speed));

    const lastItem = this.getLast(true);
    if (lastItem && lastItem.x + lastItem.width + lastItem.gap < width) {
      this.clearItems();
      this.spawnItem(speed, isMobile);
    }
  }

  /**
   * Spawn horizon item
   * @param {number} speed - Current game speed
   * @param {boolean} isMobile - Whether game is running in mobile mode
   * @abstract
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  spawnItem(speed, isMobile) {
    throw new Error('Method must be implemented by subclass');
  }

  /**
   * Clear horizon items group
   */
  clearItems() {
    // clear every invisible item
    this.children.each(item => {
      if (!item.visible) {
        item.die();
      }
    });
  }

  /**
   * Reset horizon items group
   */
  reset() {
    this.children.each(item => item.reset());
    this.clear(true, true);
  }
}

export default HorizonItems;
