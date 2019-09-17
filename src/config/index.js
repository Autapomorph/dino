import Phaser from 'phaser';

import { isProd } from '../utils';

const config = {
  title: 'Phaser 3 Project Template',
  url: 'https://example.org',
  version: '1.0',
  type: Phaser.AUTO,
  backgroundColor: '#000',
  render: { pixelArt: false },
  banner: !isProd,
  scale: {
    width: 800,
    height: 600,
    mode: Phaser.Scale.ScaleModes.FIT,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200, x: 0 },
      debug: !isProd,
    },
  },
};

export default config;
