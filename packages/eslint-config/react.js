/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    "./index.js",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  plugins: ["react", "react-hooks", "jsx-a11y"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // React specific rules
    "react/prop-types": "off", // TypeScript handles this
    "react/react-in-jsx-scope": "off", // Not needed with new JSX transform
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // Accessibility rules
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["to"],
      },
    ],

    // Performance and best practices
    "react/jsx-no-bind": [
      "warn",
      {
        allowArrowFunctions: true,
        allowBind: false,
        ignoreRefs: true,
      },
    ],
    "react/jsx-key": ["error", { checkFragmentShorthand: true }],
  },
};
