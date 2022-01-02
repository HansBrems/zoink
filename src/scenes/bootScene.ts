import Phaser from 'phaser';
import * as AssetKeys from '../assetKeys';
import * as SceneKeys from './sceneKeys';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.BootScene);
  }

  preload() {
    this.load.image(AssetKeys.LAND_SPRITE, 'assets/land.png');
    this.load.image(AssetKeys.PLAYER_SPRITE, 'assets/player.png');
    this.load.image(AssetKeys.STAR_SPRITE, 'assets/star.png');
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
