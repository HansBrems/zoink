import Phaser from 'phaser';
import Player from '../components/player';
import Npc from '../components/npc';
import * as MapKeys from '../constants/mapKeys';
import * as SceneKeys from '../constants/sceneKeys';
import * as SpriteKeys from '../constants/spriteKeys';
import * as TileKeys from '../constants/tileKeys';
import { debugDraw } from '../utils/debug';

export default class GameScene extends Phaser.Scene {
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  player: Player;

  constructor() {
    super(SceneKeys.GameScene);
  }

  create() {
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    const map = this.make.tilemap({ key: MapKeys.MAP01 });
    const tileset = map.addTilesetImage('dungeon', TileKeys.DUNGEON);
    map.createLayer('Floor', tileset);
    map.createLayer('FloorObjects', tileset);
    const objectsLayer = map.createLayer('Objects', tileset);
    objectsLayer.setCollisionByProperty({ collides: true });

    this.player = new Player(this, SpriteKeys.PLAYER);
    this.cameras.main.startFollow(this.player.gameObject, true);

    new Npc(this, SpriteKeys.CHORT, 50, 50);
    new Npc(this, SpriteKeys.IMP, 50, 75);
    new Npc(this, SpriteKeys.LIZARD, 50, 100);
    new Npc(this, SpriteKeys.MUDDY, 100, 50);
    new Npc(this, SpriteKeys.SWAMPY, 100, 75);
    new Npc(this, SpriteKeys.DEMON, 150, 50);
    new Npc(this, SpriteKeys.ZOMBIE, 150, 100);

    const wallsLayer = map.createLayer('Walls', tileset);
    wallsLayer.setCollisionByProperty({ collides: true });

    debugDraw(wallsLayer, this);

    this.physics.add.collider(this.player.gameObject, wallsLayer);
    this.physics.add.collider(this.player.gameObject, objectsLayer);
  }

  update() {
    this.player.updatePosition(this.cursorKeys);
  }
}
