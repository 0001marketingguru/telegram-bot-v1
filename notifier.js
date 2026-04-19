const { Telegraf } = require('telegraf')
const config = require('./config')
const EventService = require('./services/eventService')

const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN)
const eventService = new EventService(bot, config.ADMIN_IDS)

bot.action(/deposit:(.+)/, async (ctx) => {
  const user = ctx.match[1]
  await ctx.reply(`⌨️ Type: \`/deposit ${user} <amount>\``)
  ctx.answerCbQuery()
})

bot.action(/balance:(.+)/, async (ctx) => {
  const user = ctx.match[1]
  await ctx.reply(`⌨️ Type: \`/user ${user}\``)
  ctx.answerCbQuery()
})

module.exports = { bot, eventService }
