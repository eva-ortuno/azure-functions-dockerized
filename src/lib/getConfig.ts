export function getConfig(variable: string): string {
  const v = process.env[variable];
  if (!v) {
    throw new Error(`Required environment variable ${variable} not set!`);
  }
  return v;
}
