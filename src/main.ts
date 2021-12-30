import Phaser from 'phaser';
import BootScene from './scenes/bootScene';
import GameScene from './scenes/gameScene';
import InventoryScene from './scenes/inventoryScene';

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
  scene: [BootScene, GameScene, InventoryScene],
};

export default new Phaser.Game(config);
