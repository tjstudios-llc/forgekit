export const fastifyTemplate = {
  id: "fastify",
  title: "Fastify API",
  description: "Fastify API with health endpoint and environment configuration.",
  files: {
    "package.json": { name: "{{name}}", version: "0.1.0", private: true, type: "module", scripts: { dev: "node --watch src/server.js", start: "node src/server.js", test: "node --test" }, dependencies: { fastify: "^5.4.0", dotenv: "^16.6.1" } },
    "src/server.js": `import 'dotenv/config';\nimport Fastify from 'fastify';\n\nconst app = Fastify({ logger: true });\napp.get('/health', async () => ({ status: 'ok', app: '{{name}}' }));\napp.get('/api', async () => ({ message: 'Welcome to {{title}}' }));\n\nconst port = Number(process.env.PORT || 4000);\ntry { await app.listen({ port, host: '0.0.0.0' }); }\ncatch (error) { app.log.error(error); process.exit(1); }\n`,
    ".env.example": "NODE_ENV=development\nPORT=4000\nDATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DATABASE\n",
    ".gitignore": "node_modules/\n.env\n",
    "README.md": "# {{title}}\\n\\nRun `npm install`, copy `.env.example` to `.env`, then `npm run dev`.\\n"
  }
};
