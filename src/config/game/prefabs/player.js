const PLAYER = {
  FRAMES: {
    INITIAL: 'dino-idle-1',
    IDLING: ['dino-idle-1', 'dino-idle-2'],
    RUNNING: ['dino-run-1', 'dino-run-2'],
    DUCKING: ['dino-duck-1', 'dino-duck-2'],
    JUMPING: 'dino-idle-1',
    DEAD: 'dino-dead',
  },
  POS: {
    INITIAL_X: 0,
    X: 50,
    Y: 325,
  },
  GRAVITY: {
    Y: 2500,
  },
  JUMP: {
    VELOCITY: {
      Y: 1675 * -1,
    },
    ACCELERATION: 3200,
  },
  BLINK: {
    DURATION: 100,
    DELAY: 7000,
  },
  STATES: {
    IDLING: 'IDLING',
    RUNNING: 'RUNNING',
    DUCKING: 'DUCKING',
    JUMPING: 'JUMPING',
    DEAD: 'DEAD',
  },
};

export default PLAYER;
