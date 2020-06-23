/**
 * Player input manager
 * @class InputManager
 */
class InputManager {
  /**
   * Creates an instance of InputManager
   * @param {Player} player - The Player to which this InputManager belongs
   */
  constructor(player) {
    this.player = player;
    this.scene = player.scene;
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  /**
   * Update inputManager
   */
  update() {
    const { player } = this;
    const { intro } = this.scene;

    if (player.isDead) {
      return;
    }

    if (player.isOnFloor) {
      if (this.isDuckKeyPressed && intro.isComplete) {
        player.duck();
      } else if (this.isJumpKeyPressed && !intro.isWaiting) {
        player.jump();
      } else {
        player.run();
      }
    } else {
      player.idle();
    }
  }

  /**
   * Check if duck key is pressed
   * @readonly
   * @returns {boolean}
   */
  get isDuckKeyPressed() {
    return this.cursors.down.isDown;
  }

  /**
   * Check if jump key is pressed
   * @readonly
   * @returns {boolean}
   */
  get isJumpKeyPressed() {
    const { activePointer } = this.scene.input;

    return (
      this.cursors.up.isDown ||
      this.cursors.space.isDown ||
      (activePointer.isDown && activePointer.wasTouch)
    );
  }
}

export default InputManager;
