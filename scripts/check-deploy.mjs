import { readFile, access } from "node:fs/promises";
import assert from "node:assert/strict";
const config = JSON.parse(await readFile("dist/server/wrangler.json", "utf8"));
assert.equal(config.name, "iyamarlene");
assert.equal(config.workers_dev, true);
assert.equal(config.preview_urls, false);
assert.equal(config.main, "index.js");
assert.equal(config.assets.directory, "../client");
assert.ok(config.compatibility_flags.includes("nodejs_compat"));
await access("dist/server/index.js");
await access("dist/client/favicon.svg");
for (const name of ["robots.txt", "sitemap.xml"]) {
  await assert.rejects(
    access(`dist/client/${name}`),
    "SEO files must be handled dynamically by the Worker",
  );
}
const source = await readFile("wrangler.jsonc", "utf8");
assert.ok(
  !source.includes('"routes"'),
  "Custom domain must remain opt-in until authorization",
);
console.log(
  "PASS: local Worker artifact, assets, runtime flags and publication guards. No remote operation performed.",
);
