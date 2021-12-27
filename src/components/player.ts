import Phaser from 'phaser';

export const PLAYER_KEY = 'player';

const PLAYER_SPEED = 200;

export default class Player {
  player: Phaser.GameObjects.Sprite;
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.player = this.createPlayer();
  }

  get gameObject() {
    return this.player;
  }

  public updatePosition(cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys) {
    const dx =
      (cursorKeys.left.isDown && -PLAYER_SPEED) ||
      (cursorKeys.right.isDown && PLAYER_SPEED) ||
      0;

    const dy =
      (cursorKeys.up.isDown && -PLAYER_SPEED) ||
      (cursorKeys.down.isDown && PLAYER_SPEED) ||
      0;

    // @ts-ignore
    this.player.body.setVelocity(dx, dy);
  }

  private createPlayer(): Phaser.GameObjects.Sprite {
    const player = this.scene.add.sprite(32, 32, 'player');
    this.scene.physics.add.existing(player);

    // @ts-ignore
    player.body.setCollideWorldBounds(true);
    return player;
  }
}
