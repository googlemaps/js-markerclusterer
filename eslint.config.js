const gts = require("gts");

module.exports = [
  {
    ignores: [
      "**/bazel-*",
      "**/coverage/",
      "**/dist/",
      "**/docs/",
      "**/lib/",
      "**/node_modules/",
      "**/public/",
    ],
  },
  ...gts.map((config) => ({
    ...config,
    rules: {
      ...config.rules,
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          trailingComma: "es5",
        },
      ],
      quotes: ["warn", "double"],
      eqeqeq: ["error", "always"],
    },
  })),
];
