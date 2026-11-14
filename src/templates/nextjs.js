export const nextjsTemplate = {
  id: "nextjs",
  title: "Next.js",
  description: "Next.js App Router application using JavaScript.",
  files: {
    "package.json": { name: "{{name}}", version: "0.1.0", private: true, scripts: { dev: "next dev", build: "next build", start: "next start", lint: "eslint ." }, dependencies: { next: "^15.5.0", react: "^19.1.0", "react-dom": "^19.1.0" }, devDependencies: { eslint: "^9.0.0", "eslint-config-next": "^15.5.0" } },
    "app/layout.js": `export const metadata = { title: "{{title}}", description: "Built with ForgeKit" };\n\nexport default function RootLayout({ children }) {\n  return <html lang="en"><body>{children}</body></html>;\n}\n`,
    "app/page.js": `export default function Home() {\n  return <main style={{ fontFamily: "system-ui", padding: "3rem" }}><h1>{{title}}</h1><p>Your application is ready. Start building!</p></main>;\n}\n`,
    "app/globals.css": `* { box-sizing: border-box; }\nbody { margin: 0; color: #171717; background: #fff; }\n`,
    "app/api/health/route.js": `export function GET() { return Response.json({ status: "ok", app: "{{name}}" }); }\n`,
    "jsconfig.json": { compilerOptions: { baseUrl: ".", paths: { "@/*": ["./*"] } } },
    "next.config.mjs": "const nextConfig = {};\nexport default nextConfig;\n",
    ".env.example": "NODE_ENV=development\n"
  }
};
