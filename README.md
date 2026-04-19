# Telegram Vault Bot

A Telegram bot for managing a vault contract on Binance Smart Chain (BSC). The bot provides real-time event monitoring, admin commands for vault management, and user balance checking.

## Features

- **Real-time Event Monitoring**: Listens to all vault contract events and sends notifications to admins
- **Admin Commands**: Full control over vault operations (deposit, withdraw, pause/unpause)
- **User Balance Checking**: Anyone can check vault and user balances
- **Multi-Admin Support**: Support for multiple admin Telegram IDs
- **Transaction History**: Logs all transactions for audit trail
- **Health Monitoring**: Built-in health check command
- **Structured Logging**: Winston-based logging with multiple levels
- **Error Handling**: Comprehensive error classification and retry logic
- **Input Validation**: Validates all addresses and amounts before processing

## Prerequisites

- Node.js 16+ installed
- npm or yarn installed
- Telegram Bot Token (from @BotFather)
- BSC RPC URL (HTTP and WebSocket)
- Vault contract address deployed on BSC
- Admin Telegram ID(s) (from @userinfobot)
- Bot wallet private key with BNB for gas

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd telegram-bot-v1
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` with your configuration:
```env
# --- TELEGRAM CONFIG ---
TELEGRAM_BOT_TOKEN=your_bot_token_here
ADMIN_IDS=618067115,123456789  # Comma-separated admin IDs

# --- BLOCKCHAIN CONFIG ---
BSC_RPC_WSS=wss://bsc-ws-node.nariox.org:443
BSC_RPC_HTTP=https://bsc-dataseed.binance.org/
VAULT_ADDRESS=0xC567aFFbB929E386af74EAA249b4676C925eC9f8
USDT_ADDRESS=0x55d398326f99059fF775485246999027B3197955

# --- BOT WALLET CONFIG ---
BOT_PRIVATE_KEY=your_private_key_here
```

5. Run the bot:
```bash
npm start
```

## Commands

### Read Commands (Anyone)

- `/start` - Start the bot and see welcome message
- `/help` - Display all available commands
- `/balance` - Check total vault balance
- `/user <address>` - Check user's vault balance
- `/allowance <address>` - Check user's allowance

### Admin Commands (Admin Only)

- `/deposit <address> <amount>` - Force deposit USDT to vault for user
- `/withdraw <address> <amount>` - Withdraw USDT from vault to address
- `/pause` - Pause the vault contract
- `/unpause` - Unpause the vault contract

### Monitoring Commands

- `/health` - Check bot health status (bot, blockchain, listener, uptime)
- `/history` - View recent transaction history

## Architecture

```
telegram-bot-v1/
├── commands/           # Bot command handlers
│   ├── index.js        # Command registry
│   ├── balance.js      # Read-only commands
│   ├── admin.js        # Admin commands
│   └── help.js         # Help commands
├── services/           # Business logic layer
│   ├── vaultService.js # Contract interactions
│   ├── telegramService.js # Telegram API wrapper
│   └── eventService.js # Event processing
├── config/             # Configuration management
│   ├── index.js        # Main config
│   ├── constants.js    # Constants
│   └── validators.js   # Input validation
├── utils/              # Utility functions
│   ├── logger.js       # Winston logger
│   ├── errors.js       # Error types
│   ├── retry.js        # Retry logic
│   ├── formatters.js   # Message formatting
│   ├── transactionLogger.js # Transaction logging
│   └── health.js       # Health checks
├── index.js            # Main entry point
├── listener.js         # Event listener
├── notifier.js         # Notification sender
├── vaultABI.json       # Contract ABI
├── .env                # Environment variables
├── .eslintrc.js        # ESLint config
├── .gitignore          # Git ignore
├── package.json        # Dependencies
└── README.md           # This file
```

## Events Monitored

The bot monitors and notifies admins for the following contract events:

- **Approval**: New USDT approval detected
- **Deposited**: User deposited USDT to vault
- **Withdrawn**: Funds withdrawn from vault
- **BatchDeposited**: Batch deposit completed
- **Paused**: Contract pause state changed
- **EmergencyWithdrawalTriggered**: Emergency withdrawal executed
- **TokensRecovered**: Tokens recovered from contract
- **OperatorSet**: Operator permissions changed

## Security Features

- **Input Validation**: All addresses and amounts are validated before processing
- **Multi-Admin Support**: Multiple admin IDs supported for team collaboration
- **Config Validation**: Startup validation of all required configuration
- **Error Classification**: Specific error types for better handling
- **Retry Logic**: Exponential backoff for failed RPC calls
- **Transaction Logging**: Complete audit trail of all transactions

## Logging

Logs are stored in the `logs/` directory:

- `combined.log` - All log entries
- `error.log` - Error-level logs only
- `transactions.json` - Transaction history

Log levels: error, warn, info, debug

## Development

### Linting

Check code quality:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint:fix
```

### Environment Variables

Required environment variables:

- `TELEGRAM_BOT_TOKEN` - Telegram bot token from @BotFather
- `ADMIN_IDS` - Comma-separated list of admin Telegram IDs
- `BSC_RPC_HTTP` - BSC RPC HTTP endpoint
- `BSC_RPC_WSS` - BSC RPC WebSocket endpoint
- `VAULT_ADDRESS` - Vault contract address on BSC
- `USDT_ADDRESS` - USDT token address on BSC
- `BOT_PRIVATE_KEY` - Private key for bot wallet (has BNB for gas)

Optional environment variables:

- `LOG_LEVEL` - Logging level (default: info)
- `NODE_ENV` - Environment (default: development)

## Troubleshooting

### Bot won't start

1. Check that all required environment variables are set in `.env`
2. Verify that the bot token is valid
3. Ensure the RPC URLs are accessible
4. Check that the vault address is correct

### Events not being received

1. Verify that the WebSocket RPC URL is working
2. Check that the vault address is correct
3. Ensure the contract ABI matches the deployed contract
4. Check logs for any errors

### Transactions failing

1. Verify that the bot wallet has enough BNB for gas
2. Check that the vault contract is not paused
3. Ensure the bot wallet has operator permissions
4. Review transaction logs for specific error messages

### Health check shows issues

1. Check blockchain connection status
2. Verify bot is online and responding
3. Ensure event listener is running
4. Review recent errors in logs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Test thoroughly
6. Submit a pull request

## License

ISC

## Support

For issues and questions, please open an issue on the repository.
