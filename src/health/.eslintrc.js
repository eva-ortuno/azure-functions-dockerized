module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: ["plugin:@typescript-eslint/recommended", "@tangany/eslint-config", "prettier"],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    "@typescript-eslint/no-magic-numbers": "off",
    "@typescript-eslint/member-ordering": "off",
  },
};
