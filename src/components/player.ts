import Phaser from 'phaser';

const PLAYER_SPEED = 80;

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setSize(this.width * 0.3, this.height * 0.5);

    this.playIdleAnim();
  }

  public updatePosition(cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (cursorKeys.left.isDown) {
      this.setVelocity(-PLAYER_SPEED, 0);
      this.anims.play('player-walk-right', true);
      this.flipX = true;
    } else if (cursorKeys.right.isDown) {
      this.setVelocity(PLAYER_SPEED, 0);
      this.anims.play('player-walk-right', true);
      this.flipX = false;
    } else if (cursorKeys.up.isDown) {
      this.setVelocity(0, -PLAYER_SPEED);
      this.anims.play('player-walk-up', true);
    } else if (cursorKeys.down.isDown) {
      this.setVelocity(0, PLAYER_SPEED);
      this.anims.play('player-walk-down', true);
    } else {
      this.playIdleAnim();
      this.setVelocity(0, 0);
    }
  }

  private playIdleAnim() {
    const key = this.anims.currentAnim?.key;

    if (key) {
      const parts = key.split('-');
      parts[1] = 'idle';
      const newKey = parts.join('-');
      this.anims.play(newKey, true);
    } else {
      this.anims.play('player-idle-down', true);
    }
  }
}
