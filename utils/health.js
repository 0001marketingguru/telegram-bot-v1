let listenerRunning = false
let lastError = null
const startTime = Date.now()

function setListenerRunning (running) {
  listenerRunning = running
}

function setLastError (error) {
  lastError = error
}

function isListenerRunning () {
  return listenerRunning
}

function getLastError () {
  return lastError
}

function getUptime () {
  return Math.floor((Date.now() - startTime) / 1000)
}

async function checkBlockchainConnection (provider) {
  try {
    const blockNumber = await provider.getBlockNumber()
    return {
      status: 'connected',
      blockNumber,
      latency: null
    }
  } catch (error) {
    return {
      status: 'disconnected',
      blockNumber: null,
      latency: null,
      error: error.message
    }
  }
}

async function checkBotStatus (bot) {
  try {
    const botInfo = await bot.telegram.getMe()
    return {
      status: 'online',
      username: botInfo.username,
      id: botInfo.id
    }
  } catch (error) {
    return {
      status: 'offline',
      username: null,
      id: null,
      error: error.message
    }
  }
}

function formatHealthReport (health) {
  const uptime = getUptime()
  const hours = Math.floor(uptime / 3600)
  const minutes = Math.floor((uptime % 3600) / 60)
  const seconds = uptime % 60

  let report = '🏥 *Health Report*\n\n'

  report += '🤖 *Bot Status*\n'
  report += `Status: ${health.bot.status === 'online' ? '✅ Online' : '❌ Offline'}\n`
  if (health.bot.username) {
    report += `Username: @${health.bot.username}\n`
  }
  report += '\n'

  report += '⛓️ *Blockchain*\n'
  report += `Status: ${health.blockchain.status === 'connected' ? '✅ Connected' : '❌ Disconnected'}\n`
  if (health.blockchain.blockNumber !== null) {
    report += `Block: ${health.blockchain.blockNumber}\n`
  }
  report += '\n'

  report += '📡 *Event Listener*\n'
  report += `Status: ${listenerRunning ? '✅ Running' : '❌ Stopped'}\n`
  report += '\n'

  report += '⏱️ *Uptime*\n'
  report += `${hours}h ${minutes}m ${seconds}s\n`

  if (lastError) {
    report += '\n⚠️ *Last Error*\n'
    report += `${lastError.message}\n`
  }

  return report
}

module.exports = {
  setListenerRunning,
  setLastError,
  isListenerRunning,
  getLastError,
  getUptime,
  checkBlockchainConnection,
  checkBotStatus,
  formatHealthReport
}
