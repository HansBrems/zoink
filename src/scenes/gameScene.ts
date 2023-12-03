import { Mrpas } from 'mrpas';
import Phaser from 'phaser';

import { createNpcAnims } from '~/anims/npcAnims';
import { createPlayerAnims } from '~/anims/playerAnims';
import Player from '~/components/player';
import Imp from '~/components/imp';
import * as NpcNames from '~/constants/npcNames';
import * as MapKeys from '~/constants/mapKeys';
import * as SceneKeys from '~/constants/sceneKeys';
import * as SpriteKeys from '~/constants/spriteKeys';
import * as TileKeys from '~/constants/tileKeys';
import DebugLog from '~/models/debugLog';
import { PlayerKeys } from '~/models/playerKeys';
import { debugDraw } from '~/utils/debug';
import { uiEvents } from '~/utils/eventsCenter';

export default class GameScene extends Phaser.Scene {
  keys: PlayerKeys;
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
    createNpcAnims(this.anims, NpcNames.IMP);
    createPlayerAnims(this.anims);
    this.keys = this.createPlayerKeys(this.input.keyboard!);

    this.scene.run(SceneKeys.GameUIScene);

    // Map
    this.map = this.make.tilemap({ key: MapKeys.MAP01 })!;
    const tileset = this.map.addTilesetImage('dungeon', TileKeys.DUNGEON)!;

    // Floor
    this.floorLayer = this.map.createLayer('Floor', tileset)!;

    // Floor Objects
    this.map.createLayer('FloorObjects', tileset);

    // Objects
    const objectsLayer = this.map.createLayer('Objects', tileset)!;
    objectsLayer.setCollisionByProperty({ collides: true });

    // Fov
    this.fov = this.createFov();

    // Npcs
    const npcs = this.spawnNpcs();

    // Player
    this.player = new Player(this, 90, 60, SpriteKeys.PLAYER);
    this.cameras.main.startFollow(this.player, true);

    // Walls
    const wallsLayer = this.map.createLayer('Walls', tileset)!;
    wallsLayer.setCollisionByProperty({ collides: true });

    // Collisions
    this.physics.add.collider(this.player, wallsLayer);
    this.physics.add.collider(this.player, objectsLayer);
    this.physics.add.collider(npcs, wallsLayer);

    // Debug
    // debugDraw(wallsLayer, this, new Phaser.Display.Color(2, 216, 244));
    // debugDraw(objectsLayer, this, new Phaser.Display.Color(2, 244, 151));
  }

  update(time: number, delta: number) {
    this.player.updatePosition(this.keys);
    this.computeFov();
    this.raiseDebugEvent(time);
  }

  private computeFov() {
    if (!this.fov || !this.map || !this.floorLayer || !this.player) {
      return;
    }

    const camera = this.cameras.main;
    const bounds = new Phaser.Geom.Rectangle(
      this.map.worldToTileX(camera.worldView.x)! - 1,
      this.map.worldToTileY(camera.worldView.y)! - 1,
      this.map.worldToTileX(camera.worldView.width)! + 2,
      this.map.worldToTileX(camera.worldView.height)! + 3,
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

    const px = this.map.worldToTileX(this.player.x)!;
    const py = this.map.worldToTileY(this.player.y)!;

    this.fov.compute(
      px,
      py,
      4,
      (x, y) => {
        const tile = this.floorLayer!.getTileAt(x, y);
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

  private createFov(): Mrpas {
    return new Mrpas(this.map.width, this.map.height, (x, y) => {
      const tile = this.floorLayer.getTileAt(x, y);
      return tile && !tile.collides;
    });
  }

  private createPlayerKeys(
    keyboard: Phaser.Input.Keyboard.KeyboardPlugin,
  ): PlayerKeys {
    return {
      cursorKeys: keyboard!.createCursorKeys(),
      a: keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      w: keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
    };
  }

  private raiseDebugEvent(time: number) {
    if (time - this.lastLogTime < this.logInterval) return;

    const camera = this.cameras.main;
    const log: DebugLog = {
      cameraX: camera.worldView.x,
      cameraY: camera.worldView.y,
      playerX: this.player.x,
      playerY: this.player.y,
      worldHeight: camera.worldView.height,
      worldWidth: camera.worldView.width,
    };
    uiEvents.emit('camera-debug', log);

    this.lastLogTime = time;
  }

  private spawnNpcs(): Phaser.Physics.Arcade.Group {
    const npcs = this.physics.add.group({
      classType: Imp,
      createCallback: go => {
        (go as Imp).body!.onCollide = true;
      },
    });

    for (let i = 0; i < 5; i++) {
      npcs.get(50, 50, SpriteKeys.CHARACTERS);
    }

    return npcs;
  }
}
