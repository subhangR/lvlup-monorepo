# @levelup/eslint-config

Shared ESLint configuration for the LevelUp monorepo.

## Usage

### For React applications

```js
// .eslintrc.js or eslint.config.js
module.exports = {
  extends: ["@levelup/eslint-config/react"],
  // Add your project-specific rules here
};
```

### For Node.js projects

```js
// .eslintrc.js or eslint.config.js
module.exports = {
  extends: ["@levelup/eslint-config/node"],
  // Add your project-specific rules here
};
```

### For general TypeScript projects

```js
// .eslintrc.js or eslint.config.js
module.exports = {
  extends: ["@levelup/eslint-config"],
  // Add your project-specific rules here
};
```

## Features

- TypeScript support with strict type checking
- Import sorting and organization
- Prettier integration (no conflicting rules)
- React and React Hooks rules (in react config)
- Accessibility checks (in react config)
- Consistent code style across the monorepo

## Peer Dependencies

Make sure to install these in your project:

```bash
pnpm add -D eslint typescript
```
