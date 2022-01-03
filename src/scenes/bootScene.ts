import Phaser from 'phaser';
import * as SceneKeys from './sceneKeys';
import * as SpriteKeys from '../spriteKeys';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.BootScene);
  }

  preload() {
    this.load.image(SpriteKeys.LAND, 'assets/land.png');
    this.load.image(SpriteKeys.PLAYER, 'assets/player.png');
    this.load.image(SpriteKeys.STAR, 'assets/star.png');
  }

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
