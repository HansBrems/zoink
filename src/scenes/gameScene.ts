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
import { debugDraw } from '~/utils/debug';
import { uiEvents } from '~/utils/eventsCenter';
import { createFov, computeFov } from '~/utils/fov';

export default class GameScene extends Phaser.Scene {
  // Player
  player: Player;

  // Map
  map: Phaser.Tilemaps.Tilemap;
  floorLayer: Phaser.Tilemaps.TilemapLayer;
  floorObjectsLayer: Phaser.Tilemaps.TilemapLayer;
  objectsLayer: Phaser.Tilemaps.TilemapLayer;
  wallsLayer: Phaser.Tilemaps.TilemapLayer;

  // Fov
  fov: Mrpas;

  // Debugging
  logInterval: number = 250;
  lastLogTime: number = 0;

  constructor() {
    super(SceneKeys.GameScene);
  }

  create() {
    createNpcAnims(this.anims, NpcNames.IMP);
    createPlayerAnims(this.anims);

    this.scene.run(SceneKeys.GameUIScene);

    // Map
    this.map = this.make.tilemap({ key: MapKeys.MAP01 })!;
    const tileset = this.map.addTilesetImage('dungeon', TileKeys.DUNGEON)!;

    // Floor
    this.floorLayer = this.map.createLayer('Floor', tileset)!;
    this.map.createLayer('FloorObjects', tileset);

    // Npcs
    const npcs = this.spawnNpcs();

    // Player
    this.player = new Player(this, 90, 60, SpriteKeys.PLAYER);

    // Objects
    this.objectsLayer = this.map.createLayer('Objects', tileset)!;
    this.objectsLayer.setCollisionByProperty({ collides: true });

    // Walls
    this.wallsLayer = this.map.createLayer('Walls', tileset)!;
    this.wallsLayer.setCollisionByProperty({ collides: true });

    // Collisions
    this.physics.add.collider(this.player, this.wallsLayer);
    this.physics.add.collider(this.player, this.objectsLayer);
    this.physics.add.collider(npcs, this.wallsLayer);
    this.physics.add.collider(npcs, this.objectsLayer);

    // Fov
    this.fov = createFov(this.map, this.floorLayer);

    // Debug
    debugDraw(this.wallsLayer, this, new Phaser.Display.Color(2, 216, 244));
    debugDraw(this.objectsLayer, this, new Phaser.Display.Color(2, 244, 151));
  }

  update(time: number, delta: number) {
    this.player.update();
    computeFov(
      this.fov,
      this.map,
      this.floorLayer,
      this.player,
      this.cameras.main,
    );
    this.raiseDebugEvent(time);
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
