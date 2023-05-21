class Tileset {
  private sourcePath: string;
  private sourceSize: Size;
  private sourceColumns: number;
  private image: p5.Image | undefined;

  static ERROR = {
    NoImage: new Error("No image file in tileset"),
  };

  constructor(
    assetSourcePath: string,
    originalTileSize: Size,
    tilesetColumns: number
  ) {
    this.sourcePath = assetSourcePath;
    this.sourceSize = originalTileSize;
    this.sourceColumns = tilesetColumns;
  }

  preload() {
    this.image = loadImage(this.sourcePath);
  }

  drawTile(n: number, pos: PositionCoordinates, size: Size) {
    const { x, y } = pos;
    let { tileX, tileY } = this.tileNumToPos(n);
    if (this.image === undefined) {
      throwCustomError(Tileset.ERROR.NoImage, `Tile ${n} could not be drawn.`);
    }
    imageMode(CENTER);
    image(
      this.image,
      x,
      y,
      size.width,
      size.height,
      tileX,
      tileY,
      this.sourceSize.width,
      this.sourceSize.height
    );
  }

  tileNumToPos(n: number) {
    return {
      tileX: (n % this.sourceColumns) * this.sourceSize.width,
      tileY: Math.floor(n / this.sourceColumns) * this.sourceSize.width,
    };
  }
}
