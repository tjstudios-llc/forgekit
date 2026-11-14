<<<<<<< HEAD
# forgekit
=======
# ForgeKit

ForgeKit is a JavaScript CLI that scaffolds applications from reusable templates and can optionally provision a PostgreSQL database.

## Requirements

- Node.js 22+
- npm
- PostgreSQL 14+ (only if provisioning a database)

## Install for development

```bash
npm install
npm link
forgekit --help
```

## Create a project

Interactive:

```bash
forgekit create
```

Non-interactive:

```bash
forgekit create my-app --template fullstack --path ~/projects --database postgres --db-name my_app
```

Skip package installation:

```bash
forgekit create my-app --template express --no-install
```

List templates:

```bash
forgekit templates
```

## PostgreSQL provisioning

ForgeKit does not assume it owns your PostgreSQL server. To create a database, provide an administrative connection string through `--admin-url` or `FORGEKIT_POSTGRES_ADMIN_URL`.

```bash
export FORGEKIT_POSTGRES_ADMIN_URL='postgresql://forgekit_admin:password@127.0.0.1:5432/postgres'
forgekit create my-app --template fullstack --database postgres --db-name my_app --database-url 'postgresql://app_user:app_password@127.0.0.1:5432/my_app' 
```

Use a role with `CREATEDB` permission, preferably a dedicated provisioning role rather than the PostgreSQL superuser. ForgeKit creates only the requested database; it does not create roles or change server-wide configuration. Database names are validated and quoted safely. The generated application receives a separate application `DATABASE_URL` in `.env`. Never reuse the provisioning/admin URL as the application credential; create a least-privilege application role and pass its connection string with `--database-url` or `FORGEKIT_POSTGRES_APP_URL`.

If no admin URL is supplied, ForgeKit will generate the project and `.env.example`, but will not create a database. It will clearly report the manual connection step.

## Templates

- `nextjs`: Next.js App Router + JavaScript
- `react-vite`: React + Vite + JavaScript
- `express`: Express API + JavaScript
- `fastify`: Fastify API + JavaScript
- `fullstack`: Next.js + Prisma + PostgreSQL starter

## Safety and behavior

- Refuses to overwrite an existing target directory.
- Never runs generated project code.
- Dependency installation is an explicit subprocess and can be disabled with `--no-install`.
- PostgreSQL credentials are not written to logs.
- `.env` is created with restrictive permissions where supported and excluded from Git.
- Database provisioning is opt-in and requires a PostgreSQL admin connection string.
- Generated `.env` files contain placeholders if database provisioning is skipped.

## Project layout

```text
forgekit/
├── bin/forgekit.js
├── src/
│   ├── cli.js
│   ├── index.js
│   ├── config.js
│   ├── generator/
│   ├── database/
│   └── templates/
└── test/
```

## Roadmap

1. More templates and template versioning
2. Custom template packs
3. Docker Compose generation
4. Git initialization
5. Template validation and preview
6. Optional web dashboard using the same engine
>>>>>>> fceae8e (Initial ForgeKit v0.1.0)
