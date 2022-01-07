import Phaser from 'phaser';
import BootScene from './scenes/bootScene';
import GameScene from './scenes/gameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 640,
  height: 320,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, GameScene],
  scale: {
    zoom: 2,
  },
};

export default new Phaser.Game(config);
