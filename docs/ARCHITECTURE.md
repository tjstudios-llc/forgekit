# ForgeKit v0.2 Architecture

## Design goals
- Local-first execution: generated projects are created on the user's machine.
- One generation engine: CLI, VS Code, and desktop call the same Core API.
- Compatibility: the original v0.1 root entry points remain in the repository.
- Optional integrations: PostgreSQL provisioning is explicit; the web dashboard is not required.

## Workspace
- packages/core: configuration validation, template registry, renderer, project filesystem operations, package installation, and PostgreSQL provisioning.
- apps/cli: Commander/Inquirer terminal experience.
- apps/vscode: VS Code commands that invoke Core directly.
- apps/desktop: Electron shell with context isolation and a narrow preload bridge.

## Project creation flow
1. Interface collects a project name, template, destination, and optional database settings.
2. Core validates all inputs and resolves the target beneath the selected parent directory.
3. Core refuses an existing target, creates the folder, renders template files, and writes safe defaults.
4. PostgreSQL provisioning only runs when the user explicitly supplies an admin connection URL.
5. Dependency installation only runs when enabled by the caller.

## Trust boundaries
- The generator writes files but never executes generated application code.
- Electron renderer has no Node integration; privileged operations are exposed through IPC.
- Database provisioning credentials are not written into generated application configuration.
- Generated .env files are excluded from Git and written with restrictive permissions where supported.

## Future work
- Add template manifest/schema validation and preview.
- Add CLI integration tests and interface-specific automated tests.
- Add signed desktop packaging and VS Code Marketplace release automation.
- Add optional web dashboard after the local interfaces stabilize.
