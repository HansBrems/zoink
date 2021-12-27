import Phaser from 'phaser';
import Inventory from '../components/inventory';

export default class InventoryScene extends Phaser.Scene {
  inventory: Inventory;

  constructor() {
    super('inventory-scene');
  }

  create() {
    this.inventory = new Inventory(this);
  }

  update() {}
}
