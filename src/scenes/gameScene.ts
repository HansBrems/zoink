import Phaser from 'phaser';
import Player from '../components/player';
import * as MapKeys from '../constants/mapKeys';
import * as SceneKeys from '../constants/sceneKeys';
import * as SpriteKeys from '../constants/spriteKeys';
import * as TileKeys from '../constants/tileKeys';

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

    const wallsLayer = map.createLayer('Walls', tileset);
    wallsLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player.gameObject, wallsLayer);
    this.physics.add.collider(this.player.gameObject, objectsLayer);
  }

  update() {
    this.player.updatePosition(this.cursorKeys);
  }
}
