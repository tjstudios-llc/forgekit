# ForgeKit

ForgeKit is a local-first application generator. Version 0.2 introduces a shared Core package with CLI, VS Code, and desktop interfaces. The root `src/` and `bin/` paths remain as v0.1 compatibility entry points backed by the same shared Core and CLI.

## Requirements
- Node.js 22+
- pnpm 10+
- PostgreSQL is optional and only needed when explicitly provisioning a database.

## Workspace setup
```bash
corepack enable
pnpm install
pnpm test
pnpm lint:check
```

## CLI
```bash
pnpm cli -- --help
pnpm cli -- templates
pnpm cli -- create my-app --template express --path ~/projects --no-install
```

Templates: nextjs, react-vite, express, fastify, and fullstack. Database creation is opt-in and requires a PostgreSQL provisioning URL with CREATEDB permission. Keep that credential separate from the application's least-privilege DATABASE_URL.

## VS Code
```bash
pnpm --filter @forgekit/vscode build
```
Open apps/vscode in VS Code and package it with vsce when ready.

## Desktop
```bash
pnpm desktop:dev
```
Build targets are provided for Linux (AppImage/deb) and Windows (NSIS). Project execution remains local; no web service is required.

## Architecture
- packages/core: validation, templates, rendering, generation, optional PostgreSQL provisioning.
- apps/cli: terminal interface.
- apps/vscode: editor integration.
- apps/desktop: Electron desktop shell.
- src/ and bin/: v0.1 compatibility entry points that delegate to the shared Core and CLI.

## Safety
- Existing target directories are never overwritten.
- ForgeKit never executes generated project code.
- Dependency installation is explicit and can be disabled.
- PostgreSQL provisioning is opt-in.
- Credentials are not logged; generated .env files use restrictive permissions where supported.

## Releases
- v0.1.0: original standalone CLI generator.
- v0.2.0: shared Core workspace and local CLI/editor/desktop interfaces.
