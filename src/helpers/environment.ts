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

export function getLayout(): string {
  const runtimeConfig = globalThis as typeof globalThis & {
    __APP_CONFIG__?: Record<string, string>;
  };

  const value =
    runtimeConfig.__APP_CONFIG__?.LAYOUT ??
    (import.meta.env["LAYOUT"] as string | undefined) ??
    (import.meta.env["VITE_LAYOUT"] as string | undefined) ??
    "FUNDIMISA";

  return value.trim().toUpperCase();
}
