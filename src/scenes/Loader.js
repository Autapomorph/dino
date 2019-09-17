import Phaser from 'phaser';

import loadAssets from '../utils/assetsLoader';

class LoaderScene extends Phaser.Scene {
  static name = 'LoaderScene';

  constructor() {
    super(LoaderScene.name);
  }

  init(data) {
    this.nextScene = data.scene;
    this.sceneData = data.sceneData;
    this.sceneTimerDelay = data.sceneTimerDelay || 0;

    this.isTimerExpired = false;
    this.isNextSceneReady = false;
    setTimeout(() => {
      this.isTimerExpired = true;
      this.tryToStartNextScene();
    }, this.sceneTimerDelay);
  }

  preload() {
    this.createLogo();
    this.createProgressBar();

    loadAssets(this, this.sceneData.assets);

    this.load.on('progress', this.handleProgress, this);
    this.load.on('fileprogress', this.handleFileProgress, this);
    this.load.on('complete', this.handleComplete, this);
  }

  tryToStartNextScene() {
    if (this.isTimerExpired && this.isNextSceneReady) {
      this.scene.start(this.nextScene, { sceneData: this.sceneData });
    }
  }

  createLogo() {
    const { width } = this.scale.gameSize;
    const centerX = width / 2;

    const logo = this.add.image(centerX, 100, 'logo');
    logo.setOrigin(0.5, 0);
    logo.setScale(0.6);
  }

  createProgressBar() {
    const { width, height } = this.scale.gameSize;
    const centerX = width / 2;
    const centerY = height / 2;

    this.progressBar = this.add.graphics();
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(centerX - 160, centerY + 120, 320, 50);

    this.loadingText = this.make.text({
      x: centerX,
      y: centerY + 100,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff',
      },
    });
    this.loadingText.setOrigin(0.5);

    this.percentText = this.make.text({
      x: centerX,
      y: centerY + 145,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    this.percentText.setOrigin(0.5);

    this.assetText = this.make.text({
      x: centerX,
      y: centerY + 200,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    this.assetText.setOrigin(0.5);
  }

  handleProgress(value) {
    const { width, height } = this.scale.gameSize;
    const centerX = width / 2;
    const centerY = height / 2;

    this.percentText.setText(`${Number.parseInt(value * 100, 10)}%`);
    this.progressBar.clear();
    this.progressBar.fillStyle(0xffffff, 1);
    this.progressBar.fillRect(centerX - 150, centerY + 130, 300 * value, 30);
  }

  handleFileProgress(file) {
    this.assetText.setText(`Loading asset: ${file.key}`);
  }

  handleComplete() {
    this.progressBar.destroy();
    this.progressBox.destroy();
    this.loadingText.destroy();
    this.percentText.destroy();
    this.assetText.destroy();

    this.isNextSceneReady = true;
    this.tryToStartNextScene();
  }
}

export default LoaderScene;
