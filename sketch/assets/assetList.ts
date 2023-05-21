import { Size } from "../lib/helpers";

export interface AssetSettings {
  columns: number;
  originalTileSize: Size;
  path: string;
}

export const AssetList: Record<string, AssetSettings> = {
  PlayerSprite: {
    columns: 8,
    originalTileSize: {
      width: 128,
      height: 256,
    },
    path: "./img/spritesheet_players.png",
  },
};
