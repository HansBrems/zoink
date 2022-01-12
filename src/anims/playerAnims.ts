import Phaser from 'phaser';
import * as SpriteKeys from '../constants/spriteKeys';

export function createPlayerAnims(anims: Phaser.Animations.AnimationManager) {
  anims.create({
    key: 'player-idle-right',
    frames: [{ key: SpriteKeys.PLAYER, frame: 'walk-side/walk-side-3.png' }],
  });

  anims.create({
    key: 'player-idle-down',
    frames: [{ key: SpriteKeys.PLAYER, frame: 'walk-down/walk-down-3.png' }],
  });

  anims.create({
    key: 'player-idle-up',
    frames: [{ key: SpriteKeys.PLAYER, frame: 'walk-up/walk-up-3.png' }],
  });

  anims.create({
    key: 'player-walk-down',
    frames: anims.generateFrameNames(SpriteKeys.PLAYER, {
      start: 1,
      end: 8,
      prefix: 'walk-down/walk-down-',
      suffix: '.png',
    }),
    frameRate: 15,
    repeat: -1,
  });

  anims.create({
    key: 'player-walk-up',
    frames: anims.generateFrameNames(SpriteKeys.PLAYER, {
      start: 1,
      end: 8,
      prefix: 'walk-up/walk-up-',
      suffix: '.png',
    }),
    frameRate: 15,
    repeat: -1,
  });

  anims.create({
    key: 'player-walk-right',
    frames: anims.generateFrameNames(SpriteKeys.PLAYER, {
      start: 1,
      end: 8,
      prefix: 'walk-side/walk-side-',
      suffix: '.png',
    }),
    frameRate: 15,
    repeat: -1,
  });
}
