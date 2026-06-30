import * as esbuild from "esbuild";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const banner =
  "/*! Webflow consent configurator | (c) 2026 Webflow, Inc. | MIT | https://github.com/Webflow-Examples/consent-configurator */";

const result = await esbuild.build({
  entryPoints: ["src/entry.jsx"],
  bundle: true,
  minify: true,
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  alias: { "lucide-react": new URL("./src/lucide-shim.jsx", import.meta.url).pathname },
  banner: { js: banner },
  write: false,
  outfile: "dist/app.js",
});

const js = result.outputFiles[0].text.replace(/<\/script/g, "<\\/script");
const shell = readFileSync(new URL("./src/shell.html", import.meta.url), "utf8");
mkdirSync(new URL("./dist/", import.meta.url), { recursive: true });
writeFileSync(new URL("./dist/index.html", import.meta.url), shell.replace("__APP__", () => js), "utf8");
console.log("Built dist/index.html");
