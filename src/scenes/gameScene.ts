import Phaser from 'phaser';
import Player from '../components/player';
import Star from '../components/star';
import * as AudioKeys from '../constants/audioKeys';
import * as MapKeys from '../constants/mapKeys';
import * as SceneKeys from '../constants/sceneKeys';
import * as SpriteKeys from '../constants/spriteKeys';
import * as TileKeys from '../constants/tileKeys';

const SPAWN_INTERVAL = 10000;

export default class GameScene extends Phaser.Scene {
  cash: number = 0;
  cashLabel: Phaser.GameObjects.Text;
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  floor: Phaser.GameObjects.Group;
  inventoryKey: Phaser.Input.Keyboard.Key;
  inventoryScene: Phaser.Scenes.ScenePlugin;
  isInventoryVisible: boolean = false;
  lastSpawnTime: number;
  player: Player;

  constructor() {
    super(SceneKeys.GameScene);
  }

  create() {
    this.cashLabel = this.add.text(600, 16, `Cash: ${this.cash}`);
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

    //this.toggleInventory();
    this.input.keyboard.on('keydown-I', _ => this.toggleInventory());
  }

  update() {
    // Turn off for now
    // this.spawnStar();
    this.player.updatePosition(this.cursorKeys);
  }

  createMap() {}

  collectStar(player, star) {
    this.sound.play(AudioKeys.PICKUP);
    star.destroy();
    // todo: star.disableBody(true, true);

    this.cash += 10;
    this.cashLabel.setText(`Cash: ${this.cash}`);
  }

  spawnStar() {
    if (!this.lastSpawnTime) {
      this.lastSpawnTime = this.time.now;
      return;
    }

    const shouldSpawn = this.time.now - this.lastSpawnTime > SPAWN_INTERVAL;
    if (shouldSpawn) {
      this.lastSpawnTime = this.time.now;

      const star = new Star(this, SpriteKeys.STAR);
      star.addOverlap(this.player.gameObject, this.collectStar);
    }
  }

  toggleInventory() {
    this.isInventoryVisible = !this.isInventoryVisible;

    if (this.isInventoryVisible) {
      this.scene.run(SceneKeys.InventoryScene);
    } else {
      this.scene.setVisible(false, SceneKeys.InventoryScene);
      // or: this.scene.sleep(SceneKeys.InventoryScene);
    }
  }
}
