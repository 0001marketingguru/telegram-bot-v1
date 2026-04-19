const fs = require('fs').promises
const path = require('path')
const logger = require('./logger')

const logDir = path.join(__dirname, '..', 'logs')
const logFile = path.join(logDir, 'transactions.json')

async function ensureLogDir () {
  try {
    await fs.mkdir(logDir, { recursive: true })
  } catch (error) {
    logger.error('Failed to create log directory', { error: error.message })
  }
}

async function logTransaction (type, data, txHash, status = 'pending') {
  await ensureLogDir()

  const log = {
    timestamp: new Date().toISOString(),
    type,
    data,
    txHash,
    status
  }

  try {
    let logs = []
    try {
      const content = await fs.readFile(logFile, 'utf8')
      logs = JSON.parse(content)
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error
      }
    }

    logs.push(log)

    const maxLogs = 1000
    if (logs.length > maxLogs) {
      logs = logs.slice(-maxLogs)
    }

    await fs.writeFile(logFile, JSON.stringify(logs, null, 2))
    logger.info('Transaction logged', { type, txHash, status })
  } catch (error) {
    logger.error('Failed to log transaction', { error: error.message })
  }
}

async function getTransactionHistory (limit = 50) {
  try {
    const content = await fs.readFile(logFile, 'utf8')
    const logs = JSON.parse(content)
    return logs.slice(-limit)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []
    }
    logger.error('Failed to read transaction history', { error: error.message })
    return []
  }
}

async function updateTransactionStatus (txHash, status) {
  try {
    const content = await fs.readFile(logFile, 'utf8')
    const logs = JSON.parse(content)

    const log = logs.find(l => l.txHash === txHash)
    if (log) {
      log.status = status
      await fs.writeFile(logFile, JSON.stringify(logs, null, 2))
      logger.info('Transaction status updated', { txHash, status })
    }
  } catch (error) {
    logger.error('Failed to update transaction status', { error: error.message })
  }
}

function formatTransactionLog (tx) {
  const statusEmoji = {
    pending: '⏳',
    success: '✅',
    failed: '❌'
  }

  return `${statusEmoji[tx.status] || '⏳'} *${tx.type}*\n` +
    `🔗 \`${tx.txHash}\`\n` +
    `📅 ${tx.timestamp}`
}

module.exports = {
  logTransaction,
  getTransactionHistory,
  updateTransactionStatus,
  formatTransactionLog
}
