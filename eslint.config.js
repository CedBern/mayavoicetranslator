// Configuration ESLint simple pour éviter les erreurs de parsing
export default [
  {
    files: ['**/*.js'],
    ignores: [
      'dist/**',
      'node_modules/**', 
      'cache/**',
      'docs/**',
      'web/**',
      '.expo/**',
      '*.config.js',
      '**/*.tsx',
      '**/*.ts',
      '**/*.jsx',
      'app/**',                    // Tout le dossier app (contient du JSX)
      'App.js'                     // Fichier principal avec JSX
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'off'
    }
  }
];
