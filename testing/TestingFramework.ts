/**
 * 🧪 TESTING FRAMEWORK SETUP
 * 
 * Configuration et utilitaires pour les tests automatisés
 * de l'application TalkKin.
 */

// Jest configuration object
export const jestConfig = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js|jsx)',
    '**/?(*.)+(spec|test).(ts|tsx|js|jsx)',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@expo|expo-.*)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/testing/setupTests.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/testing/**',
    '!src/**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'identity-obj-proxy',
  },
};

// Package.json scripts for testing
export const testingScripts = {
  'test': 'jest',
  'test:watch': 'jest --watch',
  'test:coverage': 'jest --coverage',
  'test:ci': 'jest --ci --coverage --watchAll=false',
  'test:update': 'jest --updateSnapshot',
  'test:debug': 'jest --no-cache --detectOpenHandles',
  'lint': 'eslint "src/**/*.{ts,tsx}" --fix',
  'type-check': 'tsc --noEmit',
  'test:e2e': 'playwright test',
};

// Required dependencies for testing
export const testingDependencies = {
  devDependencies: {
    '@testing-library/react-native': '^12.0.0',
    '@testing-library/jest-native': '^5.4.0',
    '@testing-library/user-event': '^14.4.0',
    'jest': '^29.5.0',
    'jest-environment-jsdom': '^29.5.0',
    '@types/jest': '^29.5.0',
    'react-test-renderer': '^18.2.0',
    '@playwright/test': '^1.35.0',
    'msw': '^1.2.0', // Mock Service Worker
    'jest-expo': '^49.0.0',
  },
};

// ESLint configuration for testing
export const eslintTestingConfig = {
  extends: [
    '@expo/eslint-config',
    'plugin:testing-library/react',
    'plugin:jest/recommended',
  ],
  plugins: ['testing-library', 'jest'],
  rules: {
    'testing-library/await-async-query': 'error',
    'testing-library/no-await-sync-query': 'error',
    'testing-library/no-debugging-utils': 'warn',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
  },
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*'],
      env: {
        jest: true,
      },
    },
  ],
};

// TypeScript configuration for testing
export const tsConfigTesting = {
  extends: './tsconfig.json',
  compilerOptions: {
    types: ['jest', '@testing-library/jest-native'],
  },
  include: [
    'src/**/*',
    '__tests__/**/*',
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.spec.ts',
    '**/*.spec.tsx',
  ],
};

// Playwright configuration
export const playwrightConfig = {
  testDir: './e2e',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8083',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...require('@playwright/test').devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...require('@playwright/test').devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...require('@playwright/test').devices['Desktop Safari'],
      },
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...require('@playwright/test').devices['Pixel 5'],
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...require('@playwright/test').devices['iPhone 12'],
      },
    },
  ],
  webServer: {
    command: 'npm start',
    port: 8083,
    reuseExistingServer: !process.env.CI,
  },
};

// GitHub Actions workflow for CI/CD
export const githubActionsWorkflow = `
name: CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Type check
      run: npm run type-check
    
    - name: Lint
      run: npm run lint
    
    - name: Run tests
      run: npm run test:ci
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
    
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    
    - name: Run Playwright tests
      run: npm run test:e2e
    
    - uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30

  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js 18.x
      uses: actions/setup-node@v3
      with:
        node-version: 18.x
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Bundle analysis
      run: npm run analyze
`;

// Documentation for testing best practices
export const testingDocumentation = `
# 🧪 GUIDE DES TESTS TALKKIN

## Structure des Tests

\`\`\`
src/
├── components/
│   ├── __tests__/
│   │   ├── HomePage.test.tsx
│   │   ├── TranslatorPage.test.tsx
│   │   └── NavigationBar.test.tsx
│   └── ...
├── hooks/
│   ├── __tests__/
│   │   ├── useTranslation.test.ts
│   │   └── useResponsive.test.ts
│   └── ...
├── utils/
│   ├── __tests__/
│   │   ├── LazyLoader.test.tsx
│   │   └── MemoryOptimization.test.ts
│   └── ...
└── testing/
    ├── setupTests.ts
    ├── mocks/
    ├── fixtures/
    └── utils/
\`\`\`

## Types de Tests

### 1. Tests Unitaires
- Composants isolés
- Hooks personnalisés
- Fonctions utilitaires
- Services

### 2. Tests d'Intégration
- Navigation entre pages
- Context providers
- API interactions
- State management

### 3. Tests E2E
- Parcours utilisateur complets
- Performance
- Accessibilité
- Responsive design

## Commandes

\`\`\`bash
# Lancer tous les tests
npm test

# Mode watch
npm run test:watch

# Coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# Lint et type check
npm run lint
npm run type-check
\`\`\`

## Best Practices

1. **AAA Pattern**: Arrange, Act, Assert
2. **Descriptive names**: Tests qui décrivent le comportement
3. **Isolated tests**: Chaque test est indépendant
4. **Mock external dependencies**: APIs, services externes
5. **Test behavior, not implementation**: Focus sur l'UX
`;

export default {
  jestConfig,
  testingScripts,
  testingDependencies,
  eslintTestingConfig,
  tsConfigTesting,
  playwrightConfig,
  githubActionsWorkflow,
  testingDocumentation,
};
