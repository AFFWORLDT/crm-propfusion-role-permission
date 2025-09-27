# Google Earth API Integration

This document describes the Google Earth API integration implemented in the PropFusion CRM system.

## Overview

The Google Earth API integration provides 3D Earth visualization capabilities alongside the existing Google Maps implementation. Users can now switch between 2D Google Maps and 3D Google Earth views for enhanced property visualization.

## Features

### 🗺️ Map Switching
- **Google Maps**: Traditional 2D map view with traffic, transit, and bicycling layers
- **Google Earth**: 3D Earth view with terrain, buildings, and satellite imagery

### 🌍 Google Earth Features
- **3D Terrain**: Realistic 3D terrain visualization
- **Building Models**: 3D building representations where available
- **Satellite Imagery**: High-resolution satellite views
- **Layer Controls**: Toggle buildings, terrain, and labels
- **Navigation Controls**: Zoom in/out, reset view, and view mode switching
- **Property Markers**: Interactive property placemarks with custom icons

### 🎛️ Controls
- **Navigation**: Home (reset), zoom in/out buttons
- **Layers**: Toggle buildings, terrain, and place labels
- **View Modes**: 3D Earth, 2D Map, Satellite
- **Expand/Collapse**: Full-screen mode support

## Components

### 1. MapSwitcher (`src/ui/MapSwitcher.jsx`)
Main component that allows users to switch between Google Maps and Google Earth views.

```jsx
import MapSwitcher from '../ui/MapSwitcher';

<MapSwitcher
  listingType="SELL"
  addresses={propertyData}
  initialHeight={700}
  onMarkerClick={handleMarkerClick}
  center={{ lat: 25.2048, lng: 55.2708 }}
/>
```

### 2. GoogleEarthMap (`src/ui/GoogleEarthMap.jsx`)
The Google Earth implementation component.

```jsx
import GoogleEarthMap from '../ui/GoogleEarthMap';

<GoogleEarthMap
  listingType="SELL"
  addresses={propertyData}
  initialHeight={700}
  onMarkerClick={handleMarkerClick}
  center={{ lat: 25.2048, lng: 55.2708 }}
/>
```

### 3. Google Earth Loader (`src/utils/googleEarthLoader.js`)
Utility for loading the Google Earth API dynamically.

```jsx
import { loadGoogleEarthAPI, isGoogleEarthLoaded } from '../utils/googleEarthLoader';

// Load the API
await loadGoogleEarthAPI();

// Check if loaded
if (isGoogleEarthLoaded()) {
  // Use Google Earth API
}
```

### 4. useGoogleEarth Hook (`src/hooks/useGoogleEarth.js`)
Custom hook for managing Google Earth API state.

```jsx
import { useGoogleEarth } from '../hooks/useGoogleEarth';

const { isLoading, isLoaded, error, reload } = useGoogleEarth();
```

## API Requirements

### Environment Variables
Add your Google Maps API key to your environment variables:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Google Earth API
The Google Earth API is loaded dynamically and requires:
- Google Maps API key with Earth API enabled
- Internet connection for API loading
- Modern browser with WebGL support

## Usage Examples

### Basic Implementation
```jsx
import MapSwitcher from '../ui/MapSwitcher';

function PropertyMap() {
  const properties = [
    {
      id: 1,
      name: "Luxury Villa",
      position: "25.2048,55.2708",
      price: "$1,500,000",
      status: "active"
    }
  ];

  return (
    <MapSwitcher
      listingType="SELL"
      addresses={properties}
      initialHeight={600}
    />
  );
}
```

### Custom Marker Click Handler
```jsx
function PropertyMap() {
  const handleMarkerClick = (property) => {
    console.log('Property clicked:', property);
    // Navigate to property details
    navigate(`/properties/${property.id}`);
  };

  return (
    <MapSwitcher
      listingType="SELL"
      addresses={properties}
      onMarkerClick={handleMarkerClick}
    />
  );
}
```

### Standalone Google Earth
```jsx
import GoogleEarthMap from '../ui/GoogleEarthMap';

function EarthView() {
  return (
    <GoogleEarthMap
      listingType="SELL"
      addresses={properties}
      initialHeight={800}
      center={{ lat: 25.2048, lng: 55.2708 }}
    />
  );
}
```

## Data Format

### Address/Property Format
Properties should have the following structure:

```javascript
{
  id: "property-id",
  name: "Property Name",
  position: "latitude,longitude", // e.g., "25.2048,55.2708"
  price: "$1,500,000",
  status: "active", // or "inactive"
  agentIcon: "https://example.com/agent-avatar.png", // optional
  location: {
    address: "Property Address",
    city: "Dubai",
    community: "Downtown"
  }
}
```

## Styling

### CSS Modules
The components use CSS modules for styling:
- `GoogleEarthMap.module.css` - Google Earth specific styles
- `MapSwitcher.module.css` - Map switcher styles

### Customization
You can customize the appearance by modifying the CSS modules or passing custom styles through props.

## Browser Support

### Required Features
- WebGL support
- Modern JavaScript (ES6+)
- HTTPS connection (for API loading)

### Supported Browsers
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Error Handling

### Common Issues
1. **API Key Issues**: Ensure your Google Maps API key is valid and has Earth API enabled
2. **Network Issues**: Check internet connection for API loading
3. **WebGL Support**: Verify browser supports WebGL
4. **HTTPS Required**: Google Earth API requires HTTPS in production

### Error States
The components handle various error states:
- Loading states with spinners
- Error messages with retry buttons
- Graceful fallbacks to Google Maps

## Performance Considerations

### Optimization Tips
1. **Lazy Loading**: Google Earth API is loaded only when needed
2. **Marker Clustering**: Consider implementing marker clustering for large datasets
3. **Viewport Culling**: Only render markers in the current viewport
4. **Memory Management**: Clean up event listeners and instances

### Best Practices
1. **Limit Markers**: Don't render too many markers simultaneously
2. **Efficient Updates**: Use React.memo for components that don't need frequent updates
3. **Error Boundaries**: Wrap components in error boundaries
4. **Loading States**: Always show loading states during API initialization

## Troubleshooting

### Common Problems

#### Google Earth Not Loading
```javascript
// Check if API is loaded
if (!window.google || !window.google.earth) {
  console.error('Google Earth API not available');
}
```

#### Markers Not Appearing
```javascript
// Verify position format
const position = parseLatLng("25.2048,55.2708");
if (!position) {
  console.error('Invalid position format');
}
```

#### Performance Issues
```javascript
// Limit the number of markers
const limitedAddresses = addresses.slice(0, 100);
```

## Future Enhancements

### Planned Features
1. **KML Import**: Support for importing KML files
2. **Custom Overlays**: Custom image overlays and polygons
3. **Street View Integration**: Seamless Street View integration
4. **Measurement Tools**: Distance and area measurement
5. **Screenshot Export**: Export map views as images

### API Improvements
1. **Offline Support**: Cached map tiles for offline viewing
2. **Progressive Loading**: Load map data progressively
3. **Custom Styling**: More customization options for map appearance

## Support

For issues or questions regarding the Google Earth integration:
1. Check the browser console for error messages
2. Verify your Google Maps API key configuration
3. Test with a minimal example to isolate issues
4. Check browser compatibility and WebGL support 