module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: [
    "**/tests/unit/*.ts",
    "**/tests/integration/*.ts"
  ],
  setupFilesAfterEnv: [
    "./tests/helpers/setup.js",
    "jest-extended/all"
  ]
}
