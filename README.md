# JWA Map - Jurassic World Alive Zone Tracker

A comprehensive web application for tracking zones and dinosaur locations in Jurassic World Alive. Features an interactive map with customizable grid overlay, zone management, and dinosaur finder.

## 🚀 Features

### ✅ Core Features Implemented

1. **Interactive Map View**
   - Free, self-hosted solution using Leaflet.js and OpenStreetMap
   - Zoom controls and pan functionality
   - Responsive design for mobile and desktop

2. **Customizable Grid Overlay System**
   - Configurable meridian and parallel reference lines
   - Adjustable grid distances (in kilometers)
   - Automatic grid line generation based on reference points

3. **Zone Color Overlay**
   - 4 distinct zones with transparent colors
   - Multiple zone pattern options (checkerboard, linear, quadrant, custom)
   - Zones only visible above certain zoom level

4. **Automatic Zone Labeling**
   - Smart label placement to avoid overcrowding
   - Configurable zone naming patterns
   - Visual zone indicators with customizable colors

5. **Zoom-Dependent Visibility**
   - Grid and zones only appear at zoom level 12 and above
   - Prevents map from being obscured at low zoom levels
   - Smooth transitions between zoom levels

6. **User Location Features**
   - "Go to My Location" button with GPS integration
   - User permission handling for location access
   - Current zone detection for user's location

7. **Dinosaur Browser & Finder**
   - Search by name with real-time filtering
   - Filter by type: Common (grey), Rare (blue), Epic (yellow), Omega (purple)
   - Filter by timing: Dawn, Day, Dusk, Night
   - Zone-specific dinosaur listings
   - "Show Zones" functionality to highlight dinosaur locations

8. **Ad Integration System**
   - First-time popup with 10-second ad requirement
   - 1-hour access after watching ad
   - Google AdSense integration placeholders
   - Session management with countdown timer

## 📁 Project Structure

```
jwa-map/
├── index.html                 # Main application page
├── css/
│   └── styles.css            # Application styles
├── js/
│   ├── config.js             # Configuration settings
│   ├── gridSystem.js         # Grid overlay system
│   ├── zoneManager.js        # Zone management and coloring
│   ├── dinoDatabase.js       # Dinosaur search and database
│   ├── adManager.js          # Ad integration and session management
│   └── app.js               # Main application logic
└── data/
    └── dinosaurs.json       # Dinosaur database (sample data)
```

## 🔧 Customization Guide

### Grid System Configuration

Edit `js/config.js` to customize the grid system:

```javascript
// Reference Lines (set these to your specific area coordinates)
MERIDIAN_REFERENCE_LINE: -74.0060,  // Longitude reference
PARALLEL_REFERENCE_LINE: 40.7128,   // Latitude reference

// Grid Distances (in kilometers)
MERIDIAN_DISTANCE_KM: 5,    // Distance between vertical lines
PARALLEL_DISTANCE_KM: 5,    // Distance between horizontal lines
```

### Zone Pattern Configuration

Choose from multiple zone patterns:

```javascript
ZONE_PATTERN: {
    // Available patterns: 'checkerboard', 'linear', 'quadrant', 'custom'
    PATTERN_TYPE: 'checkerboard',
    
    // Zone colors and opacity
    ZONES: [
        { id: 1, name: 'Zone 1', color: '#FF6B6B', opacity: 0.3 },
        { id: 2, name: 'Zone 2', color: '#4ECDC4', opacity: 0.3 },
        { id: 3, name: 'Zone 3', color: '#45B7D1', opacity: 0.3 },
        { id: 4, name: 'Zone 4', color: '#96CEB4', opacity: 0.3 }
    ]
}
```

### Google AdSense Integration

Update the AdSense configuration:

```javascript
ADSENSE: {
    CLIENT_ID: 'YOUR_ADSENSE_CLIENT_ID_HERE',  // Your AdSense client ID
    AD_SLOT: 'YOUR_AD_SLOT_ID_HERE',           // Your ad slot ID
    AD_DURATION: 10,                           // Ad duration in seconds
    SESSION_DURATION: 60,                      // Session duration in minutes
    TEST_MODE: false                           // Set to false for production
}
```

