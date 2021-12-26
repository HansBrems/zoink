import Phaser from 'phaser';

export default class BallSpawner {
  constructor(scene) {
    this.scene = scene;
    this._group = this.scene.physics.add.group();
  }

  get group() {
    return this._group;
  }

  spawn(x, y) {
    const ball = this._group.create(x, y, 'star');

    ball.setBounce(1);
    ball.setCollideWorldBounds(true);

    const dx = Phaser.Math.Between(-200, 200);
    const dy = Phaser.Math.Between(-200, 200);
    ball.setVelocity(dx, dy);

    return ball;
  }
}
