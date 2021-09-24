import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import { injectManifest } from "rollup-plugin-workbox";
import html from "@open-wc/rollup-plugin-html";
import strip from "@rollup/plugin-strip";
import copy from "rollup-plugin-copy";
import alias from "@rollup/plugin-alias";
import minifyHTML from "rollup-plugin-minify-html-literals";

export default {
  input: "index.html",
  exclude: "api",
  output: {
    dir: "dist",
    format: "es",
  },
  plugins: [
    resolve(),
    minifyHTML(),
    html(),
    alias({
      entries: [
        {
          find: "lit-html/lib/shady-render.js",
          replacement: "node_modules/lit-html/lit-html.js",
        },
      ],
    }),
    terser(),
    strip({
      functions: ["console.log"],
    }),
    copy({
      targets: [
        { src: "assets/**/*", dest: "dist/assets/" },
        { src: "styles/global.css", dest: "dist/styles/" },
        { src: "manifest.json", dest: "dist/" },
        { src: "routes.json", dest: "dist/" },
        { src: ".well-known/assetlinks.json", dest: "dist/.well-known/" },
        {
          src: ".well-known/microsoft-identity-association.json",
          dest: "dist/.well-known/",
        },
        { src: "workers/*", dest: "dist/workers/" },
      ],
    }),
    injectManifest({
      swSrc: "pwabuilder-sw.js",
      swDest: "dist/pwabuilder-sw.js",
      globDirectory: "dist/",
      globPatterns: [
        "styles/*.css",
        "**/*/*.svg",
        "*.js",
        "*.html",
        "assets/**",
        "workers/**",
      ],
    }),
  ],
};
