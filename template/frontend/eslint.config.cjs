module.exports = [
    { ignores: ["node_modules/**", "dist/**", ".astro/**"] },
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            parser: require("@typescript-eslint/parser"),
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: "module",
                project: "./tsconfig.json",
            },
        },
        plugins: {
            "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
        },
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    vars: "all",
                    args: "after-used",
                    ignoreRestSiblings: true,
                    varsIgnorePattern: "^_",
                    argsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
        },
    },
    {
        files: ["**/*.astro"],
        languageOptions: {
            parser: require("astro-eslint-parser"),
            parserOptions: {
                parser: require("@typescript-eslint/parser"),
                extraFileExtensions: [".astro"],
                project: "./tsconfig.json",
            },
        },
        plugins: {
            astro: require("eslint-plugin-astro"),
            "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
        },
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    vars: "all",
                    args: "after-used",
                    ignoreRestSiblings: true,
                    varsIgnorePattern: "^_",
                    argsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
        },
    },
];
