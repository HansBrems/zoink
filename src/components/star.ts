import Phaser from 'phaser';

export const STAR_KEY = 'star';

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

  private createStar(): Phaser.GameObjects.Sprite {
    const star = this.scene.physics.add.sprite(
      Phaser.Math.Between(12, 788),
      Phaser.Math.Between(12, 588),
      STAR_KEY,
    );

    return star;
  }
}
