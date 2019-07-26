import {ValidationResult} from './validation-result';

export class ValidationResultFactory {

  static emptyResults<T>(): ValidationResult<T> {
    return {
      valid: true,
      errors: {}
    };
  }
}
