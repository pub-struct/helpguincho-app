interface IConstructor {
  message: string
  titleMessage: string
  onPress?: VoidFunction
}

export class DomainError extends Error {
  titleMessage: string
  public readonly isAppError = true
  public onPress?: VoidFunction

  constructor({ message, titleMessage, onPress }: IConstructor) {
    super(message)
    this.name = 'DomainError'
    this.titleMessage = titleMessage
    this.onPress = onPress

    Object.setPrototypeOf(this, DomainError.prototype)
  }
}
