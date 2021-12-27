import Phaser from 'phaser';
import Player, { PLAYER_KEY } from '../components/player';
import Star, { STAR_KEY } from '../components/star';

const LAND_KEY = 'land';

const SPAWN_INTERVAL = 10000;

export default class GameScene extends Phaser.Scene {
  cash: number = 0;
  cashLabel: Phaser.GameObjects.Text;
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  floor: Phaser.GameObjects.Group;
  lastSpawnTime: number;
  player: Player;

  constructor() {
    super('game-scene');
  }

  preload() {
    this.load.image(LAND_KEY, 'assets/land.png');
    this.load.image(PLAYER_KEY, 'assets/player.png');
    this.load.image(STAR_KEY, 'assets/star.png');
  }

  create() {
    this.cashLabel = this.add.text(600, 16, `Cash: ${this.cash}`);
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.floor = this.createFloor();
    this.player = new Player(this);
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

      this.physics.add.overlap(
        this.player.gameObject,
        star.gameObject,
        this.collectStar,
        undefined,
        this,
      );
    }
  }

  collectStar(player, star) {
    star.destroy();
    // todo: star.disableBody(true, true);

    this.cash += 10;
    this.cashLabel.setText(`Cash: ${this.cash}`);
  }
}
