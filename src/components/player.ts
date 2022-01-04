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
      if (this.player.body.velocity.y < 0) {
        this.player.anims.play('player-idle-up', true);
      } else if (this.player.body.velocity.y > 0) {
        this.player.anims.play('player-idle-down', true);
      } else if (this.player.body.velocity.x > 0) {
        this.player.anims.play('player-idle-right', true);
      } else if (this.player.body.velocity.x < 0) {
        this.player.anims.play('player-idle-right', true);
      }

      this.player.setVelocity(0, 0);
    }
  }

  private createPlayer(): Phaser.Physics.Arcade.Sprite {
    const player = this.scene.physics.add.sprite(
      20,
      20,
      this.key,
      'walk-down/walk-down-1.png',
    );
    player.body.setSize(player.width * 0.5, player.height * 0.8);

    this.scene.anims.create({
      key: 'player-idle-right',
      frames: [{ key: this.key, frame: 'walk-side/walk-side-1.png' }],
    });

    this.scene.anims.create({
      key: 'player-idle-down',
      frames: [{ key: this.key, frame: 'walk-down/walk-down-1.png' }],
    });

    this.scene.anims.create({
      key: 'player-idle-up',
      frames: [{ key: this.key, frame: 'walk-up/walk-up-1.png' }],
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
    player.body.setCollideWorldBounds(true);
    return player;
  }
}
