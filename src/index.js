import Game from './Game';
import config from './config';
import './utils/telegram/games';
import { isProd } from './utils';

import './index.css';

// eslint-disable-next-line no-new
new Game(config);

if (isProd) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js');
    });
  }
}
