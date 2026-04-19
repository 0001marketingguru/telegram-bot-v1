class BotError extends Error {
  constructor (message) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

class ValidationError extends BotError {
  constructor (message, field) {
    super(message)
    this.field = field
  }
}

class TransactionError extends BotError {
  constructor (message, txHash) {
    super(message)
    this.txHash = txHash
  }
}

class NetworkError extends BotError {
  constructor (message, url) {
    super(message)
    this.url = url
  }
}

class ConfigError extends BotError {
  constructor (message, key) {
    super(message)
    this.key = key
  }
}

module.exports = {
  BotError,
  ValidationError,
  TransactionError,
  NetworkError,
  ConfigError
}
