import { nextjsTemplate } from "./nextjs.js";
import { reactViteTemplate } from "./react-vite.js";
import { expressTemplate } from "./express.js";
import { fastifyTemplate } from "./fastify.js";
import { fullstackTemplate } from "./fullstack.js";

export const templates = new Map([
  ["nextjs", nextjsTemplate],
  ["react-vite", reactViteTemplate],
  ["express", expressTemplate],
  ["fastify", fastifyTemplate],
  ["fullstack", fullstackTemplate]
]);

export function getTemplate(id) {
  const template = templates.get(id);
  if (!template) throw new Error(`Unknown template "${id}". Run "forgekit templates" to see available templates.`);
  return template;
}
