import { Mrpas } from 'mrpas';
import Player from '~/components/player';

export function computeFov(
  fov: Mrpas,
  map: Phaser.Tilemaps.Tilemap,
  floorLayer: Phaser.Tilemaps.TilemapLayer,
  player: Player,
  camera: Phaser.Cameras.Scene2D.Camera,
) {
  if (!fov || !map || !floorLayer || !player) {
    return;
  }

  const bounds = new Phaser.Geom.Rectangle(
    map.worldToTileX(camera.worldView.x)! - 1,
    map.worldToTileY(camera.worldView.y)! - 1,
    map.worldToTileX(camera.worldView.width)! + 2,
    map.worldToTileX(camera.worldView.height)! + 3,
  );

  // set all tiles within camera view to invisible
  for (let y = bounds.y; y < bounds.y + bounds.height; y++) {
    for (let x = bounds.x; x < bounds.x + bounds.width; x++) {
      if (y < 0 || y >= map.height || x < 0 || x >= map.width) {
        continue;
      }

      const tile = floorLayer.getTileAt(x, y);
      if (!tile) {
        continue;
      }

      tile.alpha = 1;
      tile.tint = 0x404040;
    }
  }

  const px = map.worldToTileX(player.x)!;
  const py = map.worldToTileY(player.y)!;

  fov.compute(
    px,
    py,
    4,
    (x, y) => {
      const tile = floorLayer!.getTileAt(x, y);
      if (!tile) {
        return false;
      }
      return tile.tint === 0xffffff;
    },
    (x, y) => {
      const tile = floorLayer.getTileAt(x, y);
      if (!tile) {
        return;
      }
      const d = Phaser.Math.Distance.Between(py, px, y, x);
      const alpha = Math.min(2 - d / 3, 1);

      tile.tint = 0xffffff;
      tile.alpha = alpha;
    },
  );
}

export function createFov(
  map: Phaser.Tilemaps.Tilemap,
  floorLayer: Phaser.Tilemaps.TilemapLayer,
): Mrpas {
  return new Mrpas(map.width, map.height, (x, y) => {
    const tile = floorLayer.getTileAt(x, y);
    return tile && !tile.collides;
  });
}
