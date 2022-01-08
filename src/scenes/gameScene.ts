import Phaser from 'phaser';
import Player from '../components/player';
import Npc from '../components/npc';
import * as MapKeys from '../constants/mapKeys';
import * as SceneKeys from '../constants/sceneKeys';
import * as SpriteKeys from '../constants/spriteKeys';
import * as TileKeys from '../constants/tileKeys';
import { debugDraw } from '../utils/debug';
import { Mrpas } from 'mrpas';

export default class GameScene extends Phaser.Scene {
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  floorLayer: Phaser.Tilemaps.TilemapLayer;
  fov: Mrpas;
  map: Phaser.Tilemaps.Tilemap;
  player: Player;

  constructor() {
    super(SceneKeys.GameScene);
  }

  create() {
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.map = this.make.tilemap({ key: MapKeys.MAP01 });
    const tileset = this.map.addTilesetImage('dungeon', TileKeys.DUNGEON);
    this.floorLayer = this.map.createLayer('Floor', tileset);
    this.map.createLayer('FloorObjects', tileset);
    const objectsLayer = this.map.createLayer('Objects', tileset);
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

    const wallsLayer = this.map.createLayer('Walls', tileset);
    wallsLayer.setCollisionByProperty({ collides: true });

    this.fov = new Mrpas(this.map.width, this.map.height, (x, y) => {
      const tile = this.floorLayer.getTileAt(x, y);
      return tile && !tile.collides;
    });

    //debugDraw(wallsLayer, this);

    this.physics.add.collider(this.player.gameObject, wallsLayer);
    this.physics.add.collider(this.player.gameObject, objectsLayer);
  }

  update() {
    this.player.updatePosition(this.cursorKeys);
    this.computeFov();
  }

  private computeFov() {
    if (!this.fov || !this.map || !this.floorLayer || !this.player) {
      return;
    }

    const camera = this.cameras.main;
    const bounds = new Phaser.Geom.Rectangle(
      this.map.worldToTileX(camera.worldView.x) - 1,
      this.map.worldToTileY(camera.worldView.y) - 1,
      this.map.worldToTileX(camera.worldView.width) + 2,
      this.map.worldToTileX(camera.worldView.height) + 3,
    );

    // set all tiles within camera view to invisible
    for (let y = bounds.y; y < bounds.y + bounds.height; y++) {
      for (let x = bounds.x; x < bounds.x + bounds.width; x++) {
        if (y < 0 || y >= this.map.height || x < 0 || x >= this.map.width) {
          continue;
        }

        const tile = this.floorLayer.getTileAt(x, y);
        if (!tile) {
          continue;
        }

        tile.alpha = 1;
        tile.tint = 0x404040;
      }
    }

    const px = this.map.worldToTileX(this.player.gameObject.x);
    const py = this.map.worldToTileY(this.player.gameObject.y);

    this.fov.compute(
      px,
      py,
      4,
      (x, y) => {
        const tile = this.floorLayer.getTileAt(x, y);
        if (!tile) {
          return false;
        }
        return tile.tint === 0xffffff;
      },
      (x, y) => {
        const tile = this.floorLayer.getTileAt(x, y);
        if (!tile) {
          return;
        }
        const d = Phaser.Math.Distance.Between(py, px, y, x);
        const alpha = Math.min(2 - d / 3, 1);

        tile.tint = 0xffffff;
        tile.alpha = alpha;
      },
    );
  }
}
