import CONFIG from '../../config/game';
import Stars from './stars/Stars';
import Moon from './moon/Moon';

/**
 * NightMode
 * @class NightMode
 */
class NightMode {
  static CONFIG = {
    NIGHTMODE: CONFIG.SCENES.GAME.NIGHTMODE,
    MOON: CONFIG.PREFABS.MOON,
    STARS: CONFIG.PREFABS.STAR,
  };

  /**
   * Creates an instance of NightMode
   * @param {Phaser.Scene} scene - The Scene to which this NightMode belongs
   */
  constructor(scene) {
    const { FADE_DURATION } = NightMode.CONFIG.NIGHTMODE;
    const gameWidth = scene.scale.gameSize.width;

    this.scene = scene;
    this.isEnabled = false;

    // Moon
    this.moon = new Moon(scene, gameWidth - 50, NightMode.CONFIG.MOON.POS.Y);
    this.moon.setAlpha(0);

    // Stars
    this.stars = new Stars(scene);
    this.stars.spawnItems();
    this.stars.children.each(star => star.setAlpha(0));

    // DOM canvas and parent elements
    this.canvas = scene.game.canvas;
    this.parent = scene.game.scale.parent;

    // Set DOM elements transitions
    this.canvas.style.transition = `filter ${FADE_DURATION}ms linear`;
    this.parent.style.transition = `background-color ${FADE_DURATION}ms linear`;
  }

  /**
   * Update nightmode
   */
  update() {
    const { width } = this.scene.scale.gameSize;
    const { moon, stars } = this;

    if (this.isEnabled) {
      moon.update(NightMode.CONFIG.MOON.SPEED);
      stars.update(NightMode.CONFIG.STARS.SPEED);

      if (moon.x + moon.width < 0) {
        moon.setX(width);
      }
    }
  }

  /**
   * Check if nightmode is enabled
   * @returns {boolean}
   */
  get isEnabled() {
    return this.enabled;
  }

  /**
   * Set nightmode enabled property
   * @param {boolean} isEnabled - Enable or disable NightMode
   * @returns {boolean}
   */
  set isEnabled(isEnabled) {
    this.enabled = isEnabled;
  }

  /**
   * Enable nightmode
   */
  enable() {
    this.stars.shuffleItems();

    this.scene.tweens.add({
      targets: [this.moon, ...this.stars.getChildren()],
      duration: NightMode.CONFIG.NIGHTMODE.FADE_DURATION,
      alpha: 1,
      onStart: () => {
        this.isEnabled = true;
        this.canvas.style.filter = 'invert(1)';
        this.parent.style.backgroundColor = '#000';
      },
    });
  }

  /**
   * Disable nightmode
   * @param {function} [onComplete=() => {}] - A function to be executed after disabling nightmode
   */
  disable(onComplete = () => {}) {
    this.scene.tweens.add({
      targets: [this.moon, ...this.stars.getChildren()],
      duration: NightMode.CONFIG.NIGHTMODE.FADE_DURATION,
      alpha: 0,
      onStart: () => {
        this.canvas.style.filter = 'invert(0)';
        this.parent.style.backgroundColor = '#fff';
      },
      onComplete: () => {
        this.isEnabled = false;
        this.moon.nextPhase();
        onComplete();
      },
    });
  }

  /**
   * Reset nightmode
   */
  reset() {
    this.disable(() => this.moon.reset());
  }
}

export default NightMode;
