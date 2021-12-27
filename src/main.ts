import Phaser from 'phaser';
import GameScene from './scenes/gameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [GameScene],
};

export default new Phaser.Game(config);
