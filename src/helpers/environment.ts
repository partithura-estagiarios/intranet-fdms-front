export function getEnvironmentVariable(name: string): string {
  const runtimeConfig = globalThis as typeof globalThis & {
    __APP_CONFIG__?: Record<string, string>;
  };

  if (runtimeConfig.__APP_CONFIG__?.[name]) {
    return runtimeConfig.__APP_CONFIG__[name];
  }

  if (import.meta.env[name]) {
    return import.meta.env[name];
  }
  throw new Error(`Environment variable ${name} is not defined.`);
}
