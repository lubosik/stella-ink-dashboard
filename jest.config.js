const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
  ],
  collectCoverageFrom: [
    'lib/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  // Exclude other projects from scanning
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/outputs/',
    '/scripts/',
    '/tokens/',
    '/.cursor/',
    '/.vscode/',
    '/Library/',
    '/Ansh and Riley/',
    '/File Easy/',
    '/Localbizzlist/',
    '/VillageBankPro/',
    '/NextGen Automation/',
    '/ga-dashboard/',
  ],
  // Only scan files in the current project
  roots: ['<rootDir>'],
  // Ignore other package.json files
  modulePathIgnorePatterns: [
    '/.cursor/',
    '/.vscode/',
    '/Library/',
    '/Ansh and Riley/',
    '/File Easy/',
    '/Localbizzlist/',
    '/VillageBankPro/',
    '/NextGen Automation/',
    '/ga-dashboard/',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config);
