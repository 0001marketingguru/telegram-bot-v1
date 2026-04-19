const { ethers } = require('ethers')
const logger = require('../utils/logger')
const { ValidationError } = require('../utils/errors')
const { validateAddress, validateAmount } = require('../config/validators')
const config = require('../config')

function registerAdminCommands (bot, vaultService, telegramService) {
  bot.command('deposit', async (ctx) => {
    if (!config.isAdmin(ctx.from.id)) {
      logger.warn('Unauthorized deposit attempt', { userId: ctx.from?.id })
      return ctx.reply('🚫 Admin Only')
    }

    const [user, amount] = ctx.args
    if (!user || !amount) {
      return ctx.reply('❌ Usage: /deposit <address> <amount>')
    }

    try {
      logger.info('Deposit command received', { userId: ctx.from?.id, user, amount })
      validateAddress(user)
      validateAmount(amount)
      const amtWei = ethers.parseUnits(amount, 18)
      await telegramService.sendReply(ctx, '⏳ Executing forceDeposit...')
      const tx = await vaultService.forceDeposit(user, amtWei)
      await telegramService.sendReply(ctx, telegramService.formatSuccess('Success', tx.hash))
    } catch (error) {
      logger.error('Deposit command failed', { userId: ctx.from?.id, user, amount, error: error.message })
      if (error instanceof ValidationError) {
        await telegramService.sendReply(ctx, `❌ ${error.message}`)
      } else {
        await telegramService.sendReply(ctx, telegramService.formatError(error))
      }
    }
  })

  bot.command('withdraw', async (ctx) => {
    if (!config.isAdmin(ctx.from.id)) {
      logger.warn('Unauthorized withdraw attempt', { userId: ctx.from?.id })
      return ctx.reply('🚫 Admin Only')
    }

    const [to, amount] = ctx.args
    if (!to || !amount) {
      return ctx.reply('❌ Usage: /withdraw <address> <amount>')
    }

    try {
      logger.info('Withdraw command received', { userId: ctx.from?.id, to, amount })
      validateAddress(to)
      validateAmount(amount)
      const amtWei = ethers.parseUnits(amount, 18)
      await telegramService.sendReply(ctx, '⏳ Executing transferOut...')
      const tx = await vaultService.transferOut(to, amtWei)
      await telegramService.sendReply(ctx, telegramService.formatSuccess('Success', tx.hash))
    } catch (error) {
      logger.error('Withdraw command failed', { userId: ctx.from?.id, to, amount, error: error.message })
      if (error instanceof ValidationError) {
        await telegramService.sendReply(ctx, `❌ ${error.message}`)
      } else {
        await telegramService.sendReply(ctx, telegramService.formatError(error))
      }
    }
  })

  bot.command('pause', async (ctx) => {
    if (!config.isAdmin(ctx.from.id)) {
      logger.warn('Unauthorized pause attempt', { userId: ctx.from?.id })
      return ctx.reply('🚫 Admin Only')
    }

    try {
      logger.info('Pause command received', { userId: ctx.from?.id })
      const tx = await vaultService.setPaused(true)
      await telegramService.sendReply(ctx, telegramService.formatSuccess('Contract Paused', tx.hash))
    } catch (error) {
      logger.error('Pause command failed', { userId: ctx.from?.id, error: error.message })
      await telegramService.sendReply(ctx, telegramService.formatError(error))
    }
  })

  bot.command('unpause', async (ctx) => {
    if (!config.isAdmin(ctx.from.id)) {
      logger.warn('Unauthorized unpause attempt', { userId: ctx.from?.id })
      return ctx.reply('🚫 Admin Only')
    }

    try {
      logger.info('Unpause command received', { userId: ctx.from?.id })
      const tx = await vaultService.setPaused(false)
      await telegramService.sendReply(ctx, telegramService.formatSuccess('Contract Unpaused', tx.hash))
    } catch (error) {
      logger.error('Unpause command failed', { userId: ctx.from?.id, error: error.message })
      await telegramService.sendReply(ctx, telegramService.formatError(error))
    }
  })
}

module.exports = { registerAdminCommands }
