import Phaser from 'phaser';
import * as SceneKeys from '../constants/sceneKeys';
import { uiEvents } from '../utils/eventsCenter';

import Label from '../components/label';
import DebugLog from '../models/debugLog';

export default class GameUIScene extends Phaser.Scene {
  cameraX: Label;
  cameraY: Label;
  playerX: Label;
  playerY: Label;
  width: Label;
  height: Label;

  constructor() {
    super(SceneKeys.GameUIScene);
  }

  create() {
    this.add.rectangle(50, 75, 100, 150, 0xffffff);
    this.add.rectangle(50, 75, 96, 146, 0x000000, 50);

    this.cameraX = new Label(this, 5, 5, 'cx', 0);
    this.cameraY = new Label(this, 5, 30, 'cy', 0);
    this.playerX = new Label(this, 5, 55, 'px', 0);
    this.playerY = new Label(this, 5, 80, 'py', 0);
    this.height = new Label(this, 5, 105, 'ch', 0);
    this.width = new Label(this, 5, 130, 'cw', 0);

    uiEvents.on('camera-debug', this.handleCameraDebug, this);
  }

  handleCameraDebug(log: DebugLog) {
    this.cameraX.update(log.cameraX);
    this.cameraY.update(log.cameraY);
    this.playerX.update((log.playerX || 0).toFixed(2));
    this.playerY.update((log.playerY || 0).toFixed(2));
    this.height.update(log.worldHeight);
    this.width.update(log.worldWidth);
  }
}
