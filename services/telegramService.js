const logger = require('../utils/logger')
const { BotError } = require('../utils/errors')
const { formatAddress, formatTransactionLink } = require('../utils/formatters')

class TelegramService {
  constructor (bot) {
    this.bot = bot
  }

  async sendMessage (chatId, message, options = {}) {
    try {
      await this.bot.telegram.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        ...options
      })
      logger.info('Message sent', { chatId })
    } catch (error) {
      logger.error('Failed to send message', { chatId, error: error.message })
      throw new BotError('Failed to send Telegram message')
    }
  }

  async sendReply (ctx, message, options = {}) {
    try {
      await ctx.reply(message, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        ...options
      })
      logger.info('Reply sent', { userId: ctx.from?.id })
    } catch (error) {
      logger.error('Failed to send reply', { userId: ctx.from?.id, error: error.message })
      throw new BotError('Failed to send Telegram reply')
    }
  }

  formatError (error) {
    if (error instanceof BotError) {
      return `❌ Error: ${error.message}`
    }
    return `❌ Unexpected error: ${error.message}`
  }

  formatSuccess (message, txHash) {
    const txLink = formatTransactionLink(txHash)
    return `✅ ${message}\n🔗 ${txLink}`
  }

  formatBalance (balance) {
    return `💰 Vault Balance: ${balance} USDT`
  }

  formatUserBalance (address, balance) {
    const shortAddress = formatAddress(address)
    return `👤 ${shortAddress}: ${balance} USDT`
  }

  formatAllowance (address, allowance) {
    const shortAddress = formatAddress(address)
    return `👤 ${shortAddress} Allowance: ${allowance} USDT`
  }
}

module.exports = TelegramService
