require('dotenv').config()
const { validateConfig } = require('./validators')
const constants = require('./constants')

validateConfig()

const ADMIN_IDS = process.env.ADMIN_IDS
  .split(',')
  .map(id => id.trim())
  .filter(id => id)

function isAdmin (userId) {
  return ADMIN_IDS.includes(userId.toString())
}

module.exports = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  ADMIN_IDS,
  ADMIN_TELEGRAM_ID: process.env.ADMIN_TELEGRAM_ID,
  BSC_RPC_HTTP: process.env.BSC_RPC_HTTP,
  BSC_RPC_WSS: process.env.BSC_RPC_WSS,
  VAULT_ADDRESS: process.env.VAULT_ADDRESS,
  USDT_ADDRESS: process.env.USDT_ADDRESS,
  BOT_PRIVATE_KEY: process.env.BOT_PRIVATE_KEY,
  isAdmin,
  ...constants
}
