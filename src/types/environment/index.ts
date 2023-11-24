type EnvironmentKeys = 'TEST';

export type Environment = {
  [name in EnvironmentKeys]: string | undefined;
};
