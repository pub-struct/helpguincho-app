import { BaseError } from './BaseError'
import { DomainError } from './DomainError'


export function rethrowIfAppError(e: unknown): never | void {
  if (e instanceof BaseError || e instanceof DomainError) {
    if (e.isAppError) {
      throw e // ✅ Propaga sem aninhar
    }
  }
}
