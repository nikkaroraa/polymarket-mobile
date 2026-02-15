# 📱 Polymarket Mobile

A mobile app to view and place Polymarket bets from your phone.

## Features

- 💰 **View Balances** - Check your USDC and POL balances
- 🔍 **Search Markets** - Find betting markets by keyword
- 🎯 **Place Bets** - Place bets with confirmation prompts
- 📊 **View Positions** - See your open positions
- 💸 **Redeem Winnings** - Claim your winning positions
- ⚙️ **Secure Storage** - API key stored in iOS Keychain

## Quick Start

### 1. Install Expo Go on your iPhone

Download from the App Store: [Expo Go](https://apps.apple.com/app/expo-go/id982107779)

### 2. Clone and run

```bash
git clone https://github.com/nikkaroraa/polymarket-mobile.git
cd polymarket-mobile
bun install
bunx expo start
```

### 3. Scan the QR code

Open Expo Go on your iPhone and scan the QR code from the terminal.

## Stack

- **Expo** - React Native framework
- **TypeScript** - Type safety
- **expo-secure-store** - Secure API key storage

## API

Connects to [Bankr API](https://docs.bankr.bot) for Polymarket operations.

## License

MIT
