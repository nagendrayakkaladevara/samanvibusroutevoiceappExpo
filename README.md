# Samanvi Bus Route Voice App

A React Native mobile application built with Expo that provides audio announcements for bus routes and stops. This app helps passengers navigate bus routes with audio guidance, making public transportation more accessible. Features secure user authentication and persistent login sessions.

## 🚌 Features

### 🔐 Authentication & Security
- **User Login System**: Secure authentication with backend API integration
- **Persistent Sessions**: Login remains valid for 2 days with automatic session management
- **Session Validation**: Automatic cleanup of expired sessions
- **Smart Logout**: Conditional logout option only when logged in

### 🎵 Audio & Navigation
- **Route Selection**: Browse and select from multiple bus routes
- **Audio Announcements**: Play audio announcements for each bus stop
- **Stop Information**: View detailed information about each stop including stop codes
- **Offline Capable**: Audio files are bundled with the app

### ⚙️ Settings & Configuration
- **Audio Controls**: Enable/disable audio announcements
- **App Information**: Comprehensive about section with features and contact info
- **Help & Support**: Step-by-step usage guide with contact information
- **Smart UI**: Settings adapt based on login state

### 🎨 User Experience
- **Modern UI**: Clean, accessible interface with custom styling
- **Loading States**: Professional loading indicators and user feedback
- **Error Handling**: Comprehensive error messages and validation
- **Cross-Platform**: Works on both iOS and Android devices
- **Responsive Design**: Optimized for various screen sizes

## 🏗️ Architecture

### 🔌 Backend Integration
- **API Endpoint**: `https://samanvi-backend.vercel.app/api/users/login`
- **Authentication Flow**: Username/password validation with JWT-like session management
- **Data Persistence**: AsyncStorage for local session management
- **Network Handling**: Comprehensive error handling for network requests

### 📱 State Management
- **Login State**: Centralized authentication state management
- **Session Persistence**: Automatic login state restoration on app restart
- **Real-time Updates**: Dynamic UI updates based on authentication status
- **Cross-Screen Sync**: Login state synchronized across all screens

## 📱 Screenshots

The app features a modern interface with:
- **Login Screen**: Clean authentication form with validation and loading states
- **Home Screen**: Displaying all available bus routes (post-authentication)
- **Route Details**: Comprehensive stop information with audio controls
- **Settings Screen**: Adaptive settings based on user authentication status
- **Audio Player**: Intuitive audio controls for stop announcements

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router with tab-based navigation
- **Authentication**: Custom login system with backend API
- **Storage**: AsyncStorage for persistent session management
- **Audio**: Expo AV for audio playbook
- **UI Components**: Custom components with Lucide React Native icons
- **Styling**: React Native StyleSheet with custom fonts and themes
- **Language**: TypeScript for type safety
- **Network**: Fetch API with comprehensive error handling

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) app on your mobile device (for testing)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd samanvibusroutevoiceappExpo
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install additional packages**
   ```bash
   npm install @react-native-async-storage/async-storage
   # or
   yarn add @react-native-async-storage/async-storage
   ```

4. **Start the development server**
   ```bash
   npx expo start
   # or
   yarn start
   ```

5. **Run on your device**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `a` for Android emulator or `i` for iOS simulator

## 📁 Project Structure

```
samanvibusroutevoiceappExpo/
├── app/                    # Expo Router app directory
│   ├── _layout.tsx        # Root layout with tab navigation
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── _layout.tsx    # Tab layout configuration
│   │   ├── index.tsx      # Home screen with authentication
│   │   └── settings.tsx   # Settings screen with logout
│   ├── +not-found.tsx     # 404 page
│   └── route-details.tsx  # Route details screen
├── assets/                 # Static assets
│   ├── audio/             # Audio files for announcements
│   └── images/            # Images and icons
├── components/            # Reusable components
│   └── AudioPlayer.tsx    # Audio player component
├── data/                  # Data files
│   └── busRoutes.ts       # Bus route data with stop information
├── hooks/                 # Custom React hooks
│   └── useFrameworkReady.ts
├── types/                 # TypeScript type definitions
│   └── routes.ts          # Route and stop interfaces
└── package.json           # Dependencies and scripts
```

## 🔐 Authentication System

### Login Flow
1. **User Input**: Username and password validation
2. **API Request**: Secure POST request to backend
3. **Session Creation**: 2-day persistent session storage
4. **State Management**: Automatic login state synchronization

