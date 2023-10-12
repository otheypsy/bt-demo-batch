module.exports = {

    root: true,

    env: {
        node: true,
        es2024: true,
    },

    parserOptions: {
        project: true,
        ecmaVersion: 'latest',
        sourceType: 'module',
    },

    plugins: [
        'prettier'
    ],

    extends: [
        'eslint:recommended',
        'airbnb-base',
        'prettier'
    ],

    rules: {
        'import/extensions': 'off',
    },
}
