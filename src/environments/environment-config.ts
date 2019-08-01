export interface EnvironmentConfig {
  production?: boolean;
  backend?: {
    url?: string;
    swPushKey?: string;
  };
}

export function mergeConfigs(configA: EnvironmentConfig, configB?: EnvironmentConfig | null): EnvironmentConfig {
  const srcBackend = configA == null ? {} : configA.backend;
  const backendValue = Object.assign({}, srcBackend, configB == null ? null : configB.backend);
  const configUpdate = Object.assign({}, configB, {
    backend: backendValue
  });
  return Object.assign({}, configA, configUpdate);
}
