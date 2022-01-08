import Phaser from 'phaser';
import * as SpriteKeys from '../constants/spriteKeys';

export const getIdleAnimKey = (npcName: string) => `${npcName}-idle-right`;
export const getRunAnimKey = (npcName: string) => `${npcName}-run-right`;

export function createNpcAnims(
  anims: Phaser.Animations.AnimationManager,
  npcName: string,
) {
  anims.create({
    key: getIdleAnimKey(npcName),
    frames: anims.generateFrameNames(SpriteKeys.CHARACTERS, {
      start: 0,
      end: 3,
      prefix: `${npcName}/${npcName}_idle_anim_f`,
      suffix: '.png',
    }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: getRunAnimKey(npcName),
    frames: anims.generateFrameNames(SpriteKeys.CHARACTERS, {
      start: 0,
      end: 3,
      prefix: `${npcName}/${npcName}_run_anim_f`,
      suffix: '.png',
    }),
    frameRate: 10,
    repeat: -1,
  });
}
