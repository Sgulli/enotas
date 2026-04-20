# `@repo/oxlint-config`

Shared [Oxlint](https://oxc.rs/docs/guide/usage/linter) configuration for this monorepo.

## Presets

- `base` — TypeScript and general rules for any package
- `react-internal` — React component libraries (browser, JSX, a11y)
- `next-js` — Next.js apps (includes `nextjs` plugin and common ignores)

## Usage

Add `oxlint` and this package as devDependencies, then extend a preset from `.oxlintrc.json` at the package root:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "extends": ["@repo/oxlint-config/next-js"]
}
```

Run lint with:

```sh
oxlint
```

Wire the `lint` script in `package.json` (example): `"lint": "oxlint"`.
