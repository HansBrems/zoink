import Phaser from 'phaser';

const LAND_KEY = 'land';
const PLAYER_KEY = 'player';
const STAR_KEY = 'star';

const PLAYER_SPEED = 100;
const SPAWN_INTERVAL = 1000;

export default class GameScene extends Phaser.Scene {
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  floor: Phaser.GameObjects.Group | undefined;
  player: Phaser.GameObjects.Image | undefined;
  lastSpawnTime: number | undefined;

  constructor() {
    super('game-scene');
  }

  preload() {
    this.load.image(LAND_KEY, 'assets/land.png');
    this.load.image(PLAYER_KEY, 'assets/player.png');
    this.load.image(STAR_KEY, 'assets/star.png');
  }

  create() {
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.floor = this.createFloor();
    this.player = this.createPlayer();
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

  createPlayer() {
    const player = this.add.image(32, 32, 'player');
    this.physics.add.existing(player);

    // @ts-ignore
    player.body.setCollideWorldBounds(true);
    return player;
  }

  update() {
    this.spawnStar();
    this.updatePlayerPosition();
  }

  spawnStar() {
    if (!this.lastSpawnTime) {
      this.lastSpawnTime = this.time.now;
      return;
    }

    const shouldSpawn = this.time.now - this.lastSpawnTime > SPAWN_INTERVAL;
    if (shouldSpawn) {
      this.lastSpawnTime = this.time.now;
      this.add.image(
        Phaser.Math.Between(12, 788),
        Phaser.Math.Between(12, 588),
        'star',
      );
    }
  }

  updatePlayerPosition() {
    const dx =
      (this.cursorKeys?.left.isDown && -PLAYER_SPEED) ||
      (this.cursorKeys?.right.isDown && PLAYER_SPEED) ||
      0;

    const dy =
      (this.cursorKeys?.up.isDown && -PLAYER_SPEED) ||
      (this.cursorKeys?.down.isDown && PLAYER_SPEED) ||
      0;

    // @ts-ignore
    this.player?.body.setVelocity(dx, dy);
  }
}
