import Phaser from 'phaser';
import BootScene from './scenes/bootScene';
import GameScene from './scenes/gameScene';
import InventoryScene from './scenes/inventoryScene';

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
  scene: [BootScene, GameScene, InventoryScene],
  scale: {
    zoom: 2,
  },
};

export default new Phaser.Game(config);
