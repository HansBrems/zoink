import Phaser from 'phaser';
import { LIZARD } from '../constants/npcNames';
import { getIdleAnimKey } from '../anims/npcAnims';

export default class Lizard extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);

    this.anims.play(getIdleAnimKey(LIZARD), true);
  }
}
