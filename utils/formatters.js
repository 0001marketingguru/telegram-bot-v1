const { ethers } = require('ethers')
const config = require('../config')

function formatBalance (amount) {
  return ethers.formatUnits(amount, config.DECIMALS)
}

function formatAddress (address) {
  if (!address) return 'N/A'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function formatTimestamp (timestamp) {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp)
  return date.toISOString()
}

function formatTransactionLink (txHash) {
  return `${config.BSCSCAN_TX_URL}${txHash}`
}

function formatAddressLink (address) {
  return `${config.BSCSCAN_ADDRESS_URL}${address}`
}

function formatAmount (wei) {
  return ethers.formatUnits(wei, config.USDT_DECIMALS)
}

module.exports = {
  formatBalance,
  formatAddress,
  formatTimestamp,
  formatTransactionLink,
  formatAddressLink,
  formatAmount
}
