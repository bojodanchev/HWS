import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile, access, rename } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("public");
const output = path.join(root, "optimized");
const widths = [64, 128, 256, 384, 640, 828, 1080, 1440, 1920, 2560, 3840];
const manifest = {};
await mkdir(output, { recursive: true });
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (file === output) continue;
    if (entry.isDirectory()) { await walk(file); continue; }
    if (!/\.(png|jpe?g|webp|avif)$/i.test(file)) continue;
    const bytes = await readFile(file);
    const metadata = await sharp(bytes).metadata();
    if (!metadata.width || (metadata.pages ?? 1) > 1) continue;
    const hash = createHash("sha256").update(bytes).update("webp-q85-v1").digest("hex").slice(0, 20);
    const sizes = [...new Set([...widths.filter(w => w < metadata.width), Math.min(metadata.width, 3840)])];
    for (const width of sizes) {
      const dest = path.join(output, `${hash}-${width}.webp`);
      try { await access(dest); } catch {
        await sharp(bytes).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 85, effort: 4 }).toFile(`${dest}.tmp`);
        await rename(`${dest}.tmp`, dest);
      }
    }
    manifest["/" + path.relative(root, file).split(path.sep).join("/")] = { hash, widths: sizes };
  }
}
await walk(root);
await mkdir("src/generated", { recursive: true });
await writeFile("src/generated/image-manifest.json", JSON.stringify(manifest));
console.log(`Prepared responsive images for ${Object.keys(manifest).length} local sources`);
