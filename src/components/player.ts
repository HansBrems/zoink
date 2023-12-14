import { Vector } from 'matter';
import Phaser from 'phaser';
import { KeyboardMappings } from '~/models/keyboard-mappings';

const PLAYER_SPEED = 80;

export default class Player extends Phaser.Physics.Arcade.Sprite {
  keys: KeyboardMappings;

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
    scene.cameras.main.startFollow(this, true);
    this.keys = this.createKeyboardMappings(scene.input.keyboard!);
    this.playIdleAnim();
  }

  public update() {
    if (this.keys.left.isDown) {
      this.setVelocity(-PLAYER_SPEED, 0);
      this.anims.play('player-walk-right', true);
      this.flipX = true;
    } else if (this.keys.right.isDown) {
      this.setVelocity(PLAYER_SPEED, 0);
      this.anims.play('player-walk-right', true);
      this.flipX = false;
    } else if (this.keys.up.isDown) {
      this.setVelocity(0, -PLAYER_SPEED);
      this.anims.play('player-walk-up', true);
    } else if (this.keys.down.isDown) {
      this.setVelocity(0, PLAYER_SPEED);
      this.anims.play('player-walk-down', true);
    } else {
      this.playIdleAnim();
      this.setVelocity(0, 0);
    }
  }

  private createKeyboardMappings(
    keyboard: Phaser.Input.Keyboard.KeyboardPlugin,
  ): KeyboardMappings {
    return keyboard.addKeys({
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      up: Phaser.Input.Keyboard.KeyCodes.W,
    }) as KeyboardMappings;
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
