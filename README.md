# Theater Employee App 🎭🎟️

## Overview

The Theater Employee App is a mobile application designed to streamline theater operations by providing employees with tools to manage tickets, validate entry, and enhance the overall customer experience. This app serves as a comprehensive solution for theater staff to efficiently handle ticket validation and entry management.

![Theater App](https://images.pexels.com/photos/7991182/pexels-photo-7991182.jpeg?auto=compress&cs=tinysrgb&w=400)

## Features

### 🔐 Employee Authentication
- Secure login system for theater staff
- Role-based access control for different staff positions
- Session management for secure operations

### 🎟️ Ticket Management
- View and manage ticket sales and availability
- Track ticket status (sold, used, refunded)
- Generate reports on ticket sales and attendance

### 📱 QR Code Scanning
- Fast and efficient QR code scanning for ticket validation
- Real-time validation against ticket database
- Prevent duplicate entries with instant status updates

### 👥 Customer Entry Validation
- Quick verification of customer tickets at entry points
- Streamlined entry process to reduce wait times
- Ability to handle special cases (VIP, accessibility needs)

### 📊 Analytics Dashboard
- Real-time attendance tracking
- Performance metrics for different shows and screenings
- Occupancy rates and peak time analysis

## Technology Stack

- **Frontend**: React Native with Expo
- **Navigation**: React Navigation
- **State Management**: React Context API
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Storage**: Async Storage for local data

## Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to the project directory
cd movie-theater-employee-app

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with the following variables:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start the development server
npm start
```

## Usage

1. **Login**: Employees log in with their credentials
2. **Scan Tickets**: Use the device camera to scan customer QR codes
3. **Validate Entry**: System automatically validates tickets and updates status
4. **Manage Exceptions**: Handle special cases or issues with ticket validation

## Development

```bash
# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Project Structure

```
/
├── assets/            # Images and static assets
├── config/            # Configuration files
├── Views/             # Screen components
├── App.tsx           # Main application component
├── index.ts          # Entry point
└── package.json      # Dependencies and scripts
```

## Future Enhancements

- Offline mode for operations during network outages
- Multi-language support for international theaters
- Integration with point-of-sale systems
- Push notifications for important alerts
- Staff scheduling and management features

## License

This project is proprietary and confidential.

---

Developed with ❤️ for theater staff everywhere