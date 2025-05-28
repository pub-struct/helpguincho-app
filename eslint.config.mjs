/* eslint-disable import/no-default-export */
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import pluginReactNative from 'eslint-plugin-react-native'
import importPlugin from 'eslint-plugin-import'
import { defineConfig } from 'eslint/config'


export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    ...pluginReact.configs.flat.recommended,
    plugins: {
      js,
      react: pluginReact,
      tseslint: tseslint.plugin,
      'react-native': pluginReactNative,
      import: importPlugin
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...pluginReact.configs.flat.recommended.rules,
      // Suas regras personalizadas:
      'import/no-named-as-default': 'error',
      'import/first': 'error',
      'import/newline-after-import': ['error', { count: 2 }],
      'import/no-default-export': 'error',
      'react-native/no-color-literals': 'warn',
      'react-native/no-raw-text': 'error',
      'react-native/no-single-element-style-arrays': 'warn',
      'react-native/no-unused-styles': 'warn',
      'react/self-closing-comp': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-boolean-value': [
        'warn',
        'never',
      ],
      'react/hook-use-state': ['error', { allowDestructuredState: false }],
      'react/jsx-closing-bracket-location': ['error', {
        nonEmpty: 'tag-aligned',
        selfClosing: 'tag-aligned'
      }],
      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'never',
          children: 'never',
          propElementValues: 'always'
        }
      ],
      'react/jsx-curly-newline': [
        'error',
        {
          multiline: 'consistent',
          singleline: 'consistent',
        },
      ],
      'react/jsx-equals-spacing': ['error', 'never'],
      'react/jsx-indent': [
        'error',
        2,
        { checkAttributes: true, indentLogicalExpressions: true }
      ],
      // 'react/jsx-no-leaked-render': ['error', { validStrategies: ['coerce']}],
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      'react/jsx-props-no-multi-spaces': 'warn',
      'react/jsx-tag-spacing': [
        'warn',
        {
          closingSlash: 'never',
          beforeSelfClosing: 'always',
          afterOpening: 'never',
          beforeClosing: 'never'
        }
      ],
      'tseslint/no-non-null-assertion': 'off',
      'tseslint/no-explicit-any': 'warn',
      'tseslint/no-unused-vars': ['warn', {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      }],
      'no-unused-vars': 'off',
      'no-undef': 'off',
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      'object-curly-spacing': [
        'error',
        'always',
        { objectsInObjects: false, arraysInObjects: false },
      ],
      'space-infix-ops': ['error', { int32Hint: false }],
      'keyword-spacing': ['error', { before: true, after: true }]
    },
  },
])
