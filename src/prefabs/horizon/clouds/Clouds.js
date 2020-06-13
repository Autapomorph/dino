import Phaser from 'phaser';

import CONFIG from '../../../config/game';
import HorizonItems from '../HorizonItems';
import Cloud from './Cloud';

/**
 * Clouds group
 * @class Clouds
 * @extends {HorizonItems}
 */
class Clouds extends HorizonItems {
  static CONFIG = CONFIG.PREFABS.CLOUD;

  /**
   * Spawn cloud
   * @override
   */
  spawnItem() {
    const { width } = this.scene.scale.gameSize;
    const CLOUD = Clouds.CONFIG;

    const y = Phaser.Math.RND.between(CLOUD.POS.Y.MIN, CLOUD.POS.Y.MAX);
    const gap = Phaser.Math.RND.between(CLOUD.GAP.MIN, CLOUD.GAP.MAX);

    const newObstacle = new Cloud(this.scene, width, y);
    newObstacle.setGap(gap);
    this.add(newObstacle);
  }
}

export default Clouds;
