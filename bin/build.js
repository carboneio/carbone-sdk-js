/* eslint-disable no-undef */
const { build } = require("esbuild");

build({
  entryPoints: ["./src/main.js"],
  outfile: "./dist/carboneRenderSDK.js",
  minify: true,
  bundle: true,
}).catch(() => process.exit(1));
