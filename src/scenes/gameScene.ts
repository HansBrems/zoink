import Phaser from 'phaser';
import Player, { PLAYER_KEY } from '../components/player';
import Star, { STAR_KEY, SPAWN_SOUND } from '../components/star';

const LAND_KEY = 'land';

const PICKUP_KEY = 'pickup';

const SPAWN_INTERVAL = 5000;

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
    super('game-scene');
  }

  preload() {
    this.load.audio(SPAWN_SOUND, [
      'assets/sounds/Rise01.ogg',
      'assets/sounds/Rise01.m4a',
    ]);
    this.load.audio(PICKUP_KEY, [
      'assets/sounds/Rise02.ogg',
      'assets/sounds/Rise02.m4a',
    ]);

    this.load.image(LAND_KEY, 'assets/land.png');
    this.load.image(PLAYER_KEY, 'assets/player.png');
    this.load.image(STAR_KEY, 'assets/star.png');
  }

  create() {
    this.cashLabel = this.add.text(600, 16, `Cash: ${this.cash}`);
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.floor = this.createFloor();
    this.player = new Player(this);

    //this.toggleInventory();
    this.input.keyboard.on('keydown-I', _ => this.toggleInventory());
  }

  createFloor() {
    return this.add.group({
      classType: Phaser.GameObjects.Image,
      // @ts-ignore
      key: LAND_KEY,
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

      const star = new Star(this);
      star.addOverlap(this.player.gameObject, this.collectStar);
    }
  }

  collectStar(player, star) {
    this.sound.play(PICKUP_KEY);
    star.destroy();
    // todo: star.disableBody(true, true);

    this.cash += 10;
    this.cashLabel.setText(`Cash: ${this.cash}`);
  }

  toggleInventory() {
    this.isInventoryVisible = !this.isInventoryVisible;

    if (this.isInventoryVisible) {
      this.scene.run('inventory-scene');
    } else {
      this.scene.setVisible(false, 'inventory-scene');
      // or: this.scene.sleep('inventory-scene');
    }
  }
}
