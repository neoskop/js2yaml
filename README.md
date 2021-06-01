# js2yaml

This small utility allows you to create configuration files with Javascript and convert them to YAML files on the fly.

## How does it work

To get started, you have to provide a configuration file (e.g. `js2yaml.config.js`). E.g. the following configuration converts Javascript to YAML for Magnolia CMS and is provided as an example in the project:

```js
module.exports = [
  {
    watch: "../magnolia/light-modules/**/*.js",
    processor: {
      // Process incoming JSON (optional)
      json: (json) => {
        return json
      },
      // Process resulting YAML (optional)
      yaml: (yaml) => {
        return (
          "# This file has been auto-generated.\n" +
          yaml
            .replace(/"!content-type": /g, "!content-type:")
            .replace(/"!inherit": /g, "!inherit:")
            .replace(/!override:/g, ": !override")
        )
      },
      // Process resulting filename (optional)
      file: (file) => {
        return file
      },
    },
  },
]
```

Now you can start the file watching process via:

```sh
node js2yaml.js js2yaml.config.js
```
