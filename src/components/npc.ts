import Phaser from 'phaser';

export default class Npc {
  key: string;
  npc: Phaser.Physics.Arcade.Sprite;
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, key: string, x: number, y: number) {
    this.key = key;
    this.scene = scene;
    this.npc = this.createNpc(x, y);
  }

  get gameObject() {
    return this.npc;
  }

  private createNpc(x: number, y: number): Phaser.Physics.Arcade.Sprite {
    const npc = this.scene.physics.add.sprite(x, y, 'characters');

    this.scene.anims.create({
      key: `${this.key}-idle-right`,
      frames: this.scene.anims.generateFrameNames('characters', {
        start: 0,
        end: 3,
        prefix: `${this.key}/${this.key}_idle_anim_f`,
        suffix: '.png',
      }),
      frameRate: 10,
      repeat: -1,
    });

    npc.anims.play(`${this.key}-idle-right`, true);

    npc.body.setCollideWorldBounds(true);
    return npc;
  }
}
