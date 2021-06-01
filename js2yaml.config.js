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
