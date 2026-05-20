/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/tests/**/*.test.ts"],
  moduleNameMapper: {
    "^@routes/(.*)$": "<rootDir>/src/routes/$1",
    "^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
    "^@middlewares/(.*)$": "<rootDir>/src/middlewares/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^mappers$": "<rootDir>/src/mappers",
    "^mappers/(.*)$": "<rootDir>/src/mappers/$1",
    "^schemas$": "<rootDir>/src/schemas",
    "^schemas/(.*)$": "<rootDir>/src/schemas/$1",
    "^ai/(.*)$": "<rootDir>/src/ai/$1",
  },
  clearMocks: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/server.ts",
    "!src/tests/**",
    "!src/types/**",
  ],
  setupFiles: ["<rootDir>/src/tests/setup.ts"],
};
