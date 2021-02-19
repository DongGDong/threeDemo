module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  parserOptions: {
    parser: "babel-eslint",
    ecmaFeatures: { legacyDecorators: true },
  },
  rules: {
    semi: [process.env.NODE_ENV === "production" ? "warn" : "error", "always"],
    "no-console": "warn",
    "no-debugger": "warn",
  },
};
