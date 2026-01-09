const js = require("@eslint/js");

module.exports = [
  {
    files: ["source/**/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        global: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        Jimp: "readonly"
      }
    },
    rules: {
      "indent": ["error", 2],
      "linebreak-style": ["error", "unix"],
      "no-trailing-spaces": ["error"],
      "eol-last": ["error", "always"],
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-trailing-spaces": "error",
      "eol-last": ["error", "always"],
      "no-console": "warn", // Allow console in your code
      "eqeqeq": ["warn", "always"], // Prefer === over ==
      "prefer-const": "warn", // Suggest const instead of let when not reassigned
      "no-var": "warn" // Prefer let/const over var
    }
  },
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "site/**",
      ".git/**",
      "*.min.js"
    ]
  }
];
