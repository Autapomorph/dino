const GAME = {
  NAME: 'SCENE_GAME',
  GAME: {
    SCORE: {
      MAX_LENGTH: 5,
      COEFFICIENT: 0.02,
      POS: {
        X: {
          OFFSET: 0.95,
        },
        Y: 10,
      },
      ACHIEVEMENT: {
        DISTANCE: 100,
        FLASH: {
          DURATION: 250,
          ITERATIONS: 3,
        },
      },
    },
    HIGH_SCORE: {
      STORAGE_KEY: 'highScore',
      POS: {
        X: {
          OFFSET: 15,
        },
        Y: 10,
      },
      GAMEOVER: {
        FLASH: {
          DURATION: 250,
          ITERATIONS: 6,
        },
      },
    },
    OBSTACLES: {
      TYPES: {
        BIRD: {
          FRAME: 'bird',
          SPAWN: {
            SPEED: {
              MIN: 12,
              MIN_MOBILE: 10,
            },
          },
        },
        CACTUS: {
          SMALL: {
            FRAME: 'cactus-small',
            SIZING: {
              SPEED: {
                MIN: 10,
                MIN_MOBILE: 8,
              },
            },
          },
          LARGE: {
            FRAME: 'cactus-large',
            SIZING: {
              SPEED: {
                MIN: 11,
                MIN_MOBILE: 9,
              },
            },
          },
        },
      },
      ACCELERATION: 0.001,
      SPEED: {
        INITIAL: 10,
        MAX: 17,
        MOBILE_COEFFICIENT: 1.2,
      },
      GAP: {
        MAX_MULIPLIER: 1.5,
      },
      SPAWN: {
        DELAY: 3000,
        MAX_DUPLICATION: 2,
      },
    },
  },
  GAMEOVER: {
    VIBRATION: 200,
  },
  RESTART: {
    COOLDOWN: 750,
  },
  INTRO: {
    STATES: {
      WAITING: 'WAITING',
      STARTED: 'STARTED',
      COMPLETE: 'COMPLETE',
    },
    DURATION: 400,
    CAMERA: {
      WIDTH: 90,
    },
  },
  NIGHTMODE: {
    DISTANCE: 700,
    DURATION: 12000,
    FADE_DURATION: 250,
    STARS: {
      MAX_COUNT: 2,
    },
  },
  STYLES: {
    TRANSITION: 'width 250ms linear, height 250ms linear',
  },
};

export default GAME;
