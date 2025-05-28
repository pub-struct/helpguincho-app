import { BaseError } from './BaseError'


export class InfraError extends BaseError {
  constructor({
    message,
    titleMessage,
    metadata,
    originalError,
  }: Omit<BaseError, 'name' | 'isAppError'>) {
    super(message, titleMessage, metadata, originalError)
  }
}
