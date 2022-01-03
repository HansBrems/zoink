import Phaser from 'phaser';
import Inventory from '../components/inventory';
import * as SceneKeys from '../constants/sceneKeys';

export default class InventoryScene extends Phaser.Scene {
  inventory: Inventory;

  constructor() {
    super(SceneKeys.InventoryScene);
  }

  create() {
    this.inventory = new Inventory(this);
  }

  update() {}
}
