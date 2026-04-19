const logger = require('./logger')

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function withRetry (fn, options = {}) {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    backoffMultiplier = 2,
    retryableErrors = []
  } = options

  let lastError

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      const isRetryable = retryableErrors.length === 0 ||
        retryableErrors.some(errorType => error instanceof errorType)

      if (!isRetryable || attempt === maxRetries - 1) {
        throw error
      }

      const delay = Math.min(
        baseDelay * Math.pow(backoffMultiplier, attempt),
        maxDelay
      )

      logger.warn(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`, {
        error: error.message,
        attempt: attempt + 1
      })

      await sleep(delay)
    }
  }

  throw lastError
}

module.exports = {
  withRetry,
  sleep
}
