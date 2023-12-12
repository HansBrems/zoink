import Phaser from 'phaser';
import { PlayerKeys } from '~/models/playerKeys';

const PLAYER_SPEED = 80;

export default class Player extends Phaser.Physics.Arcade.Sprite {
  playerKeys: PlayerKeys;

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
    this.body!.setSize(this.width * 0.3, this.height * 0.5);
    this.playerKeys = this.createPlayerKeys(scene.input.keyboard!);
    this.playIdleAnim();
    scene.cameras.main.startFollow(this, true);
  }

  public updatePosition() {
    if (this.playerKeys.a.isDown) {
      this.setVelocity(-PLAYER_SPEED, 0);
      this.anims.play('player-walk-right', true);
      this.flipX = true;
    } else if (this.playerKeys.d.isDown) {
      this.setVelocity(PLAYER_SPEED, 0);
      this.anims.play('player-walk-right', true);
      this.flipX = false;
    } else if (this.playerKeys.w.isDown) {
      this.setVelocity(0, -PLAYER_SPEED);
      this.anims.play('player-walk-up', true);
    } else if (this.playerKeys.s.isDown) {
      this.setVelocity(0, PLAYER_SPEED);
      this.anims.play('player-walk-down', true);
    } else {
      this.playIdleAnim();
      this.setVelocity(0, 0);
    }
  }

  private createPlayerKeys(
    keyboard: Phaser.Input.Keyboard.KeyboardPlugin,
  ): PlayerKeys {
    return {
      cursorKeys: keyboard!.createCursorKeys(),
      a: keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      w: keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
    };
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
