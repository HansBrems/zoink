import Phaser from 'phaser';
import Player from '../components/player';
import Star from '../components/star';
import * as AudioKeys from '../constants/audioKeys';
import * as SceneKeys from '../constants/sceneKeys';
import * as SpriteKeys from '../constants/spriteKeys';

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
    this.scene.stop(SceneKeys.BootScene);

    this.cashLabel = this.add.text(600, 16, `Cash: ${this.cash}`);
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.floor = this.createFloor();
    this.player = new Player(this, SpriteKeys.PLAYER);

    //this.toggleInventory();
    this.input.keyboard.on('keydown-I', _ => this.toggleInventory());
  }

  createFloor() {
    return this.add.group({
      classType: Phaser.GameObjects.Image,
      // @ts-ignore
      key: SpriteKeys.LAND,
      quantity: 16,
      gridAlign: {
        width: 4,
        height: 4,
        cellWidth: 32,
        cellHeight: 32,
        x: 16,
        y: 16,
      },
    });
  }

  update() {
    this.spawnStar();
    this.player.updatePosition(this.cursorKeys);
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

  collectStar(player, star) {
    this.sound.play(AudioKeys.PICKUP);
    star.destroy();
    // todo: star.disableBody(true, true);

    this.cash += 10;
    this.cashLabel.setText(`Cash: ${this.cash}`);
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
