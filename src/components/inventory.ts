import Phaser from 'phaser';

export default class Inventory {
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.create();
  }

  private create() {
    this.scene.add.rectangle(160, 540, 300, 100, 0xffffff, 0.1);
  }
}
