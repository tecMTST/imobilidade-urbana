interface AssetSettings {
  columns: number;
  originalTileSize: Size;
  path: string;
  type: "audio" | "image";
  name: string;
}

const AssetList: { [key: string]: AssetSettings } = {
  PlayerSprite: {
    columns: 2,
    originalTileSize: {
      width: 32,
      height: 64,
    },
    path: "./assets/img/tia cozinha-Sheet.png",
    type: "image",
    name: "PlayerSprite",
  },
  Marmita: {
    columns: 1,
    originalTileSize: {
      width: 32,
      height: 32,
    },
    path: "./assets/img/marmita.png",
    type: "image",
    name: "Marmita",
  },
  Carrinho: {
    columns: 1,
    originalTileSize: {
      width: 64,
      height: 64,
    },
    path: "./assets/img/carrinho da marmita.png",
    type: "image",
    name: "Carrinho",
  },
  GoalAsset: {
    columns: 3,
    originalTileSize: {
      width: 32,
      height: 64,
    },
    path: "./assets/img/morador de rua.png",
    type: "image",
    name: "GoalAsset",
  },
  CopAsset: {
    columns: 8,
    originalTileSize: {
      width: 32,
      height: 64,
    },
    path: "./assets/img/gcm-Sheet.png",
    type: "image",
    name: "CopAsset",
  },
  TitleScreen: {
    columns: 1,
    originalTileSize: {
      width: 90,
      height: 160,
    },
    path: "./assets/img/titulo.png",
    type: "image",
    name: "TitleScreen",
  },
  Vitoria: {
    columns: 1,
    originalTileSize: {
      width: 90,
      height: 160,
    },
    path: "./assets/img/vitoria.png",
    type: "image",
    name: "Vitoria",
  },
  Derrota: {
    columns: 1,
    originalTileSize: {
      width: 90,
      height: 160,
    },
    path: "./assets/img/derrota.png",
    type: "image",
    name: "Derrota",
  },
} as const;
