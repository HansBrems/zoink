import Phaser from 'phaser';

export default class Inventory {
  scene: Phaser.Scene;
  slots: any[];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.slots = [1, 2, 3];
    this.create();
  }

  private create() {
    this.scene.add.rectangle(160, 540, 300, 100, 0xffffff, 0.1);

    for (let i = 0; i < this.slots.length; i++) {
      this.scene.add
        .rectangle(i * 100 + 60, 540, 100, 100, 0xffffff, 0)
        .setStrokeStyle(2, 0xffffff);
    }
  }
}
