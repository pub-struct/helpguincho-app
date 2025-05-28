// eslint-disable-next-line tseslint/no-explicit-any
export type ErrorMetadata = Record<string, string | number | boolean | any[] | Object | null | undefined>

export class BaseError extends Error {
  public readonly isAppError = true
  titleMessage: string
  metadata: ErrorMetadata
  originalError: unknown

  constructor(
    message: string,
    titleMessage: string,
    metadata: ErrorMetadata = {},
    originalError: unknown = ''
  ) {
    super(message)
    this.name = new.target.name // ← usa o nome da subclasse automaticamente
    this.titleMessage = titleMessage
    this.metadata = metadata
    this.originalError = originalError

    // Corrige a cadeia de protótipos
    Object.setPrototypeOf(this, new.target.prototype)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, new.target)
    }
  }
}