### API Integration
```typescript
// Login endpoint
// POST https://samanvi-backend.vercel.app/api/users/login

// Request payload
{
  "username": "john_doe",
  "password": "securepassword123"
}

// Success response
{
  "message": "Login successful",
  "user": {
    "id": 2,
    "login": true,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Session Management
- **Duration**: 2 days automatic expiration
- **Storage**: AsyncStorage for persistence
- **Validation**: Automatic session validation on app startup
- **Cleanup**: Expired sessions automatically removed

## 🎵 Audio Files

The app includes audio files for bus stop announcements located in `assets/audio/`:


## 🚌 Available Routes

The app currently includes the following bus routes:

### 🎯 **Quick Actions (🙂)**
- **Welcome Message** [Coming soon]
- **Dinner Break** - Audio announcement for meal breaks
- **Washroom Break** - Audio announcement for restroom stops

### 🏛️ **Hyderabad City Route (🏛️)**
**Complete Hyderabad Metro Route**: Choutuppal to BHEL
- **Key Stops**: Ramoji Film City → Hayat Nagar → Vanasthalipuram → LB Nagar → Dilsukhnagar → Koti → Abids → Nampally → Khairatabad → Panjagutta → Ameerpet → SR Nagar → Erragadda → Moosapet → Kukatpally → JNTU → Miyapur → Chandanagar → Lingampally → BHEL
- **Total Stops**: 34 major stops across Hyderabad

### 🚌 **Inter-State AC Routes**

#### **ST-A02: HYD - Kakinada (Via Mandapeta) AC**
- **Route**: Vijayawada → Eluru → Tadepalligudem → Tanuku → Mandapeta → Kakinada
- **Total Stops**: 32 stops
- **Service Type**: Air Conditioned

#### **ST-A04: HYD - Kakinada (Via Rajahmundry) AC**
- **Route**: Vijayawada → Eluru → Rajahmundry → Peddapuram → Samarlakota → Kakinada
- **Total Stops**: 28 stops
- **Service Type**: Air Conditioned

#### **ST-A06: HYD - Kakinada (Via Anaparthi) AC**
- **Route**: Vijayawada → Eluru → Rajahmundry → Anaparthi → Samarlakota → Kakinada
- **Total Stops**: 29 stops
- **Service Type**: Air Conditioned

#### **ST-VH02: HYD - Visakhapatnam AC**
- **Route**: Vijayawada → Eluru → Rajahmundry → Annavaram → Tuni → Anakapalli → Visakhapatnam
- **Total Stops**: 34 stops
- **Service Type**: Air Conditioned

### 🚐 **Inter-State Non-AC Routes**

#### **ST-12: HYD - Kakinada (Via Mandapeta) Non-AC**
- **Route**: Vijayawada → Eluru → Tadepalligudem → Tanuku → Mandapeta → Draksharamam → Kakinada
- **Total Stops**: 32 stops
- **Service Type**: Non Air Conditioned

#### **ST-122: HYD - Kakinada (Via Anaparthi) Non-AC**
- **Route**: Vijayawada → Eluru → Rajahmundry → Anaparthi → Samarlakota → Kakinada
- **Total Stops**: 29 stops
- **Service Type**: Non Air Conditioned

#### **ST-PH02: HYD - Pithapuram (Via Rajahmundry) Non-AC** [Coming Soon]
- **Route**: Vijayawada → Eluru → Rajahmundry → [Route under development]
- **Status**: Coming Soon
- **Service Type**: Non Air Conditioned

### 🗺️ **Route Categories**

#### **City Routes**
- **Hyderabad Metro**: Complete city coverage with 34 stops
- **Service Area**: Greater Hyderabad Municipal Corporation

#### **Interstate Routes**
- **Andhra Pradesh**: Extensive coverage to major cities
- **Primary Destinations**: Kakinada, Visakhapatnam, Pithapuram
- **Service Types**: Both AC and Non-AC options available

#### **Special Services**
- **Quick Actions**: Operational announcements and passenger services
- **Audio Guidance**: Professional Telugu announcements for all stops
- **Route Variants**: Multiple route options for same destination

### 🎵 **Audio Features**
- **Professional Announcements**: Clear Telugu audio for each stop
- **Stop Codes**: Unique identification codes for major stops
- **Service Announcements**: Break notifications and passenger information
- **Quality Audio**: High-quality MP3 files for clear playback

## 🔧 Configuration

### Environment Setup
```bash
# Install required dependencies
npm install @react-native-async-storage/async-storage
npm install lucide-react-native
npm install expo-av
npm install expo-router
```

### Adding New Routes

To add a new bus route:

1. Add route data to `data/busRoutes.ts`:
   ```typescript
   {
     id: '6',
     routeNumber: '300',
     routeName: 'New Route',
     stops: [
       { 
         id: '1', 
         name: 'Stop 1', 
         code: 'ST001', 
         audioFile: 'route300_stop1.mp3' 
       },
       // ... more stops
     ]
   }
   ```

2. Add corresponding audio files to `assets/audio/`
3. Update the `BusRoute` interface in `types/routes.ts` if needed

### Backend Configuration

To connect to a different backend:

1. Update the API endpoint in `app/(tabs)/index.tsx`:
   ```typescript
   const response = await fetch('YOUR_API_ENDPOINT', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ username, password }),
   });
   ```

2. Adjust response handling based on your API structure

## 🎨 Customization

### Styling Theme
The app uses a professional color scheme:
- **Primary**: `#000000` (Black)
- **Background**: `#f8f8f8` (Light Gray)
- **Secondary Background**: `#F2F2F2`
- **Text**: `#070707` (Dark Gray)
- **Success**: `#2e7d32` (Green)
- **Error**: `#d32f2f` (Red)
- **Fonts**: Sans-serif system fonts

