import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { HOME_SCENE_ASSETS } from "./home-scene-assets";

describe("HOME_SCENE_ASSETS", () => {
  it("renders four active islands with home as the bridge hub", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "components", "home", "atelier-room.tsx"),
      "utf8",
    );

    expect(source).toContain('const ACTIVE_ISLAND_IDS = new Set(["home", "castle", "farm", "tower"]);');
    expect(source).toContain('{ from: "home", to: "castle", width: 2.35 }');
    expect(source).toContain('{ from: "home", to: "farm", width: 2.15 }');
    expect(source).toContain('{ from: "home", to: "tower", width: 2.15 }');
    expect(source).not.toContain('{ from: "castle", to: "farm"');
  });

  it("does not render synthetic grass patches or island accents over the GLB island", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "components", "home", "atelier-room.tsx"),
      "utf8",
    );

    expect(source).not.toContain("color={island.grass}");
    expect(source).not.toContain("color={island.patch}");
    expect(source).not.toContain("<IslandAccent island={island} />");
  });

  it("passes each island color palette into the normalized GLB island", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "components", "home", "atelier-room.tsx"),
      "utf8",
    );

    expect(source).toContain("materialPalette: IslandMaterialPalette;");
    expect(source).toContain("materialPalette={island.materialPalette}");
    expect(source).toContain("tintIslandMaterials(clone, materialPalette);");
    expect(source).toContain('Landscape_Remeshed003: "#587b45"');
    expect(source).toContain('Landscape_Remeshed003: "#6c7f42"');
    expect(source).toContain('Landscape_Remeshed003: "#6f8f47"');
    expect(source).toContain('Landscape_Remeshed003: "#46796e"');
  });

  it("uses a cloud sea instead of the old water disk for the sky map", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "components", "home", "atelier-room.tsx"),
      "utf8",
    );

    expect(source).toContain("<CloudSea />");
    expect(source).toContain("function CloudSea()");
    expect(source).not.toContain('color="#2b9bd4"');
    expect(source).not.toContain("transparent opacity={0.72}");
  });

  it("uses opaque unlit materials for the island GLB surface", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "components", "home", "atelier-room.tsx"),
      "utf8",
    );

    expect(source).toContain("new THREE.MeshBasicMaterial");
    expect(source).toContain("transparent: false");
    expect(source).toContain("depthWrite: true");
    expect(source).toContain("solidMaterial.toneMapped = false;");
  });

  it("replaces the overlit island texture with solid material color", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "components", "home", "atelier-room.tsx"),
      "utf8",
    );

    expect(source).toContain("color: tint");
    expect(source).not.toContain("materialClone.color.multiply");
    expect(source).not.toContain("materialClone instanceof THREE.MeshStandardMaterial");
    expect(source).toContain('meshName === "Landscape_Remeshed003"');
  });

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
