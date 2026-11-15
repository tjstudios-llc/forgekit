export const expressTemplate = {
  id: "express", title: "Express API", description: "Express REST API with health and example API endpoints.",
  files: {
    "package.json": { name: "{{name}}", version: "0.1.0", private: true, type: "module", scripts: { dev: "node --watch src/server.js", start: "node src/server.js", test: "node --test" }, dependencies: { express: "^5.1.0", dotenv: "^16.6.1" } },
    "src/server.js": "import 'dotenv/config';\nimport express from 'express';\nconst app = express();\napp.use(express.json());\napp.get('/health', (_req, res) => res.json({ status: 'ok', app: '{{name}}' }));\napp.get('/api', (_req, res) => res.json({ message: 'Welcome to {{title}}' }));\nconst port = Number(process.env.PORT || 4000);\napp.listen(port, '0.0.0.0', () => console.log('{{name}} listening on http://localhost:' + port));\n",
    ".env.example": "NODE_ENV=development\nPORT=4000\nDATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DATABASE\n",
    ".gitignore": "node_modules/\n.env\n",
    "README.md": "# {{title}}\n\nRun `npm install`, copy `.env.example` to `.env`, then `npm run dev`.\n"
  }
};
