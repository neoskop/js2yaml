#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const chokidar = require("chokidar");
const yaml = require("yaml");
const { globSync } = require("glob");

let js2yamlConfig;
try {
  js2yamlConfig = require(path.resolve(process.argv[2]));
} catch (e) {
  console.error("Please provide path to configuration file.");
  process.exit(1);
}

js2yamlConfig.forEach((config) => {
  const cache = {};
  const watcher = chokidar.watch(globSync(config.watch));
  watcher.on("change", (path) => {
    try {
      // Build a plain array of watched files
      const files = [];
      Object.keys(watcher.getWatched()).forEach((directory) => {
        watcher.getWatched()[directory].forEach((filename) => {
          files.push(directory + "/" + filename);
        });
      });

      // Prune all watched files from Node cache,
      // otherwise changes won't be reflected.
      files.forEach((file) => {
        delete require.cache[file];
      });

      files
        .filter((file) => /\.y[a]?ml\.js/.test(file))
        .forEach((file) => {
          // Stringify resolves issue with anchors in resulting YAML
          const jsonSource = JSON.parse(JSON.stringify(require(file)));
          const jsonTarget = config.processor?.json
            ? config.processor.json(jsonSource)
            : jsonSource;
          const yamlSource = yaml.stringify(jsonTarget);
          const yamlTarget = config.processor?.yaml
            ? config.processor.yaml(yamlSource)
            : yamlSource;
          if (cache[file] !== yamlTarget) {
            const fileSource = file.replace(/\.js$/, "");
            const fileTarget = config.processor?.file
              ? config.processor.file(fileSource)
              : fileSource;
            fs.writeFileSync(fileTarget, yamlTarget);
            cache[file] = yamlTarget;
            console.info("Updated => " + fileTarget);
          }
        });
    } catch (e) {
      console.error(e);
    }
  });
});
