import Phaser from 'phaser';

import LoaderScene from './Loader';
import scenes from '../config/scenes';

class BootScene extends Phaser.Scene {
  static name = 'BootScene';

  constructor() {
    super(BootScene.name);
  }

  preload() {
    this.load.image('logo', 'assets/sprites/logo.png');

    Object.keys(scenes).forEach(sceneName => {
      this.load.json(sceneName, scenes[sceneName]);
    });
  }

  create(data) {
    this.scene.start(LoaderScene.name, {
      sceneTimerDelay: data.sceneTimerDelay,
      sceneData: this.cache.json.get(data.scene),
      scene: data.scene,
    });
  }
}

export default BootScene;
