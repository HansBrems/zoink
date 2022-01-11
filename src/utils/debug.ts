import Phaser from 'phaser';

const defaultColor = new Phaser.Display.Color(255, 0, 255);

export function debugDraw(
  layer: Phaser.Tilemaps.TilemapLayer,
  scene: Phaser.Scene,
  color: Phaser.Display.Color = defaultColor,
) {
  const debugGraphics = scene.add.graphics();
  layer.renderDebug(debugGraphics, {
    tileColor: null,
    collidingTileColor: getRenderColor(color, 75),
    faceColor: getRenderColor(color, 255),
  });
}

function getRenderColor(color: Phaser.Display.Color, alpha: number) {
  return new Phaser.Display.Color(color.red, color.green, color.blue, alpha);
}
