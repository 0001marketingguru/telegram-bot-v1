const { ethers } = require('ethers')

function validateAddress (address) {
  if (!address) {
    throw new Error('Address is required')
  }
  if (!ethers.isAddress(address)) {
    throw new Error('Invalid address format')
  }
  return address
}

function validateAmount (amount) {
  if (!amount) {
    throw new Error('Amount is required')
  }
  const num = parseFloat(amount)
  if (isNaN(num) || num <= 0) {
    throw new Error('Amount must be a positive number')
  }
  return num
}

function validateUserId (userId) {
  if (!userId) {
    throw new Error('User ID is required')
  }
  const id = parseInt(userId)
  if (isNaN(id) || id <= 0) {
    throw new Error('Invalid user ID')
  }
  return id
}

function validatePrivateKey (key) {
  if (!key) {
    throw new Error('Private key is required')
  }
  const cleanKey = key.startsWith('0x') ? key.slice(2) : key
  if (cleanKey.length !== 64) {
    throw new Error('Invalid private key format')
  }
  return key
}

function validateRpcUrl (url) {
  if (!url) {
    throw new Error('RPC URL is required')
  }
  try {
    // eslint-disable-next-line no-new
    new URL(url)
  } catch (e) {
    throw new Error('Invalid RPC URL format')
  }
  return url
}

function validateConfig () {
  const required = [
    'TELEGRAM_BOT_TOKEN',
    'ADMIN_IDS',
    'BSC_RPC_HTTP',
    'VAULT_ADDRESS',
    'BOT_PRIVATE_KEY'
  ]

  const missing = required.filter(key => !process.env[key])
  if (missing.length > 0) {
    throw new Error(`Missing required config: ${missing.join(', ')}`)
  }

  validatePrivateKey(process.env.BOT_PRIVATE_KEY)
  validateRpcUrl(process.env.BSC_RPC_HTTP)
  validateAddress(process.env.VAULT_ADDRESS)

  return true
}

module.exports = {
  validateAddress,
  validateAmount,
  validateUserId,
  validatePrivateKey,
  validateRpcUrl,
  validateConfig
}