### Dinosaur Database

Update `data/dinosaurs.json` with your dinosaur data:

```json
{
  "id": 1,
  "name": "Dinosaur Name",
  "type": "common|rare|epic|omega",
  "zones": [1, 2, 3, 4],
  "timing": ["dawn", "day", "dusk", "night"],
  "description": "Dinosaur description"
}
```

## 🚀 Quick Start

1. **Clone or download the files**
2. **Customize configuration** in `js/config.js`:
   - Set your reference coordinates
   - Adjust grid distances
   - Configure zone patterns
   - Add your AdSense details
3. **Update dinosaur data** in `data/dinosaurs.json`
4. **Host the files** on any web server (can be local)
5. **Open in browser** and start using!

## 🔧 Advanced Configuration

### Map Tile Providers

You can change the map tiles by modifying the `TILE_PROVIDER` setting:

```javascript
// OpenStreetMap (default)
TILE_PROVIDER: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
}

// OpenTopoMap (topographic)
TILE_PROVIDER: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap contributors',
    maxZoom: 17
}
```

### Zone Pattern Types

#### 1. Checkerboard Pattern
Creates a 2x2 repeating pattern:
```
Zone1 Zone2 Zone1 Zone2
Zone3 Zone4 Zone3 Zone4
Zone1 Zone2 Zone1 Zone2
```

#### 2. Linear Pattern
Zones repeat in sequence:
```
Zone1 Zone2 Zone3 Zone4 Zone1 Zone2...
Zone1 Zone2 Zone3 Zone4 Zone1 Zone2...
```

#### 3. Quadrant Pattern
Divides map into 4 quadrants around a center point:
```
Zone2 | Zone1
------|------
Zone3 | Zone4
```

#### 4. Custom Pattern
Define your own repeating pattern:
```javascript
CUSTOM_PATTERN: [
    [1, 2, 1],
    [3, 4, 3],
    [1, 2, 1]
]
```

## 📱 Usage Instructions

### Basic Controls
- **Zoom**: Use mouse wheel or zoom controls
- **Pan**: Click and drag the map
- **Grid Toggle**: Use checkbox in map controls
- **Location**: Click "My Location" button (requires permission)
- **Dino Finder**: Click "🦕 Dino Finder" to open search panel

### Keyboard Shortcuts
- `G` - Toggle grid visibility
- `P` - Toggle dinosaur panel
- `L` - Go to your location

### Search & Filter
- **Search by name**: Type in the search box
- **Filter by type**: Click type buttons (Common, Rare, Epic, Omega)
- **Filter by timing**: Click timing buttons (Dawn, Day, Dusk, Night)
- **Active dinosaurs**: Currently active dinosaurs are highlighted

## 🔍 Debugging

Enable debug mode in `js/config.js`:

```javascript
DEBUG: {
    ENABLED: true,
    LOG_GRID_CALCULATIONS: true,
    LOG_ZONE_ASSIGNMENTS: true,
    SHOW_GRID_COORDINATES: true
}
```

Access debug information in browser console:
```javascript
// Get app information
console.log(app.getAppInfo());

// Export all data
console.log(app.exportAllData());

// Get grid information
console.log(app.gridSystem.getGridInfo());
```

## 🌟 Browser Support

- Chrome/Edge 70+
- Firefox 65+
- Safari 12+
- Mobile browsers with GPS support

## 📝 Notes

- The application uses localStorage to save session data
- Geolocation requires HTTPS in production
- AdSense integration requires approval and proper setup
- Sample dinosaur data is included for demonstration

## 🔄 Updates & Maintenance

To update dinosaur data:
1. Edit `data/dinosaurs.json`
2. Refresh the application

To update grid configuration:
1. Edit `js/config.js`
2. Refresh the application

## 🐛 Troubleshooting

**Grid not showing**: Check zoom level (must be 12+) and grid toggle
**Location not working**: Check browser permissions and HTTPS
**Ads not showing**: Verify AdSense configuration and approval status
**Dinosaurs not loading**: Check `data/dinosaurs.json` format and accessibility

For more help, check the browser console for error messages.