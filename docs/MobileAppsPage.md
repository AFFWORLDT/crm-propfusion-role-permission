# Mobile Apps Page

## Overview

The Mobile Apps page is a new addition to the PropFusion CRM system that showcases our mobile applications and provides information about domain-based API integration.

## Location

The page is accessible through the admin panel at:
```
Admin → General → Mobile Apps
```

## Features

### 1. App Store Links
- **Apple App Store**: Direct link to [PropFusion on App Store](https://apps.apple.com/us/app/propfusion/id6744414324)
- **Google Play Store**: Direct link to [PropFusion on Play Store](https://play.google.com/store/apps/details?id=com.saurabhjaykar1603.PROPFUSIONAPP&hl=en)

### 2. App Features Showcase
- Mobile-first design
- Real-time synchronization
- Offline access capabilities
- Cross-platform compatibility

### 3. API Information
- Domain-based API configuration
- API endpoint examples
- Security features
- Integration capabilities

### 4. System Requirements
- **iOS**: iOS 15.1+, iPhone/iPad/iPod touch, macOS 12.0+, Apple Vision Pro
- **Android**: Android 6.0+, 2GB RAM, 50MB storage

### 5. Support Links
- Contact Support
- Report Issues
- Request Features

## Technical Implementation

### Files Created
- `src/pages/general/MobileApps.jsx` - Main component
- `src/pages/general/MobileApps.module.css` - Styling

### Routing
- Added to `src/App.jsx` under admin general routes
- Accessible at `/admin/general/mobile-apps`

### Navigation
- Added to `src/pages/general/General.jsx` with phone icon
- Appears in the General settings section

## Design Features

- Responsive design for all screen sizes
- Modern gradient header with smartphone icon
- Interactive store buttons with hover effects
- Feature cards with icons and descriptions
- Clean API documentation section
- Support links for user assistance

## Usage

1. Navigate to Admin → General → Mobile Apps
2. View app store links and download options
3. Learn about app features and capabilities
4. Understand API integration requirements
5. Access support resources

## Customization

The page can be easily customized by:
- Updating app store URLs in the component
- Modifying feature descriptions
- Adding new app capabilities
- Updating system requirements
- Customizing styling in the CSS module

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive Web App compatible
