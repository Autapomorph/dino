import PLAYER from './player';
import BIRD from './bird';
import CACTUS from './cactus';
import GROUND from './ground';
import CLOUD from './cloud';
import STAR from './star';
import MOON from './moon';

const PREFABS = {
  PLAYER,
  OBSTACLES: {
    BIRD,
    CACTUS,
  },
  GROUND,
  CLOUD,
  STAR,
  MOON,
};

export default PREFABS;
