/* eslint-disable no-undef */
const { build } = require("esbuild");

const config = {
  minify: true, //Remove whitespace, shorten identifiers, and use equivalent but shorter syntax
  bundle: true, // Bundle all dependencies into the output files
  sourcemap: true, // Emit a source map
  target: ["es2020", "chrome58", "firefox57", "safari11", "edge16", "node14"],
};

build({
  ...config,
  entryPoints: ["./src/main.js"],
  outfile: "./dist/main.js",
  format: "cjs",
}).catch(() => process.exit(1));

build({
  ...config,
  entryPoints: ["./src/main.js"],
  outfile: "./dist/main.mjs",
  format: "esm",
}).catch(() => process.exit(1));
