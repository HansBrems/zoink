import Phaser from 'phaser';
import BallSpawner from '../spawners/BallSpawner';

const DUDE_KEY = 'dude';
const GROUND_KEY = 'ground';
const STAR_KEY = 'star';

export default class GameScene extends Phaser.Scene {
  ballSpawner;
  ball?: Phaser.GameObjects.Arc;
  light;
  player;
  stars;
  cursors;
  isSpawning = false;

  constructor() {
    super('game-scene');
  }

  preload() {
    this.load.image(GROUND_KEY, 'assets/platform.png');
    this.load.image(STAR_KEY, 'assets/star.png');

    this.load.spritesheet(DUDE_KEY, 'assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.ballSpawner = new BallSpawner(this);

    this.ball = this.createBall();
    const paddleLeft = this.createLeftPaddle();
    const paddleRight = this.createRightPaddle();
    this.player = this.createPlayer();

    this.add.existing(this.ballSpawner.group);

    // Colliders
    this.physics.add.collider(this.ball, paddleLeft);
    this.physics.add.collider(this.ball, paddleRight);

    this.physics.add.collider(this.player, this.ball);
    this.physics.add.collider(this.player, paddleLeft);
    this.physics.add.collider(this.player, paddleRight);

    // Light
    this.light = this.add.pointlight(400, 250, 0xd11bce, 100, 0.1, 0.1);

    // Text
  }

  update() {
    this.updatePlayerPosition();

    this.light.x = this.ball?.x;
    this.light.y = this.ball?.y;
  }

  updatePlayerPosition() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
    } else {
      this.player.setVelocityY(0);
    }

    if (this.cursors.space.isDown && !this.isSpawning) {
      this.isSpawning = true;
      const b = this.ballSpawner.spawn(200, 200);
      b.alpha = 0;
      this.tweens.add({
        targets: b,
        alpha: 1,
        duration: 1000,
        onComplete: () => {
          this.isSpawning = false;
        },
      });

      this.physics.add.collider(this.player, b);
      this.physics.add.collider(this.ball, b);
      this.ballSpawner.group.children.iterate(child => {
        this.physics.add.collider(child, b);
      });
    }
  }

  createBall() {
    const ball = this.add.circle(400, 250, 5, 0x791bd1);
    this.physics.add.existing(ball);
    // @ts-ignore
    ball.body.setBounce(1, 1);
    // @ts-ignore
    ball.body.setCollideWorldBounds(true, 1.02, 1.02);
    // @ts-ignore
    ball.body.setVelocity(160, 0);

    return ball;
  }

  createLeftPaddle() {
    const paddle = this.add.rectangle(50, 300, 10, 300, 0xffffff);
    this.physics.add.existing(paddle, true);
    return paddle;
  }

  createRightPaddle() {
    const paddle = this.add.rectangle(750, 300, 10, 300, 0xffffff);
    this.physics.add.existing(paddle, true);
    return paddle;
  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup();
    platforms.create(200, 584, GROUND_KEY);
    return platforms;
  }

  createPlayer() {
    const player = this.physics.add.sprite(100, 450, DUDE_KEY);

    player.setBounce(0.1);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: DUDE_KEY, frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    return player;
  }

  createStars() {
    const stars = this.physics.add.group({
      key: STAR_KEY,
      repeat: 22,
      setXY: { x: 16, y: 0, stepX: 35, stepY: 5 },
    });

    stars.children.iterate(child => {
      // @ts-ignore
      child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
    });

    return stars;
  }
}
