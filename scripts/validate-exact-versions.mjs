import { readFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const failures = [];
const exactPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

for (const group of ["dependencies", "devDependencies", "optionalDependencies"]) {
  for (const [name, version] of Object.entries(manifest[group] ?? {})) {
    if (!exactPattern.test(version)) failures.push(`${group}.${name} must use an exact semantic version, received ${version}`);
  }
}
if (!/^pnpm@\d+\.\d+\.\d+$/.test(manifest.packageManager ?? "")) failures.push("packageManager must pin an exact pnpm version");
if (manifest.engines?.pnpm !== manifest.packageManager?.replace("pnpm@", "")) failures.push("engines.pnpm must match packageManager");
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("all dependencies and package manager versions are exact");
