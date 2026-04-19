const { startEventListener } = require('./listener')
const { bot, eventService } = require('./notifier')
const { ethers } = require('ethers')
const logger = require('./utils/logger')
const { checkBlockchainConnection, checkBotStatus, formatHealthReport, setLastError } = require('./utils/health')
const { getTransactionHistory, formatTransactionLog } = require('./utils/transactionLogger')
const VaultService = require('./services/vaultService')
const TelegramService = require('./services/telegramService')
const { registerAllCommands } = require('./commands')
const config = require('./config')

const provider = new ethers.JsonRpcProvider(config.BSC_RPC_HTTP)
const wallet = new ethers.Wallet(config.BOT_PRIVATE_KEY, provider)
const vaultABI = require('./vaultABI.json')
const vaultService = new VaultService(provider, wallet, config.VAULT_ADDRESS, vaultABI)
const telegramService = new TelegramService(bot)

registerAllCommands(bot, vaultService, telegramService)

bot.command('health', async (ctx) => {
  try {
    logger.info('Health command received', { userId: ctx.from?.id })
    const blockchain = await checkBlockchainConnection(provider)
    const botStatus = await checkBotStatus(bot)
    const health = {
      bot: botStatus,
      blockchain
    }
    await telegramService.sendReply(ctx, formatHealthReport(health))
  } catch (error) {
    logger.error('Health command failed', { userId: ctx.from?.id, error: error.message })
    await telegramService.sendReply(ctx, telegramService.formatError(error))
  }
})

bot.command('history', async (ctx) => {
  try {
    logger.info('History command received', { userId: ctx.from?.id })
    const history = await getTransactionHistory(10)
    if (history.length === 0) {
      await telegramService.sendReply(ctx, '📜 No transaction history available')
      return
    }
    let message = '📜 *Recent Transactions*\n\n'
    history.reverse().forEach(tx => {
      message += formatTransactionLog(tx) + '\n\n'
    })
    await telegramService.sendReply(ctx, message)
  } catch (error) {
    logger.error('History command failed', { userId: ctx.from?.id, error: error.message })
    await telegramService.sendReply(ctx, telegramService.formatError(error))
  }
})

async function main () {
  try {
    logger.info('Starting bot...')
    bot.startPolling()
    logger.info('Telegram bot launched')

    await startEventListener({ eventService })
    logger.info('Event listener active')
  } catch (error) {
    logger.error('Failed to start bot', { error: error.message, stack: error.stack })
    setLastError(error)
    process.exit(1)
  }
}

main().catch(error => {
  logger.error('Main function error', { error: error.message, stack: error.stack })
  process.exit(1)
})

process.once('SIGINT', () => {
  logger.info('Received SIGINT, shutting down...')
  bot.stop('SIGINT')
})

process.once('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down...')
  bot.stop('SIGTERM')
})

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error: error.message, stack: error.stack })
  setLastError(error)
  // Don't exit - let the bot continue running
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', { reason: reason?.message || reason, promise })
  // Don't exit - let the bot continue running
})
