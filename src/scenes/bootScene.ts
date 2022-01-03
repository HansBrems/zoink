import Phaser from 'phaser';
import * as AudioKeys from '../constants/audioKeys';
import * as SceneKeys from '../constants/sceneKeys';
import * as SpriteKeys from '../constants/spriteKeys';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.BootScene);
  }

  preload() {
    this.load.image(SpriteKeys.LAND, 'assets/land.png');
    this.load.image(SpriteKeys.PLAYER, 'assets/player.png');
    this.load.image(SpriteKeys.STAR, 'assets/star.png');

    this.load.audio(AudioKeys.PICKUP, [
      'assets/sounds/Rise02.ogg',
      'assets/sounds/Rise02.m4a',
    ]);

    this.load.audio(AudioKeys.SPAWN, [
      'assets/sounds/Rise01.ogg',
      'assets/sounds/Rise01.m4a',
    ]);
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
