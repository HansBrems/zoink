import Phaser from 'phaser';

const PLAYER_SPEED = 80;

export default class Player {
  key: string;
  player: Phaser.Physics.Arcade.Sprite;
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, key: string) {
    this.key = key;
    this.scene = scene;
    this.player = this.createPlayer();
  }

  get gameObject() {
    return this.player;
  }

  public updatePosition(cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (cursorKeys.left.isDown) {
      this.player.setVelocity(-PLAYER_SPEED, 0);
      this.player.anims.play('player-walk-right', true);
      this.player.flipX = true;
    } else if (cursorKeys.right.isDown) {
      this.player.setVelocity(PLAYER_SPEED, 0);
      this.player.anims.play('player-walk-right', true);
      this.player.flipX = false;
    } else if (cursorKeys.up.isDown) {
      this.player.setVelocity(0, -PLAYER_SPEED);
      this.player.anims.play('player-walk-up', true);
    } else if (cursorKeys.down.isDown) {
      this.player.setVelocity(0, PLAYER_SPEED);
      this.player.anims.play('player-walk-down', true);
    } else {
      this.playIdleAnim();
      this.player.setVelocity(0, 0);
    }
  }

  private createPlayer(): Phaser.Physics.Arcade.Sprite {
    const player = this.scene.physics.add.sprite(
      90,
      60,
      this.key,
      'walk-down/walk-down-3.png',
    );
    player.body.setSize(player.width * 0.5, player.height * 0.5);

    this.scene.anims.create({
      key: 'player-idle-right',
      frames: [{ key: this.key, frame: 'walk-side/walk-side-3.png' }],
    });

    this.scene.anims.create({
      key: 'player-idle-down',
      frames: [{ key: this.key, frame: 'walk-down/walk-down-3.png' }],
    });

    this.scene.anims.create({
      key: 'player-idle-up',
      frames: [{ key: this.key, frame: 'walk-up/walk-up-3.png' }],
    });

    this.scene.anims.create({
      key: 'player-walk-down',
      frames: this.scene.anims.generateFrameNames(this.key, {
        start: 1,
        end: 8,
        prefix: 'walk-down/walk-down-',
        suffix: '.png',
      }),
      frameRate: 15,
      repeat: -1,
    });

    this.scene.anims.create({
      key: 'player-walk-up',
      frames: this.scene.anims.generateFrameNames(this.key, {
        start: 1,
        end: 8,
        prefix: 'walk-up/walk-up-',
        suffix: '.png',
      }),
      frameRate: 15,
      repeat: -1,
    });

    this.scene.anims.create({
      key: 'player-walk-right',
      frames: this.scene.anims.generateFrameNames(this.key, {
        start: 1,
        end: 8,
        prefix: 'walk-side/walk-side-',
        suffix: '.png',
      }),
      frameRate: 15,
      repeat: -1,
    });

    // @ts-ignore
    player.body.setCollideWorldBounds(false);
    return player;
  }

  private playIdleAnim() {
    const key = this.player.anims.currentAnim?.key;
    if (key) {
      const parts = key.split('-');
      parts[1] = 'idle';
      const newKey = parts.join('-');
      this.player.anims.play(newKey, true);
    }
  }
}
