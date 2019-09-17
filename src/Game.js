import Phaser from 'phaser';

import BootScene from './scenes/Boot';
import LoaderScene from './scenes/Loader';
import MainMenuScene from './scenes/menu/MainMenu';
import GameScene from './scenes/Game';

class Game extends Phaser.Game {
  constructor(config) {
    super(config);

    this.addScenes();
    this.startScene();
  }

  addScenes() {
    this.scene.add(BootScene.name, BootScene);
    this.scene.add(LoaderScene.name, LoaderScene);
    this.scene.add(MainMenuScene.name, MainMenuScene);
    this.scene.add(GameScene.name, GameScene);
  }

  startScene() {
    this.scene.start(BootScene.name, { scene: MainMenuScene.name, sceneTimerDelay: 3000 });
  }
}

export default Game;
