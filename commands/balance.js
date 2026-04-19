const { ethers } = require('ethers')
const logger = require('../utils/logger')
const { ValidationError } = require('../utils/errors')
const { validateAddress } = require('../config/validators')

function registerBalanceCommands (bot, vaultService, telegramService) {
  bot.command('balance', async (ctx) => {
    try {
      logger.info('Balance command received', { userId: ctx.from?.id })
      const balance = await vaultService.getVaultBalance()
      const formatted = ethers.formatUnits(balance, 18)
      await telegramService.sendReply(ctx, telegramService.formatBalance(formatted))
    } catch (error) {
      logger.error('Balance command failed', { userId: ctx.from?.id, error: error.message })
      await telegramService.sendReply(ctx, telegramService.formatError(error))
    }
  })

  bot.command('user', async (ctx) => {
    const addr = ctx.args[0]
    if (!addr) {
      return ctx.reply('❌ Usage: /user <address>')
    }

    try {
      logger.info('User command received', { userId: ctx.from?.id, address: addr })
      validateAddress(addr)
      const bal = await vaultService.getUserBalance(addr)
      const formatted = ethers.formatUnits(bal, 18)
      await telegramService.sendReply(ctx, telegramService.formatUserBalance(addr, formatted))
    } catch (error) {
      logger.error('User command failed', { userId: ctx.from?.id, address: addr, error: error.message })
      if (error instanceof ValidationError) {
        await telegramService.sendReply(ctx, `❌ ${error.message}`)
      } else {
        await telegramService.sendReply(ctx, telegramService.formatError(error))
      }
    }
  })

  bot.command('allowance', async (ctx) => {
    const addr = ctx.args[0]
    if (!addr) {
      return ctx.reply('❌ Usage: /allowance <address>')
    }

    try {
      logger.info('Allowance command received', { userId: ctx.from?.id, address: addr })
      validateAddress(addr)
      const allowance = await vaultService.checkAllowance(addr)
      const formatted = ethers.formatUnits(allowance, 18)
      await telegramService.sendReply(ctx, telegramService.formatAllowance(addr, formatted))
    } catch (error) {
      logger.error('Allowance command failed', { userId: ctx.from?.id, address: addr, error: error.message })
      if (error instanceof ValidationError) {
        await telegramService.sendReply(ctx, `❌ ${error.message}`)
      } else {
        await telegramService.sendReply(ctx, telegramService.formatError(error))
      }
    }
  })
}

module.exports = { registerBalanceCommands }
