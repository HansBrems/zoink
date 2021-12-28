import Phaser from 'phaser';

export const STAR_KEY = 'star';
export const SPAWN_SOUND = 'spawn-sound';

export default class Star {
  scene: Phaser.Scene;
  star: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene) {
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
      STAR_KEY,
    );

    star.alpha = 0;
    this.scene.tweens.add({
      targets: star,
      alpha: 1,
      duration: 200,
      onComplete: () => {
        this.scene.sound.play(SPAWN_SOUND);
      },
    });

    return star;
  }
}
