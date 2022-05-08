module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: [
    "**/tests/unit/*.ts",
    "**/tests/integration/*.ts"
  ],
  globalSetup: "./tests/helpers/setup.js",
  globalTeardown: "./tests/helpers/teardown.js",
  setupFilesAfterEnv: ["jest-extended/all"]
}