/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import commonjs from "@rollup/plugin-commonjs";
import html from "@rollup/plugin-html";
import jsonNodeResolve from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import serve from "rollup-plugin-serve";
import copy from "rollup-plugin-copy";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const typescriptOptions = {
  tsconfig: "tsconfig.examples.json",
};

const isWatchMode = process.argv.includes("--watch");

const examples = fs
  .readdirSync(path.join(__dirname, "examples"))
  .filter((f) => f.endsWith(".ts") && f !== "config.ts")
  .map((f) => f.slice(0, f.length - 3));

const getTemplate = (name) => {
  const templatePath = path.join(__dirname, "examples", `${name}.html`);
  return fs.readFileSync(templatePath, "utf-8");
};

export default examples.map((name, index) => ({
  input: `examples/${name}.ts`,
  plugins: [
    typescript(typescriptOptions),
    commonjs(),
    nodeResolve(),
    jsonNodeResolve(),
    copy({
      targets: [{ src: "examples/index.html", dest: "public/" }],
    }),
    isWatchMode &&
      index == 0 &&
      serve({
        contentBase: "public",
        port: 8080,
        verbose: true,
      }),
  ],
  output: {
    dir: `public/${name}`,
    sourcemap: false,
    plugins: [
      html({
        fileName: `index.html`,
        title: `@googlemaps/markercluster example: ${name}`,
        template: () => getTemplate(name),
      }),
    ],
    manualChunks: (id) => {
      if (id.includes("node_modules")) {
        return "vendor";
      }
    },
    chunkFileNames: "[name].js",
  },
}));
