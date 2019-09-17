export default function loadAssets(scene, assets) {
  Object.keys(assets).forEach(assetKey => {
    const asset = assets[assetKey];
    switch (asset.type) {
      case 'image': {
        scene.load.image(assetKey, asset.source);
        break;
      }

      case 'spritesheet': {
        scene.load.spritesheet(assetKey, asset.source, {
          frameWidth: asset.frameWidth,
          frameHeight: asset.frameHeight,
          frames: asset.frames,
          margin: asset.margin,
          spacing: asset.spacing,
        });
        break;
      }

      case 'tilemap': {
        scene.load.tilemapTiledJSON(assetKey, asset.source);
        break;
      }

      default:
        break;
    }
  });
}
