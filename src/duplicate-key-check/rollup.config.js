/* eslint-disable no-undef */
import typescript from "rollup-plugin-typescript2";
import pkgJson from "./package.json";
import del from "rollup-plugin-delete";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import analyze from "rollup-plugin-analyzer";
import { terser } from "rollup-plugin-terser";

const devMode = process.env.NODE_ENV === "dev";
console.log(`${devMode ? "dev" : "prod"} mode bundle`);

export default {
  input: "src/index.ts",
  watch: {
    include: "./src/**",
    clearScreen: false,
  },
  output: [
    {
      file: pkgJson.main,
      format: "esm",
      sourcemap: devMode ? "inline" : false,
      plugins: [
        terser({
          ecma: 2020,
          mangle: { toplevel: true },
          compress: {
            module: true,
            toplevel: true,
            unsafe_arrows: true,
            drop_console: !devMode,
            drop_debugger: !devMode,
          },
          output: { quote_style: 1 },
        }),
      ],
    },
  ],
  external: ["node-fetch", "guid-typescript", "@microsoft/signalr"],
  plugins: [
    del({ targets: "dist/*" }),
    peerDepsExternal(),
    typescript(),
    analyze(),
  ],
};
