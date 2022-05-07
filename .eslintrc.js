module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  ignorePatterns: ["dist/**/*"],
  rules: {
    "@typescript-eslint/semi": ["error", "never"],
    "@typescript-eslint/quotes": ["error", "double"],
    "@typescript-eslint/no-empty-interface": "warn"
  }
}