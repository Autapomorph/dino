import * as OfflinePlugin from 'offline-plugin/runtime';

import Game from './Game';
import config from './config';
import './utils/telegram/games';

import './index.css';

// eslint-disable-next-line no-new
new Game(config);

OfflinePlugin.install({
  onUpdateReady: () => {
    OfflinePlugin.applyUpdate();
  },
});
