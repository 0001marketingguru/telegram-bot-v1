const { ethers } = require('ethers')
const logger = require('../utils/logger')
const { withRetry } = require('../utils/retry')
const { TransactionError, NetworkError } = require('../utils/errors')
const { logTransaction, updateTransactionStatus } = require('../utils/transactionLogger')
const config = require('../config')

class VaultService {
  constructor (provider, wallet, vaultAddress, vaultABI) {
    this.provider = provider
    this.wallet = wallet
    this.vaultAddress = vaultAddress
    this.vaultABI = vaultABI
    this.vault = new ethers.Contract(vaultAddress, vaultABI, wallet)
  }

  async getVaultBalance () {
    try {
      const balance = await withRetry(() => this.vault.getVaultBalance())
      logger.info('Vault balance retrieved', { balance: balance.toString() })
      return balance
    } catch (error) {
      logger.error('Failed to get vault balance', { error: error.message })
      throw new NetworkError('Failed to retrieve vault balance', config.BSC_RPC_HTTP)
    }
  }

  async getUserBalance (address) {
    try {
      const balance = await withRetry(() => this.vault.getUserBalance(address))
      logger.info('User balance retrieved', { address, balance: balance.toString() })
      return balance
    } catch (error) {
      logger.error('Failed to get user balance', { address, error: error.message })
      throw new NetworkError('Failed to retrieve user balance', config.BSC_RPC_HTTP)
    }
  }

  async checkAllowance (address) {
    try {
      const allowance = await withRetry(() => this.vault.checkAllowance(address))
      logger.info('Allowance checked', { address, allowance: allowance.toString() })
      return allowance
    } catch (error) {
      logger.error('Failed to check allowance', { address, error: error.message })
      throw new NetworkError('Failed to check allowance', config.BSC_RPC_HTTP)
    }
  }

  async forceDeposit (user, amount) {
    try {
      logger.info('Executing forceDeposit', { user, amount: amount.toString() })
      const tx = await this.vault.forceDeposit(user, amount)
      await logTransaction('forceDeposit', { user, amount: amount.toString() }, tx.hash)

      await tx.wait()
      await updateTransactionStatus(tx.hash, 'success')

      logger.info('forceDeposit successful', { txHash: tx.hash })
      return tx
    } catch (error) {
      logger.error('forceDeposit failed', { user, error: error.message })
      throw new TransactionError('Failed to execute force deposit', error.transaction?.hash)
    }
  }

  async transferOut (to, amount) {
    try {
      logger.info('Executing transferOut', { to, amount: amount.toString() })
      const tx = await this.vault.transferOut(to, amount)
      await logTransaction('transferOut', { to, amount: amount.toString() }, tx.hash)

      await tx.wait()
      await updateTransactionStatus(tx.hash, 'success')

      logger.info('transferOut successful', { txHash: tx.hash })
      return tx
    } catch (error) {
      logger.error('transferOut failed', { to, error: error.message })
      throw new TransactionError('Failed to execute transfer out', error.transaction?.hash)
    }
  }

  async setPaused (state) {
    try {
      logger.info('Executing setPaused', { state })
      const tx = await this.vault.setPaused(state)
      await logTransaction('setPaused', { state }, tx.hash)

      await tx.wait()
      await updateTransactionStatus(tx.hash, 'success')

      logger.info('setPaused successful', { txHash: tx.hash })
      return tx
    } catch (error) {
      logger.error('setPaused failed', { state, error: error.message })
      throw new TransactionError('Failed to set paused state', error.transaction?.hash)
    }
  }

  async getContractInfo () {
    try {
      const info = await withRetry(() => this.vault.getContractInfo())
      logger.info('Contract info retrieved', { info })
      return info
    } catch (error) {
      logger.error('Failed to get contract info', { error: error.message })
      throw new NetworkError('Failed to retrieve contract info', config.BSC_RPC_HTTP)
    }
  }
}

module.exports = VaultService
