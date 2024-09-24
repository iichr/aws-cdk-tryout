// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
    {
    // config with just ignores is the replacement for `.eslintignore`
    ignores: ['**/cdk.out/**', '**/*.js'],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    eslintConfigPrettier,
);
