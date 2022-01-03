import Phaser from 'phaser';
import * as AudioKeys from '../audioKeys';

export default class Star {
  key: string;
  scene: Phaser.Scene;
  star: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, key: string) {
    this.key = key;
    this.scene = scene;
    this.star = this.createStar();
  }

  get gameObject() {
    return this.star;
  }

  public addOverlap(object, callback) {
    this.scene.physics.add.overlap(
      object,
      this.star,
      callback,
      undefined,
      this.scene,
    );
  }

  private createStar(): Phaser.GameObjects.Sprite {
    const star = this.scene.physics.add.sprite(
      Phaser.Math.Between(12, 788),
      Phaser.Math.Between(12, 588),
      this.key,
    );

    star.alpha = 0;
    this.scene.tweens.add({
      targets: star,
      alpha: 1,
      duration: 200,
      onComplete: () => {
        this.scene.sound.play(AudioKeys.SPAWN);
      },
    });

    return star;
  }
}
