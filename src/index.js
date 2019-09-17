import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import Game from './Game';
import config from './config';

import './index.css';

// eslint-disable-next-line no-new
new Game(config);

OfflinePluginRuntime.install();
