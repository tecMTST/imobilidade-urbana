interface AssetSettings {
  columns: number;
  originalTileSize: Size;
  path: string;
  type: "audio" | "image";
  name: string;
}

const AssetList: { [key: string]: AssetSettings } = {
  PlayerSprite: {
    columns: 8,
    originalTileSize: {
      width: 128,
      height: 256,
    },
    path: "./assets/img/player.png",
    type: "image",
    name: "PlayerSprite",
  },
  Marmita: {
    columns: 1,
    originalTileSize: {
      width: 360,
      height: 360,
    },
    path: "./assets/img/marmita.png",
    type: "image",
    name: "Marmita",
  },
  GoalAsset: {
    columns: 1,
    originalTileSize: {
      width: 360,
      height: 360,
    },
    path: "./assets/img/marmita.png",
    type: "image",
    name: "Marmita",
  },
  CopAsset: {
    columns: 8,
    originalTileSize: {
      width: 128,
      height: 256,
    },
    path: "./assets/img/player.png",
    type: "image",
    name: "PlayerSprite",
  },
} as const;
