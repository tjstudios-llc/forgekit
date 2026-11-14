export const fastifyTemplate = {
  id: "fastify", title: "Fastify API", description: "Fastify API with a health endpoint.",
  files: {
    "package.json": { name: "{{name}}", version: "0.1.0", private: true, type: "module", scripts: { dev: "node --watch src/server.js", start: "node src/server.js" }, dependencies: { fastify: "^5.4.0", dotenv: "^16.6.1" } },
    "src/server.js": "import 'dotenv/config';\nimport Fastify from 'fastify';\nconst app = Fastify({ logger: true });\napp.get('/health', async () => ({ status: 'ok', app: '{{name}}' }));\nconst port = Number(process.env.PORT || 4000);\nawait app.listen({ port, host: '0.0.0.0' });\n",
    ".env.example": "NODE_ENV=development\nPORT=4000\nDATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DATABASE\n",
    ".gitignore": "node_modules/\n.env\n"
  }
};