### Component Styling
```typescript
// Example custom styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
```

### Icons
The app uses Lucide React Native icons for consistent design:
- `Bus` - Route indicators
- `Volume2/VolumeX` - Audio controls
- `LogOut` - Authentication actions
- `Settings` - Configuration options

## 📱 Building for Production

### Development Build
```bash
npx expo start
```

### Preview Build
```bash
npx expo build:web
```

### Production Build
```bash
# For Android
npx expo build:android

# For iOS  
npx expo build:ios

# Using EAS Build (recommended)
eas build --platform android
eas build --platform ios
```

### Environment Variables
Create `.env` file for production configuration:
```env
API_BASE_URL=https://your-backend-url.com
SESSION_DURATION=172800000  # 2 days in milliseconds
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Session persistence after app restart
- [ ] Session expiration after 2 days
- [ ] Logout functionality
- [ ] Audio playback on all routes
- [ ] Settings screen responsiveness
- [ ] Network error handling

### Automated Testing
```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint
```

## 🔒 Security Features

- **Input Validation**: Username and password validation
- **Session Expiration**: Automatic 2-day session timeout
- **Secure Storage**: AsyncStorage for sensitive data
- **Error Handling**: No sensitive information in error messages
- **Network Security**: HTTPS API communication

## 🌐 Contact Information

**Samanvi Travels**
- **Website**: http://www.samanvitravels.com
- **Email**: support@busrouteguide.com
- **Phone**: +1 (555) 123-4567
- **Address**: Honer IDL Acc Rd, near IDL Lake, Prashanti Nagar, Habeeb Nagar, Moosapet, Hyderabad, Telangana 500072

**Support Hours**: Monday - Friday, 8:00 AM - 6:00 PM EST

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use consistent naming conventions
- Add proper error handling
- Test on both iOS and Android
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Troubleshooting

### Common Issues

**Login Issues**
- Verify network connection
- Check username/password format
- Ensure backend API is accessible

**Audio Playback Issues**
- Check device volume settings
- Verify audio files are properly bundled
- Test with different audio formats

**Session Issues**
- Clear app storage if sessions behave unexpectedly
- Check AsyncStorage permissions

### Getting Help
1. Check the [Expo documentation](https://docs.expo.dev/)
2. Review the [React Native documentation](https://reactnative.dev/)
3. Open an issue in the repository
4. Contact support team

## 🔮 Future Enhancements

### Planned Features
- [ ] **Real-time Bus Tracking**: GPS integration for live bus locations
- [ ] **Push Notifications**: Alerts for approaching stops and delays
- [ ] **Offline Maps**: Route maps available without internet
- [ ] **Multi-language Support**: Tamil, Telugu, Hindi language options
- [ ] **Accessibility Improvements**: Enhanced VoiceOver/TalkBack support
- [ ] **Social Features**: User reviews and route ratings

### Technical Improvements
- [ ] **Biometric Authentication**: Fingerprint/Face ID login
- [ ] **Background Audio**: Continue announcements when app is minimized
- [ ] **Caching System**: Improved performance with intelligent caching
- [ ] **Analytics Integration**: User behavior tracking and insights
- [ ] **Transit API Integration**: Real-time data from transit authorities

### UI/UX Enhancements
- [ ] **Dark Mode**: System-based theme switching
- [ ] **Customizable Themes**: User-selectable color schemes
- [ ] **Route Favorites**: Save frequently used routes
- [ ] **Trip Planning**: Multi-route journey planning
- [ ] **Accessibility Mode**: High contrast and large text options

---

**Built with ❤️ using React Native and Expo**  
**By Sai Nagendra Yakkaladevara**  
**© 2024 Samanvi Travels. All rights reserved.** 