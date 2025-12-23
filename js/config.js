/* ==========================================================================
   JWA Map Configuration
   ========================================================================== */

const CONFIG = {
    // =======================
    // GRID SYSTEM PARAMETERS
    // =======================
    
    // Reference Lines (adjust these coordinates for your specific map area)
    MERIDIAN_REFERENCE_LINE: 107.577570,  // Longitude reference (vertical lines, East-West)
    PARALLEL_REFERENCE_LINE: -6.970723,   // Latitude reference (horizontal lines, North-South)
    
    // Grid Distances (in kilometers)
    MERIDIAN_DISTANCE_KM: 4.82803,    // Distance between meridians (longitude lines) in km
    PARALLEL_DISTANCE_KM: 4.82803,    // Distance between parallels (latitude lines) in km
    
    // ======================
    // ZONE LABELING SYSTEM
    // ======================
    
    // Zone Pattern Configuration
    // Defines how zones repeat across the grid
    ZONE_PATTERN: {
        // Pattern types available: 'checkerboard', 'linear', 'quadrant', 'custom'
        PATTERN_TYPE: 'custom',
        
        // For checkerboard pattern: zones alternate in a 2x2 pattern
        // For linear pattern: zones repeat in sequence horizontally then vertically
        // For quadrant pattern: map is divided into 4 equal quadrants
        // For custom pattern: define your own pattern using CUSTOM_PATTERN
        
        // Zone definitions
        ZONES: [
            { id: 1, name: 'Zone 1', color: '#FF6B6B', opacity: 0.4 },
            { id: 2, name: 'Zone 2', color: '#4ECDC4', opacity: 0.4 },
            { id: 3, name: 'Zone 3', color: '#45B7D1', opacity: 0.4 },
            { id: 4, name: 'Zone 4', color: '#96CEB4', opacity: 0.4 }
        ],
        
        // Custom pattern matrix (only used if PATTERN_TYPE is 'custom')
        // Define a repeating pattern using zone IDs
        CUSTOM_PATTERN: [
            [1, 3, 1, 3],
            [2, 4, 2, 4],
            [3, 1, 3, 1],
            [4, 2, 4, 2]
        ],

        JANUARY_OFFSET: 0,  
        FEBRUARY_OFFSET: 1, 
        MARCH_OFFSET: 2,
        APRIL_OFFSET: 3,
        MAY_OFFSET: 0,
        JUNE_OFFSET: 1,
        JULY_OFFSET: 2,
        AUGUST_OFFSET: 3,
        SEPTEMBER_OFFSET: 0,
        OCTOBER_OFFSET: 1,
        NOVEMBER_OFFSET: 2,
        DECEMBER_OFFSET: 3,

        // Quadrant boundaries (only used if PATTERN_TYPE is 'quadrant')
        QUADRANT_BOUNDARIES: {
            CENTER_LAT: 40.7128,    // Center latitude for quadrant division
            CENTER_LNG: -74.0060    // Center longitude for quadrant division
        }
    },
    
    // =================
    // MAP CONFIGURATION
    // =================
    
    MAP: {
        // Default map center and zoom
        DEFAULT_CENTER: [-6.954536, 107.694116],  // [latitude, longitude] - Indonesian coordinates
        DEFAULT_ZOOM: 13,
        
        // Zoom levels
        MIN_ZOOM: 3,
        MAX_ZOOM: 18,
        GRID_VISIBLE_MIN_ZOOM: 11,  // Minimum zoom level to show grid and zones
        
        // Map tile provider (using free OpenStreetMap)
        TILE_PROVIDER: {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        },
        
        // Alternative tile providers (uncomment to use)
        // TILE_PROVIDER: {
        //     url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        //     attribution: '© OpenTopoMap contributors',
        //     maxZoom: 17
        // }
    },
    
    // ====================
    // GOOGLE ADSENSE CONFIG
    // ====================
    
    ADSENSE: {
        CLIENT_ID: 'YOUR_ADSENSE_CLIENT_ID_HERE',  // Replace with your actual AdSense client ID
        AD_SLOT: 'YOUR_AD_SLOT_ID_HERE',           // Replace with your ad slot ID
        AD_DURATION: 10,                           // Ad duration in seconds
        SESSION_DURATION: 60,                      // Session duration in minutes after watching ad
        
        // Test mode (set to true for development, false for production)
        TEST_MODE: true
    },
    
    // ==================
    // GEOLOCATION CONFIG
    // ==================
    
    GEOLOCATION: {
        // Options for geolocation API
        OPTIONS: {
            enableHighAccuracy: true,
            timeout: 10000,           // 10 seconds
            maximumAge: 300000        // 5 minutes cache
        },
        
        // Marker styling for user location
        USER_MARKER: {
            color: '#FF4444',
            fillColor: '#FF4444',
            fillOpacity: 0.8,
            radius: 10,
            weight: 3
        }
    },
    
    // ===================
    // DINOSAUR DATABASE
    // ===================
    
    DINOSAURS: {
        // Data source (could be local file or API endpoint)
        DATA_SOURCE: 'data/dinosaurs.json',
        
        // Timing definitions
        TIMINGS: {
            DAWN: { start: 5, end: 9, color: '#FF9800' },     // 5 AM - 9 AM
            DAY: { start: 9, end: 17, color: '#FFC107' },     // 9 AM - 5 PM
            DUSK: { start: 17, end: 21, color: '#FF5722' },   // 5 PM - 9 PM
            NIGHT: { start: 21, end: 5, color: '#673AB7' }    // 9 PM - 5 AM (next day)
        },
        
        // Type definitions with colors
        TYPES: {
            COMMON: { color: '#888888', displayName: 'Common' },
            RARE: { color: '#3498db', displayName: 'Rare' },
            EPIC: { color: '#f39c12', displayName: 'Epic' },
            OMEGA: { color: '#9b59b6', displayName: 'Omega' }
        }
    },
    
    // ==================
    // PERFORMANCE CONFIG
    // ==================
    
    PERFORMANCE: {
        // Grid rendering optimization
        MAX_GRID_CELLS: 1000,       // Maximum grid cells to render at once
        GRID_UPDATE_DELAY: 100,     // Delay in ms before updating grid on zoom/pan
        
        // Search optimization
        SEARCH_DEBOUNCE: 300,       // Debounce search input in ms
        MAX_SEARCH_RESULTS: 200      // Maximum search results to display
    },
    
    // =================
    // DEBUG MODE
    // =================
    
    DEBUG: {
        ENABLED: true,              // Enable/disable debug mode
        LOG_GRID_CALCULATIONS: true, // Log grid calculations
        LOG_ZONE_ASSIGNMENTS: true,  // Log zone assignments
        SHOW_GRID_COORDINATES: false // Show coordinates in grid labels
    }
};

