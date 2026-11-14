function interpolate(value, vars) {
  return value.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_match, key) => String(vars[key] ?? ""));
}

export function renderValue(value, vars) {
  if (typeof value === "string") return interpolate(value, vars);
  if (Array.isArray(value)) return value.map((item) => renderValue(item, vars));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, renderValue(item, vars)]));
  }
  return value;
}
