import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { HOME_SCENE_ASSETS } from "./home-scene-assets";

describe("HOME_SCENE_ASSETS", () => {
  it("points the main scene at the uploaded empty island GLB", () => {
    expect(HOME_SCENE_ASSETS.island.path).toBe("/models/emtyisland.glb");
  });

  it("uses an existing GLB file from the blog public models directory", () => {
    const publicPath = path.join(
      process.cwd(),
      "public",
      HOME_SCENE_ASSETS.island.path.replace(/^\//, ""),
    );

    expect(fs.existsSync(publicPath)).toBe(true);
  });

  it("keeps the uploaded island metadata centered for island-first scenes", () => {
    expect(HOME_SCENE_ASSETS.island.scale).toBeLessThan(0.01);
    expect(HOME_SCENE_ASSETS.island.position).toEqual([0, 0, 0]);
  });
});
