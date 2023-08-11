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
      width: 393,
      height: 410,
    },
    path: "./assets/img/titulo_temp.png",
    type: "image",
    name: "TitleScreen",
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
