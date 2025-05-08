module.exports = {
  // Extensions for modules
  moduleFileExtensions: ["js", "json", "ts"],
  
  // Root directory for Jest to start looking for files
  rootDir: ".",
  
  // Test environment (can be 'node', 'jsdom', etc.)
  testEnvironment: "node",
  
  // Regex pattern to match test files, this will now match `.spec.ts` files
  testRegex: ".spec.ts$",  // Change from ".e2e-spec.ts$" to ".spec.ts$"
  
  // Transformation setup for TypeScript files using ts-jest
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },

  // Collect coverage for source files, but exclude test files
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.spec.ts', '!src/**/*.e2e-spec.ts'],

  // Coverage reporting settings
  coverageReporters: ['text', 'lcov'],  // You can add more reporters if needed
  
  // Path ignore patterns for certain files
  coveragePathIgnorePatterns: ['/node_modules/'],
  
  // Optionally, specify additional Jest options for better debugging
  verbose: true,
};
