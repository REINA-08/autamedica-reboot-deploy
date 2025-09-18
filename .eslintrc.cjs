/* eslint-env node */
module.exports = {
  root: true,
  ignorePatterns: [
    "node_modules/", "dist/", "build/", ".turbo/", ".next/",
    "*.backup.*", "app.backup.*/", "**/*.d.ts",
    "**/.next/**", "**/dist/**", "**/build/**"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.eslint.json"],
    tsconfigRootDir: __dirname,
    sourceType: "module"
  },
  plugins: [
    "@typescript-eslint",
    "import",
    "unused-imports",
    "sonarjs",
    "perfectionist",
    "boundaries",
    "unicorn",
    "jsdoc"
  ],
  settings: {
    "import/resolver": {
      typescript: { project: "./tsconfig.eslint.json" }
    },
    // Mapeo de capas para reglas de "boundaries"
    "boundaries/elements": [
      { "type": "app",     "pattern": "apps/*" },
      { "type": "pkg",     "pattern": "packages/*" },
      { "type": "types",   "pattern": "packages/types/**" },
      { "type": "shared",  "pattern": "packages/shared/**" },
      { "type": "auth",    "pattern": "packages/auth/**" },
      { "type": "hooks",   "pattern": "packages/hooks/**" }
    ]
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      rules: {
        // --- Import hygiene ---
        "import/no-unresolved": "error",
        "import/no-absolute-path": "error",
        "import/no-self-import": "error",
        "import/no-useless-path-segments": ["error", { noUselessIndex: true }],
        "import/no-duplicates": "error",
        "import/first": "error",
        "import/newline-after-import": "error",
        "import/order": ["error", {
          "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
          "newlines-between": "always",
          "alphabetize": { "order": "asc", "caseInsensitive": true }
        }],

        // --- Deep imports prohibidos dentro de @autamedica ---
        "no-restricted-imports": ["error", {
          "patterns": [
            // Fuerza usar los barrels del paquete
            { "group": ["@autamedica/*/src/*", "@autamedica/*/dist/*", "@autamedica/*/**/internal/*"], "message": "Importá desde el barrel del paquete (@autamedica/<pkg>), no deep-imports." }
          ]
        }],

        // --- Dependencias cruzadas y circulares ---
        "import/no-cycle": ["error", { "maxDepth": 1, "ignoreExternal": true }],
        // apps no pueden importar otras apps; packages no pueden importar apps
        "boundaries/no-unknown": "error",
        "boundaries/element-types": ["error", {
          "default": "disallow",
          "rules": [
            { "from": ["app"],   "allow": ["pkg", "types", "shared", "auth", "hooks"] },
            { "from": ["pkg"],   "allow": ["pkg", "types", "shared", "auth", "hooks"] },
            { "from": ["types"], "allow": [] } // @autamedica/types no depende de nadie
          ]
        }],

        // --- Duplicaciones y code smells ---
        "sonarjs/no-duplicate-string": "warn",
        "sonarjs/no-identical-functions": "warn",

        // --- Imports no usados y orden de símbolos ---
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],

        // --- Perfectionist (orden estable de keys y exports) ---
        "perfectionist/sort-interfaces": ["warn", { "type": "natural", "order": "asc" }],
        "perfectionist/sort-objects": ["warn", { "type": "natural", "order": "asc" }],
        "perfectionist/sort-imports": "off", // ya ordena import/order

        // --- NIVEL 1: SEGURIDAD Y CORRECCIÓN (CRÍTICAS PARA SOFTWARE MÉDICO) ---
        "eqeqeq": ["error", "smart"],
        "consistent-return": "error",
        "no-fallthrough": "error",
        "default-case-last": "error",
        "no-implicit-coercion": "error",
        "@typescript-eslint/strict-boolean-expressions": ["error", { "allowNullableObject": true, "allowNullableBoolean": true }],
        "@typescript-eslint/no-unnecessary-condition": "error",
        "@typescript-eslint/no-confusing-void-expression": ["error", { "ignoreArrowShorthand": true }],
        "@typescript-eslint/no-unsafe-enum-comparison": "error",

        // --- NIVEL 2: COMPLEJIDAD CONTROLADA (ADAPTADA PARA LÓGICA MÉDICA) ---
        "complexity": ["warn", 12],
        "max-depth": ["warn", 4],
        "max-params": ["warn", 5],
        "max-nested-callbacks": ["warn", 3],
        "sonarjs/cognitive-complexity": ["warn", 20],
        "max-lines-per-function": ["warn", { "max": 80, "skipComments": true }],
        "max-lines": ["warn", { "max": 350, "skipComments": true }],

        // --- NIVEL 3: CÓDIGO MODERNO Y LIMPIO ---
        "prefer-const": "error",
        "no-var": "error",
        "prefer-template": "error",
        "@typescript-eslint/prefer-nullish-coalescing": ["error", { "ignoreConditionalTests": true }],
        "@typescript-eslint/prefer-optional-chain": "error",
        "@typescript-eslint/no-explicit-any": ["error", { "fixToUnknown": true, "ignoreRestArgs": false }],
        "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/consistent-type-exports": "error",
        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "@typescript-eslint/member-ordering": ["error", { "default": ["signature", "field", "constructor", "method"] }],

        // --- UNICORN RULES (CALIDAD SELECTIVA) ---
        "unicorn/prefer-optional-catch-binding": "error",
        "unicorn/no-useless-undefined": "error",
        "unicorn/prefer-top-level-await": "error",
        "unicorn/prefer-ternary": "error",
        "unicorn/explicit-length-check": "error",
        "unicorn/no-null": "off", // permitir null en software médico
        "unicorn/no-array-reduce": "off", // permitir reduce si se usa bien

        // --- DOCUMENTACIÓN DE APIS MÉDICAS ---
        "jsdoc/require-jsdoc": ["warn", {
          "publicOnly": true,
          "require": {
            "FunctionDeclaration": true,
            "MethodDefinition": true,
            "ArrowFunctionExpression": false,
            "FunctionExpression": false
          },
          "contexts": ["TSInterfaceDeclaration", "TSTypeAliasDeclaration"]
        }],
        "jsdoc/require-param": "warn",
        "jsdoc/require-returns": "warn",
        "jsdoc/check-param-names": "warn",
        "jsdoc/check-types": "warn"
      }
    },
    // Config, scripts y cjs
    {
      files: ["*.cjs", "scripts/**/*.{js,ts,mjs}", "*.mjs", ".eslintrc.cjs"],
      env: { node: true },
      rules: {
        "import/no-commonjs": "off",
        "no-undef": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "no-empty": "off",
        "complexity": "off",
        "max-params": "off",
        "max-lines-per-function": "off",
        "jsdoc/require-jsdoc": "off",
        "@typescript-eslint/strict-boolean-expressions": "off",
        "consistent-return": "off"
      }
    },
    // Tests
    {
      files: ["**/*.test.*", "**/__tests__/**/*"],
      rules: {
        "import/no-extraneous-dependencies": "off"
      }
    }
  ]
};