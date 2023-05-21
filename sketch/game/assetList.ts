interface AssetSettings {
  columns: number;
  originalTileSize: Size;
  path: string;
}

const AssetList: Record<string, AssetSettings> = {
  PlayerSprite: {
    columns: 8,
    originalTileSize: {
      width: 128,
      height: 256,
    },
    path: "./assets/img/spritesheet_players.png",
  },
};
