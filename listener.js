const { ethers } = require('ethers')
const logger = require('./utils/logger')
const { setListenerRunning } = require('./utils/health')
const config = require('./config')

async function startEventListener ({ eventService }) {
  const provider = new ethers.WebSocketProvider(config.BSC_RPC_WSS)
  const vaultABI = require('./vaultABI.json')
  const vault = new ethers.Contract(config.VAULT_ADDRESS, vaultABI, provider)

  logger.info('Starting event listener', { vaultAddress: config.VAULT_ADDRESS })

  vault.on('Deposited', (user, amount, event) => {
    logger.info('Deposited event', { user, amount: amount.toString() })
    eventService.sendNotification('Deposited', { user, amount }, event)
  })

  vault.on('Withdrawn', (to, amount, event) => {
    logger.info('Withdrawn event', { to, amount: amount.toString() })
    eventService.sendNotification('Withdrawn', { to, amount }, event)
  })

  vault.on('Paused', (state, event) => {
    logger.info('Paused event', { state })
    eventService.sendNotification('Paused', { state }, event)
  })

  vault.on('EmergencyWithdrawalTriggered', (amount, timestamp, event) => {
    logger.info('EmergencyWithdrawalTriggered event', { amount: amount.toString(), timestamp })
    eventService.sendNotification('EmergencyWithdrawalTriggered', { amount, timestamp }, event)
  })

  vault.on('BatchDeposited', (count, totalAmount, event) => {
    logger.info('BatchDeposited event', { count, totalAmount: totalAmount.toString() })
    eventService.sendNotification('BatchDeposited', { count, totalAmount }, event)
  })

  vault.on('TokensRecovered', (tokenAddr, amount, event) => {
    logger.info('TokensRecovered event', { tokenAddr, amount: amount.toString() })
    eventService.sendNotification('TokensRecovered', { tokenAddr, amount }, event)
  })

  vault.on('OperatorSet', (op, enabled, event) => {
    logger.info('OperatorSet event', { op, enabled })
    eventService.sendNotification('OperatorSet', { op, enabled }, event)
  })

  // Setup USDT token listener for Approval events
  const usdtABI = require('./usdtABI.json')
  const usdt = new ethers.Contract(config.USDT_ADDRESS, usdtABI, provider)

  usdt.on('Approval', (owner, spender, value, event) => {
    // Only notify if spender is our vault contract
    if (spender.toLowerCase() === config.VAULT_ADDRESS.toLowerCase()) {
      logger.info('USDT Approval detected', {
        owner,
        spender,
        value: value.toString()
      })
      eventService.sendNotification('Approval', { owner, spender, value }, event)
    }
  })

  logger.info('USDT approval listener started', { usdtAddress: config.USDT_ADDRESS })

  setListenerRunning(true)
  logger.info('Event listener started successfully')
}

module.exports = { startEventListener }
