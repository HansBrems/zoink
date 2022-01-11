import Phaser from 'phaser';
import { Mrpas } from 'mrpas';
import { createNpcAnims } from '../anims/npcAnims';
import Player from '../components/player';
import Imp from '../components/imp';
import { uiEvents } from '../utils/eventsCenter';
import * as NpcNames from '../constants/npcNames';
import * as MapKeys from '../constants/mapKeys';
import * as SceneKeys from '../constants/sceneKeys';
import * as SpriteKeys from '../constants/spriteKeys';
import * as TileKeys from '../constants/tileKeys';
import DebugLog from '../models/debugLog';
import { debugDraw } from '../utils/debug';

export default class GameScene extends Phaser.Scene {
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  floorLayer: Phaser.Tilemaps.TilemapLayer;
  fov: Mrpas;
  map: Phaser.Tilemaps.Tilemap;
  player: Player;

  // Debugging
  logInterval: number = 250;
  lastLogTime: number = 0;

  constructor() {
    super(SceneKeys.GameScene);
  }

  create() {
    this.scene.run(SceneKeys.GameUIScene);

    createNpcAnims(this.anims, NpcNames.IMP);

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.map = this.make.tilemap({ key: MapKeys.MAP01 });
    const tileset = this.map.addTilesetImage('dungeon', TileKeys.DUNGEON);
    this.floorLayer = this.map.createLayer('Floor', tileset);
    this.map.createLayer('FloorObjects', tileset);
    const objectsLayer = this.map.createLayer('Objects', tileset);
    objectsLayer.setCollisionByProperty({ collides: true });

    var imps = this.physics.add.group({
      classType: Imp,
      createCallback: go => {
        (go as Imp).body.onCollide = true;
      },
    });
    imps.get(50, 50, SpriteKeys.CHARACTERS);
    imps.get(50, 50, SpriteKeys.CHARACTERS);
    imps.get(50, 50, SpriteKeys.CHARACTERS);
    imps.get(50, 50, SpriteKeys.CHARACTERS);

    this.player = new Player(this, SpriteKeys.PLAYER);
    this.cameras.main.startFollow(this.player.gameObject, true);

    const wallsLayer = this.map.createLayer('Walls', tileset);
    wallsLayer.setCollisionByProperty({ collides: true });

    this.fov = new Mrpas(this.map.width, this.map.height, (x, y) => {
      const tile = this.floorLayer.getTileAt(x, y);
      return tile && !tile.collides;
    });

    debugDraw(wallsLayer, this, new Phaser.Display.Color(2, 216, 244));
    debugDraw(objectsLayer, this, new Phaser.Display.Color(2, 244, 151));

    this.physics.add.collider(this.player.gameObject, wallsLayer);
    this.physics.add.collider(this.player.gameObject, objectsLayer);
    this.physics.add.collider(imps, wallsLayer);
  }

  update(time: number, delta: number) {
    this.player.updatePosition(this.cursorKeys);
    this.computeFov();
    this.raiseDebugEvent(time);
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

  private raiseDebugEvent(time: number) {
    if (time - this.lastLogTime < this.logInterval) return;

    const camera = this.cameras.main;
    const log: DebugLog = {
      cameraX: camera.worldView.x,
      cameraY: camera.worldView.y,
      playerX: this.player.gameObject.x,
      playerY: this.player.gameObject.y,
      worldHeight: camera.worldView.height,
      worldWidth: camera.worldView.width,
    };
    uiEvents.emit('camera-debug', log);

    this.lastLogTime = time;
  }
}
