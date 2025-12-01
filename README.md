# Aji Family Expense App

A complete offline-first React Native family expense tracking application for iOS (iPhone and iPad).

## Features

- **Role-based Access**: Admin and User roles with different permissions
- **Expense Tracking**: Add, edit, delete expenses with categories
- **Analytics**: Visual charts and statistics for expense analysis
- **Offline First**: All data stored locally on the device
- **Localization**: Indonesian currency (Rp) and date formats

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run on iOS Simulator**
   ```bash
   npm run ios
   ```
   Or use Expo Go:
   ```bash
   npx expo start
   ```

## First Time Use

1. On first launch, you will be prompted to create an Admin account.
2. Use this account to log in.
3. As an admin, you can create other family member accounts in the Admin tab.
4. Default categories are automatically created.

## Project Structure

- `src/components`: Reusable UI components
- `src/contexts`: React Context (Auth)
- `src/navigation`: Navigation configuration
- `src/screens`: Application screens
- `src/services`: Business logic (Auth, Storage)
- `src/styles`: Global styles and colors
- `src/utils`: Helper functions