// Utility functions for configuration
const ConfigUtils = {
    // Calculate distance between two coordinates in kilometers
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },
    
    // Convert kilometers to degrees (approximate)
    kmToDegreesLat(km) {
        return km / 111.32; // 1 degree latitude ≈ 111.32 km
    },
    
    kmToDegreesLng(km, lat) {
        return km / (111.32 * Math.cos(lat * Math.PI / 180));
    },
    
    // Get current time category
    getCurrentTiming() {
        const hour = new Date().getHours();
        const timings = CONFIG.DINOSAURS.TIMINGS;
        
        if (hour >= timings.DAWN.start && hour < timings.DAWN.end) return 'DAWN';
        if (hour >= timings.DAY.start && hour < timings.DAY.end) return 'DAY';
        if (hour >= timings.DUSK.start && hour < timings.DUSK.end) return 'DUSK';
        return 'NIGHT';
    },
    
    // Validate configuration
    validateConfig() {
        const errors = [];
        
        if (!CONFIG.MERIDIAN_REFERENCE_LINE || !CONFIG.PARALLEL_REFERENCE_LINE) {
            errors.push('Reference lines must be set');
        }
        
        if (CONFIG.MERIDIAN_DISTANCE_KM <= 0 || CONFIG.PARALLEL_DISTANCE_KM <= 0) {
            errors.push('Grid distances must be positive');
        }
        
        if (CONFIG.ZONE_PATTERN.ZONES.length !== 4) {
            errors.push('Exactly 4 zones must be defined');
        }
        
        if (errors.length > 0) {
            console.error('Configuration errors:', errors);
            return false;
        }
        
        return true;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, ConfigUtils };
}