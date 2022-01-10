import Phaser from 'phaser';
import { IMP } from '../constants/npcNames';
import { getRunAnimKey } from '../anims/npcAnims';

enum Direction {
  Left,
  Right,
  Up,
  Down,
}

export default class Imp extends Phaser.Physics.Arcade.Sprite {
  direction: Direction = Direction.Right;
  speed: number = 50;
  lastDirectionChangeTime: number = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);

    this.anims.play(getRunAnimKey(IMP), true);

    scene.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE,
      this.handleTileCollide,
      this,
    );
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.direction === Direction.Left) {
      this.setVelocity(-this.speed, 0);
      this.flipX = true;
    } else if (this.direction === Direction.Right) {
      this.setVelocity(this.speed, 0);
      this.flipX = false;
    } else if (this.direction === Direction.Up) {
      this.setVelocity(0, -this.speed);
    } else if (this.direction === Direction.Down) {
      this.setVelocity(0, this.speed);
    }

    const elapsed = time - this.lastDirectionChangeTime;
    if (elapsed > Phaser.Math.Between(5000, 20000)) {
      this.direction = this.getNewDirection();
      this.lastDirectionChangeTime = time;
    }
  }

  private getNewDirection() {
    const directions = [0, 1, 2, 3].filter(n => n != this.direction);
    const index = Phaser.Math.Between(0, 2);
    return directions[index];
  }

  private handleTileCollide(
    gameObject: Phaser.GameObjects.GameObject,
    tile: Phaser.Tilemaps.Tile,
    body: Phaser.Physics.Arcade.Body,
  ) {
    if (gameObject !== this) return;

    this.direction = this.getNewDirection();
  }
}
