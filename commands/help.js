const logger = require('../utils/logger')

function registerHelpCommands (bot) {
  bot.command('start', (ctx) => {
    logger.info('Start command received', { userId: ctx.from?.id })
    ctx.reply('🤖 *Vault Trading Bot Online*\n\nUse /help for commands.', { parse_mode: 'Markdown' })
  })

  bot.command('help', (ctx) => {
    logger.info('Help command received', { userId: ctx.from?.id })
    ctx.reply('📖 *Commands*\n\n🔍 *Read (Anyone):*\n/balance\n/user <address>\n/allowance <address>\n\n⚡ *Write (Admin Only):*\n/deposit <addr> <amt>\n/withdraw <addr> <amt>\n/pause\n/unpause\n\n🏥 *Health:*\n/health\n\n📜 *History:*\n/history', { parse_mode: 'Markdown' })
  })
}

module.exports = { registerHelpCommands }
