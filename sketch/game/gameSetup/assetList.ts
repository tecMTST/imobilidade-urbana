interface AssetSettings {
  columns: number;
  originalTileSize: Size;
  path: string;
  type: "audio" | "image";
  name: string;
}

const AssetList: { [key: string]: AssetSettings } = {
  VolumeOff: {
    columns: 1,
    originalTileSize: {
      width: 32,
      height: 32,
    },
    path: "./assets/img/mudo branco.png",
    type: "image",
    name: "VolumeOff",
  },
  Volume: {
    columns: 1,
    originalTileSize: {
      width: 32,
      height: 32,
    },
    path: "./assets/img/volume branco.png",
    type: "image",
    name: "Volume",
  },
  Timer: {
    columns: 1,
    originalTileSize: {
      width: 32,
      height: 32,
    },
    path: "./assets/img/timer preto.png",
    type: "image",
    name: "Timer",
  },
  Tutorial2: {
    columns: 10,
    originalTileSize: {
      width: 32,
      height: 32,
    },
    path: "./assets/img/tela tutorial 2.png",
    type: "image",
    name: "Tutorial2",
  },
  Tutorial1: {
    columns: 10,
    originalTileSize: {
      width: 32,
      height: 32,
    },
    path: "./assets/img/tela tutorial 1.png",
    type: "image",
    name: "Tutorial1",
  },
  Brilho: {
    columns: 10,
    originalTileSize: {
      width: 32,
      height: 32,
    },
    path: "./assets/img/brilho.png",
    type: "image",
    name: "Brilho",
  },
  RisadaSFX: {
    columns: 1,
    originalTileSize: {
      width: 288,
      height: 512,
    },
    path: "./assets/sound/risada.mp3",
    type: "audio",
    name: "RisadaSFX",
  },
  OST: {
    columns: 1,
    originalTileSize: {
      width: 288,
      height: 512,
    },
    path: "./assets/sound/qtf.mp3",
    type: "audio",
    name: "OST",
  },
  PracaDaSe: {
    columns: 1,
    originalTileSize: {
      width: 288,
      height: 512,
    },
    path: "./assets/img/praca_da_se.png",
    type: "image",
    name: "PracaDaSe",
  },
  MarmitaEntregueAlt: {
    columns: 2,
    originalTileSize: {
      width: 32,
      height: 64,
    },
    path: "./assets/sound/marmita_entrega_2.wav",
    type: "audio",
    name: "MarmitaEntregueAlt",
  },
  MarmitaEntregue: {
    columns: 2,
    originalTileSize: {
      width: 32,
      height: 64,
    },
    path: "./assets/sound/marmita_entrega_1.wav",
    type: "audio",
    name: "MarmitaEntregue",
  },
  SireneCurta: {
    columns: 2,
    originalTileSize: {
      width: 32,
      height: 64,
    },
    path: "./assets/sound/sirene_curta_2.wav",
    type: "audio",
    name: "SireneCurta",
  },
  MarmitaPerdida: {
    columns: 2,
    originalTileSize: {
      width: 32,
      height: 64,
    },
    path: "./assets/sound/marmita_perdida.wav",
    type: "audio",
    name: "MarmitaPerdida",
  },
  RetiradaSFX: {
    columns: 2,
    originalTileSize: {
      width: 32,
      height: 64,
    },
    path: "./assets/sound/marmita_retirada.wav",
    type: "audio",
    name: "RetiradaSFX",
  },
  SireneDerrotaSFX: {
    columns: 2,
    originalTileSize: {
      width: 32,
      height: 64,
    },
    path: "./assets/sound/sirene_longa_1.wav",
    type: "audio",
    name: "SireneDerrotaSFX",
  },
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
    columns: 5,
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
      width: 288,
      height: 512,
    },
    path: "./assets/img/tela inicio.png",
    type: "image",
    name: "TitleScreen",
  },
  Vitoria: {
    columns: 1,
    originalTileSize: {
      width: 288,
      height: 512,
    },
    path: "./assets/img/tela vitoria.png",
    type: "image",
    name: "Vitoria",
  },
  Derrota: {
    columns: 1,
    originalTileSize: {
      width: 288,
      height: 512,
    },
    path: "./assets/img/tela derrota.png",
    type: "image",
    name: "Derrota",
  },
} as const;
