interface AssetSettings {
  columns: number;
  originalTileSize: Size;
  path: string;
  type: "audio" | "image";
  name: string;
}

const AssetList: { [key: string]: AssetSettings } = {
  CarroMetro: {
    columns: 1,
    originalTileSize: {
      width: 360,
      height: 142,
    },
    path: "./assets/img/metro_temp.png",
    type: "image",
    name: "CarroMetro",
  },
  TitleScreen: {
    columns: 1,
    originalTileSize: {
      width: 108,
      height: 190,
    },
    path: "./assets/img/tela_inicial.png",
    type: "image",
    name: "TitleScreen",
  },
  PlayerSprite: {
    columns: 1,
    originalTileSize: {
      width: 30,
      height: 60,
    },
    path: "./assets/img/personagem_temp.png",
    type: "image",
    name: "PlayerSprite",
  },
  PedroSprite: {
    columns: 1,
    originalTileSize: {
      width: 30,
      height: 60,
    },
    path: "./assets/img/interacao_0.png",
    type: "image",
    name: "PedroSprite",
  },
  RotateDevice: {
    columns: 1,
    originalTileSize: {
      width: 190,
      height: 108,
    },
    path: "./assets/img/rotate.png",
    type: "image",
    name: "RotateDevice",
  },
  RisadaSFX: {
    columns: 1,
    originalTileSize: {
      width: 288,
      height: 512,
    },
    path: "./assets/sound/bgm_vinheta.wav",
    type: "audio",
    name: "RisadaSFX",
  },
} as const;
