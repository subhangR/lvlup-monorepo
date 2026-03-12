/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ["./index.js"],
  env: {
    node: true,
  },
  rules: {
    "no-console": "off", // Console is fine in Node.js
  },
};
