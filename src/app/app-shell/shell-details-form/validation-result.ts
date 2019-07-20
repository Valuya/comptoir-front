export interface ValidationResult<T> {
  valid: boolean;
  errors: {
    [property in keyof T]?: string[]
  };
}
