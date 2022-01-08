import Phaser from 'phaser';
import * as AudioKeys from '../constants/audioKeys';
import * as MapKeys from '../constants/mapKeys';
import * as SceneKeys from '../constants/sceneKeys';
import * as SpriteKeys from '../constants/spriteKeys';
import * as TileKeys from '../constants/tileKeys';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.BootScene);
  }

  preload() {
    // Audio
    this.load.audio(AudioKeys.PICKUP, [
      'assets/sounds/Rise02.ogg',
      'assets/sounds/Rise02.m4a',
    ]);

    this.load.audio(AudioKeys.SPAWN, [
      'assets/sounds/Rise01.ogg',
      'assets/sounds/Rise01.m4a',
    ]);

    // Sprites
    this.load.atlas(
      SpriteKeys.CHARACTERS,
      'characters/characters.png',
      'characters/characters.json',
    );
    this.load.atlas(
      SpriteKeys.PLAYER,
      'character/faune.png',
      'character/faune.json',
    );

    // Tiles
    this.load.image(TileKeys.DUNGEON, 'tiles/dungeon_tiles.png');

    // Maps
    this.load.tilemapTiledJSON(MapKeys.MAP01, 'tiles/dungeon-01.json');
  }

  create() {
    this.add.text(350, 250, 'Loading');

    this.time.delayedCall(
      500,
      () => {
        this.scene.start(SceneKeys.GameScene);
      },
      undefined,
      this,
    );
  }
}
