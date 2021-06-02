/* eslint-disable no-undef */
const { build } = require("esbuild");

// More details about esbuild: https://github.com/evanw/esbuild#command-line-usage
build({
  entryPoints: ["./src/main.js"],
  outfile: "./dist/main.js",
  minify: true, //Remove whitespace, shorten identifiers, and use equivalent but shorter syntax
  bundle: true, // Bundle all dependencies into the output files
  sourcemap: true, // Emit a source map
  format: "esm",
  target: ['esnext']
}).catch(() => process.exit(1));
