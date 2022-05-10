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
  ],
  // creating and seeding an in-memory mongodb every time takes a bit
  slowTestThreshold: 7
}
