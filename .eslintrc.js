module.exports = {
    "env": {
        "node": true,
        "commonjs": true,
        "es2021": true,
    },
    "extends": "eslint:recommended",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
    },
    "rules": {
        "eqeqeq": ["error", "always"],
        "no-const-assign": ["error"],
        "no-duplicate-imports": ["error", { "includeExports": true }],
        "no-var": ["error"],
        "prefer-const": ["error"],
        "no-unreachable": ["error"],
        "no-unused-vars": ["error", { "args": "none" }],
        "array-bracket-spacing": ["error", "never"],
        "arrow-spacing": ["error", { "before": true, "after": true }],
        "comma-dangle": ["error", "always-multiline"],
        "comma-spacing": ["error", { "before": false, "after": true }],
        "comma-style": ["error", "last"],
        "eol-last": ["error", "always"],
        "indent": ["error", 4],
        "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
        "no-trailing-spaces": ["error"],
        "semi": ["error", "always", { "omitLastInOneLineBlock": true }],
    },
};
