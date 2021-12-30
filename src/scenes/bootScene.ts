import Phaser from 'phaser';
import * as SceneKeys from './sceneKeys';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.BootScene);
  }

  preload() {}

  create() {
    this.add.text(350, 250, 'Loading');

    this.time.delayedCall(
      3000,
      () => {
        this.scene.run(SceneKeys.GameScene);
      },
      undefined,
      this,
    );
  }
}
