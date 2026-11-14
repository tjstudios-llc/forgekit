export const reactViteTemplate = {
  id: "react-vite",
  title: "React + Vite",
  description: "React single-page application powered by Vite.",
  files: {
    "package.json": { name: "{{name}}", version: "0.1.0", private: true, type: "module", scripts: { dev: "vite --host 0.0.0.0", build: "vite build", preview: "vite preview" }, dependencies: { react: "^19.1.0", "react-dom": "^19.1.0" }, devDependencies: { "@vitejs/plugin-react": "^4.7.0", vite: "^6.3.0" } },
    "index.html": "<!doctype html>\n<html lang=\"en\"><head><meta charset=\"UTF-8\"/><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/><title>{{title}}</title></head><body><div id=\"root\"></div><script type=\"module\" src=\"/src/main.jsx\"></script></body></html>\n",
    "vite.config.js": "import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({ plugins: [react()] });\n",
    "src/main.jsx": "import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport './style.css';\n\nfunction App() { return <main><h1>{{title}}</h1><p>Your React application is ready.</p></main>; }\n\ncreateRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);\n",
    "src/style.css": "body { margin: 0; font-family: system-ui, sans-serif; color: #171717; } main { padding: 3rem; }\n",
    ".env.example": "VITE_API_URL=http://localhost:4000\n"
  }
};
