const { registerHelpCommands } = require('./help')
const { registerBalanceCommands } = require('./balance')
const { registerAdminCommands } = require('./admin')

function registerAllCommands (bot, vaultService, telegramService) {
  registerHelpCommands(bot)
  registerBalanceCommands(bot, vaultService, telegramService)
  registerAdminCommands(bot, vaultService, telegramService)
}

module.exports = { registerAllCommands }
