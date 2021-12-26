// import Phaser from 'phaser';

export default class BulletSpawner {
  constructor(scene, bulletKey = 'bomb') {
    this._group = scene.physics.add.group();
    this.bulletKey = bulletKey;
  }

  get group() {
    return this._group;
  }

  spawnBullet(x, y, direction) {
    const bullet = this._group.create(x, y, this.bulletKey);

    bullet.setCollideWorldBounds(true);
    bullet.setVelocity(direction * 2000, -100);

    return bullet;
  }
}
