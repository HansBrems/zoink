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
import { createFov, computeFov } from '~/utils/fov';

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
    this.fov = createFov(this.map, this.floorLayer);

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
    computeFov(
      this.fov,
      this.map,
      this.floorLayer,
      this.player,
      this.cameras.main,
    );
    this.raiseDebugEvent(time);
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
