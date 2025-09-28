/* ==========================================================================
   Main Application for JWA Map
   ========================================================================== */

class JWAMapApp {
    constructor() {
        this.map = null;
        this.gridSystem = null;
        this.zoneManager = null;
        this.dinoDatabase = null;
        this.adManager = null;
        this.userLocationMarker = null;
        this.currentUserZone = null;
        
        this.init();
    }
    
    async init() {
        try {
            // Validate configuration
            if (!ConfigUtils.validateConfig()) {
                throw new Error('Invalid configuration');
            }
            
            // Initialize ad manager first (disabled for initial release)
            // this.adManager = new AdManager();
            
            // Wait for session to be established (disabled with ads)
            // await this.waitForSession();
            
            // Initialize map
            this.initializeMap();
            
            // Initialize grid and zone systems
            this.initializeGridAndZones();
            
            // Initialize dinosaur database
            await this.initializeDinoDatabase();
            
            // Set up event handlers
            this.setupEventHandlers();
            
            // Initialize geolocation
            this.initializeGeolocation();
            
            if (CONFIG.DEBUG.ENABLED) {
                console.log('JWA Map application initialized successfully');
                window.app = this; // Make available for debugging
            }
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Failed to load JWA Map. Please refresh the page.');
        }
    }
    
    async waitForSession() {
        // Disabled for initial release - immediately resolve
        return Promise.resolve();
    }
    
    initializeMap() {
        // Initialize Leaflet map
        this.map = L.map('map', {
            center: CONFIG.MAP.DEFAULT_CENTER,
            zoom: CONFIG.MAP.DEFAULT_ZOOM,
            minZoom: CONFIG.MAP.MIN_ZOOM,
            maxZoom: CONFIG.MAP.MAX_ZOOM,
            zoomControl: true,
            attributionControl: true
        });
        
        // Add tile layer
        L.tileLayer(CONFIG.MAP.TILE_PROVIDER.url, {
            attribution: CONFIG.MAP.TILE_PROVIDER.attribution,
            maxZoom: CONFIG.MAP.TILE_PROVIDER.maxZoom
        }).addTo(this.map);
        
        // Add map click handler
        this.map.on('click', (e) => {
            this.handleMapClick(e);
        });
        
        if (CONFIG.DEBUG.ENABLED) {
            console.log('Map initialized at', CONFIG.MAP.DEFAULT_CENTER);
        }
    }
    
    initializeGridAndZones() {
        // Wait for map to be fully ready before initializing grid and zones
        this.map.whenReady(() => {
            if (CONFIG.DEBUG.ENABLED) {
                console.log('Map is ready, initializing grid and zone systems');
            }
            
            // Initialize grid system
            this.gridSystem = new GridSystem(this.map);
            
            // Initialize zone manager
            this.zoneManager = new ZoneManager(this.map, this.gridSystem);
            
            // Force initial update after a short delay to ensure everything is ready
            setTimeout(() => {
                this.forceInitialZoneUpdate();
            }, 200);
            
            if (CONFIG.DEBUG.ENABLED) {
                console.log('Grid and zone systems initialized and initial update triggered');
            }
        });
    }
    
    async initializeDinoDatabase() {
        this.dinoDatabase = new DinosaurDatabase();
        await this.dinoDatabase.init();
        
        if (CONFIG.DEBUG.ENABLED) {
            console.log('Dinosaur database initialized');
        }
    }
    
    setupEventHandlers() {
        // My Location button
        const myLocationBtn = document.getElementById('myLocationBtn');
        if (myLocationBtn) {
            myLocationBtn.addEventListener('click', () => {
                this.goToMyLocation();
            });
        }
        
        // Toggle panel button
        const togglePanelBtn = document.getElementById('togglePanelBtn');
        const dinoPanel = document.getElementById('dinoPanel');
        if (togglePanelBtn && dinoPanel) {
            togglePanelBtn.addEventListener('click', () => {
                dinoPanel.classList.toggle('open');
            });
        }
        
        // Close panel button
        const closePanelBtn = document.getElementById('closePanelBtn');
        if (closePanelBtn && dinoPanel) {
            closePanelBtn.addEventListener('click', () => {
                dinoPanel.classList.remove('open');
            });
        }
        
        // Grid toggle
        const showGridToggle = document.getElementById('showGridToggle');
        if (showGridToggle) {
            showGridToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.gridSystem.show();
                    this.zoneManager.show();
                } else {
                    this.gridSystem.hide();
                    this.zoneManager.hide();
                }
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        
        // Emergency bypass button for ad modal
        const emergencyBypassBtn = document.getElementById('emergencyBypassBtn');
        if (emergencyBypassBtn) {
            emergencyBypassBtn.addEventListener('click', () => {
                if (this.adManager) {
                    this.adManager.emergencyBypass();
                }
            });
        }
        
        // About modal handlers
        const aboutBtn = document.getElementById('aboutBtn');
        const aboutModal = document.getElementById('aboutModal');
        const closeAboutModal = document.getElementById('closeAboutModal');
        
        if (aboutBtn && aboutModal) {
            aboutBtn.addEventListener('click', () => {
                aboutModal.style.display = 'flex';
            });
        }
        
        if (closeAboutModal && aboutModal) {
            closeAboutModal.addEventListener('click', () => {
                aboutModal.style.display = 'none';
            });
        }
        
        // Close About modal when clicking outside
        if (aboutModal) {
            aboutModal.addEventListener('click', (e) => {
                if (e.target === aboutModal) {
                    aboutModal.style.display = 'none';
                }
            });
        }
        
        // Window resize
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });
        
        if (CONFIG.DEBUG.ENABLED) {
            console.log('Event handlers set up');
        }
    }
    
    initializeGeolocation() {
        if (!navigator.geolocation) {
            console.warn('Geolocation is not supported by this browser');
            this.disableLocationFeatures();
            return;
        }
        
        // Try to get initial position
        this.getCurrentLocation();
    }
    
    getCurrentLocation() {
        const myLocationBtn = document.getElementById('myLocationBtn');
        
        if (myLocationBtn) {
            myLocationBtn.textContent = '📍 Getting location...';
            myLocationBtn.disabled = true;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.handleLocationSuccess(position);
            },
            (error) => {
                this.handleLocationError(error);
            },
            CONFIG.GEOLOCATION.OPTIONS
        );
    }
    
    handleLocationSuccess(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Update user location marker
        this.updateUserLocationMarker(lat, lng);
        
        // Auto-scroll map to user's location
        this.map.setView([lat, lng], 15, {
            animate: true,
            duration: 1.0
        });
        
        // Find current zone
        this.currentUserZone = this.zoneManager.getZoneAt(lat, lng);
        
        // Re-enable location button
        const myLocationBtn = document.getElementById('myLocationBtn');
        if (myLocationBtn) {
            myLocationBtn.textContent = '📍 My Location';
            myLocationBtn.disabled = false;
        }
        
        if (CONFIG.DEBUG.ENABLED) {
            console.log('User location:', lat, lng, 'Zone:', this.currentUserZone);
            console.log('Map centered to user location');
        }
    }
    
    handleLocationError(error) {
        console.error('Geolocation error:', error);
        
        let message = 'Could not get location';
        switch (error.code) {
            case error.PERMISSION_DENIED:
                message = 'Location access denied';
                break;
            case error.POSITION_UNAVAILABLE:
                message = 'Location unavailable';
                break;
            case error.TIMEOUT:
                message = 'Location request timeout';
                break;
        }
        
        // Re-enable location button with error message
        const myLocationBtn = document.getElementById('myLocationBtn');
        if (myLocationBtn) {
            myLocationBtn.textContent = '📍 ' + message;
            myLocationBtn.disabled = false;
        }
    }
    
    updateUserLocationMarker(lat, lng) {
        // Remove existing marker
        if (this.userLocationMarker) {
            this.map.removeLayer(this.userLocationMarker);
        }
        
        // Create new marker
        this.userLocationMarker = L.circleMarker([lat, lng], CONFIG.GEOLOCATION.USER_MARKER)
            .addTo(this.map)
            .bindPopup(`
                <div class="user-location-popup">
                    <h4>📍 Your Location</h4>
                    <p><strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
                    ${this.currentUserZone ? 
                        `<p><strong>Current Zone:</strong> ${this.currentUserZone.name}</p>` : 
                        '<p>No zone information available</p>'
                    }
                </div>
            `);
    }
    
    // Utility function to calculate distance between two coordinates (Haversine formula)
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // Distance in kilometers
    }
    
    // Find closest zone to a given coordinate
    findClosestZone(lat, lng, availableZoneIds) {
        let closestZone = null;
        let minDistance = Infinity;
        
        // Get zone information for available zones
        const zonesToCheck = availableZoneIds || CONFIG.ZONE_PATTERN.ZONES.map(z => z.id);
        
        zonesToCheck.forEach(zoneId => {
            const zoneInfo = this.zoneManager.getZoneInfo(zoneId);
            
            if (zoneInfo && zoneInfo.cells && zoneInfo.cells.length > 0) {
                // Find the closest cell in this zone
                let zoneMinDistance = Infinity;
                let zoneClosestCell = null;
                
                zoneInfo.cells.forEach(cell => {
                    if (cell && cell.center) {
                        // Access LatLng object properties correctly
                        const cellLat = cell.center.lat;
                        const cellLng = cell.center.lng;
                        
                        if (cellLat !== undefined && cellLng !== undefined) {
                            const distance = this.calculateDistance(lat, lng, cellLat, cellLng);
                            if (distance < zoneMinDistance) {
                                zoneMinDistance = distance;
                                zoneClosestCell = cell;
                            }
                        }
                    }
                });
                
                // Check if this zone is closer than previous zones
                if (zoneMinDistance < minDistance && zoneClosestCell) {
                    minDistance = zoneMinDistance;
                    closestZone = {
                        zoneId: zoneId,
                        zone: zoneInfo.zone,
                        distance: zoneMinDistance,
                        closestCell: zoneClosestCell
                    };
                }
            }
        });
        
        return closestZone;
    }
    
    // Get reference coordinates for finding closest zone
    getReferenceCoordinates() {
        // Priority: 1) User location, 2) Map center, 3) Default center
        if (this.userLocationMarker) {
            const userLatLng = this.userLocationMarker.getLatLng();
            return { lat: userLatLng.lat, lng: userLatLng.lng, source: 'user' };
        }
        
        if (this.map) {
            const center = this.map.getCenter();
            return { lat: center.lat, lng: center.lng, source: 'map' };
        }
        
        // Fallback to default center
        return { 
            lat: CONFIG.MAP.CENTER[0], 
            lng: CONFIG.MAP.CENTER[1], 
            source: 'default' 
        };
    }
    
    goToMyLocation() {
        if (this.userLocationMarker) {
            this.map.setView(this.userLocationMarker.getLatLng(), 15);
            this.userLocationMarker.openPopup();
        } else {
            this.getCurrentLocation();
        }
    }
    
    disableLocationFeatures() {
        const myLocationBtn = document.getElementById('myLocationBtn');
        if (myLocationBtn) {
            myLocationBtn.textContent = '📍 Location unavailable';
            myLocationBtn.disabled = true;
        }
    }
    
    handleMapClick(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        // Find zone at clicked location
        const zone = this.zoneManager.getZoneAt(lat, lng);
        
        if (zone && CONFIG.DEBUG.ENABLED) {
            console.log('Clicked zone:', zone);
            
            // Show popup with zone information
            L.popup()
                .setLatLng(e.latlng)
                .setContent(`
                    <div class="click-popup">
                        <h4>${zone.name}</h4>
                        <p><strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
                        <button onclick="app.showDinosaursInZone(${zone.id})" class="btn-small">
                            Show Dinosaurs
                        </button>
                    </div>
                `)
                .openOn(this.map);
        }
    }
    
    handleKeyboardShortcuts(e) {
        // Emergency bypass for ad modal (Ctrl+Enter)
        if (e.ctrlKey && e.key === 'Enter') {
            if (this.adManager && !this.adManager.hasActiveSession) {
                this.adManager.emergencyBypass();
                return;
            }
        }
        
        // Only handle other shortcuts if app is visible
        const app = document.getElementById('app');
        if (!app || app.style.display === 'none') return;
        
        // Toggle panel with 'P' key
        if (e.key === 'p' || e.key === 'P') {
            const dinoPanel = document.getElementById('dinoPanel');
            if (dinoPanel) {
                dinoPanel.classList.toggle('open');
            }
        }
        
        // Go to location with 'L' key
        if (e.key === 'l' || e.key === 'L') {
            this.goToMyLocation();
        }
        
        // Toggle grid with 'G' key
        if (e.key === 'g' || e.key === 'G') {
            const showGridToggle = document.getElementById('showGridToggle');
            if (showGridToggle) {
                showGridToggle.checked = !showGridToggle.checked;
                showGridToggle.dispatchEvent(new Event('change'));
            }
        }
        
        // Debug shortcuts (only in debug mode)
        if (CONFIG.DEBUG.ENABLED) {
            // Skip ad completely with 'S' key
            if (e.key === 's' || e.key === 'S') {
                if (this.adManager) {
                    this.adManager.skipAdCompletely();
                }
            }
        }
    }
    
    handleWindowResize() {
        // Invalidate map size after resize
        setTimeout(() => {
            if (this.map) {
                this.map.invalidateSize();
            }
        }, 100);
    }
    
    // Force initial zone update to ensure zones appear on first load
    forceInitialZoneUpdate() {
        if (this.gridSystem && this.zoneManager) {
            if (CONFIG.DEBUG.ENABLED) {
                console.log('Forcing initial zone update...');
            }
            
            // Force grid to calculate cells
            this.gridSystem.updateGrid();
            
            // Force zone manager to update zones
            this.zoneManager.updateZones();
            
            // Trigger a map event to ensure everything is synchronized
            this.map.fire('zonesNeedUpdate');
            
            if (CONFIG.DEBUG.ENABLED) {
                console.log('Initial zone update completed');
            }
        }
    }
    
    // Public methods for dinosaur search
    locateDinosaur(dinoId) {
        const dinosaur = this.dinoDatabase.findById(dinoId);
        if (!dinosaur) {
            console.error('Dinosaur not found:', dinoId);
            return;
        }
        
        // Get reference coordinates (user location -> map center -> default)
        const refCoords = this.getReferenceCoordinates();
        
        // Find closest zone where this dinosaur can be found
        const closestZone = this.findClosestZone(refCoords.lat, refCoords.lng, dinosaur.zones);
        
        if (!closestZone) {
            console.error('No accessible zones found for dinosaur:', dinosaur.name);
            
            // Fallback: try to use the first available zone
            if (dinosaur.zones && dinosaur.zones.length > 0) {
                const fallbackZoneId = dinosaur.zones[0];
                const fallbackZoneInfo = this.zoneManager.getZoneInfo(fallbackZoneId);
                
                if (fallbackZoneInfo && fallbackZoneInfo.cells && fallbackZoneInfo.cells.length > 0) {
                    // Use the first cell as fallback
                    this.zoneManager.highlightZone(fallbackZoneId, 5000);
                    this.map.setView(fallbackZoneInfo.cells[0].center, 14);
                    
                    L.popup()
                        .setLatLng(fallbackZoneInfo.cells[0].center)
                        .setContent(`
                            <div class="dino-location-popup">
                                <h4>🦕 ${dinosaur.name}</h4>
                                <p><strong>Type:</strong> ${CONFIG.DINOSAURS.TYPES[dinosaur.type.toUpperCase()].displayName}</p>
                                <p><strong>Active Times:</strong> ${dinosaur.timing.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}</p>
                                <p><strong>Found in:</strong> ${fallbackZoneInfo.zone.name}</p>
                                <p><em>Note: Could not calculate closest zone, showing first available zone.</em></p>
                            </div>
                        `)
                        .openOn(this.map);
                    return;
                }
            }
            return;
        }
        
        // Highlight only the closest zone
        this.zoneManager.highlightZone(closestZone.zoneId, 5000);
        
        // Zoom to the closest cell in the closest zone
        this.map.setView(closestZone.closestCell.center, 14);
        
        // Create informative popup content
        const distanceText = closestZone.distance < 1 ? 
            `${Math.round(closestZone.distance * 1000)}m` : 
            `${closestZone.distance.toFixed(1)}km`;
            
        const locationSource = {
            'user': '📍 your location',
            'map': '🗺️ current view',
            'default': '🎯 default location'
        }[refCoords.source];
        
        // Show popup with dinosaur information
        L.popup()
            .setLatLng(closestZone.closestCell.center)
            .setContent(`
                <div class="dino-location-popup">
                    <h4>🦕 ${dinosaur.name}</h4>
                    <p><strong>Type:</strong> ${CONFIG.DINOSAURS.TYPES[dinosaur.type.toUpperCase()].displayName}</p>
                    <p><strong>Active Times:</strong> ${dinosaur.timing.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}</p>
                    <p><strong>Closest Zone:</strong> ${closestZone.zone.name} (${distanceText} from ${locationSource})</p>
                    ${dinosaur.zones.length > 1 ? 
                        `<p><strong>Also found in:</strong> ${dinosaur.zones.filter(z => z !== closestZone.zoneId).map(z => `Zone ${z}`).join(', ')}</p>` : 
                        ''
                    }
                    <div class="popup-actions">
                        <button onclick="app.showAllZonesForDino(${dinoId})" class="btn-small">Show All Zones</button>
                    </div>
                </div>
            `)
            .openOn(this.map);
            
        // Auto-close dinosaur finder panel on mobile devices
        this.closePanelOnMobile();
            
        if (CONFIG.DEBUG.ENABLED) {
            console.log(`Located ${dinosaur.name} in closest zone:`, {
                zone: closestZone.zone.name,
                distance: closestZone.distance,
                referenceSource: refCoords.source,
                allZones: dinosaur.zones
            });
        }
    }
    
    // Method to show all zones for a dinosaur (called from popup button)
    showAllZonesForDino(dinoId) {
        const dinosaur = this.dinoDatabase.findById(dinoId);
        if (!dinosaur) return;
        
        // Highlight all zones where this dinosaur can be found
        dinosaur.zones.forEach(zoneId => {
            this.zoneManager.highlightZone(zoneId, 5000);
        });
        
        // Show updated popup with all zones info
        L.popup()
            .setLatLng(this.map.getCenter())
            .setContent(`
                <div class="dino-location-popup">
                    <h4>🦕 ${dinosaur.name} - All Locations</h4>
                    <p><strong>Found in all zones:</strong> ${dinosaur.zones.map(z => `Zone ${z}`).join(', ')}</p>
                    <p>All zones are now highlighted on the map!</p>
                </div>
            `)
            .openOn(this.map);
    }
    
    showDinosaursInZone(zoneId) {
        const zone = CONFIG.ZONE_PATTERN.ZONES.find(z => z.id === zoneId);
        
        if (!zone) return;
        
        // Open dino panel
        const dinoPanel = document.getElementById('dinoPanel');
        if (dinoPanel) {
            dinoPanel.classList.add('open');
        }
        
        // Use the filter system to show zone dinosaurs
        this.dinoDatabase.filterByZone(zoneId);
    }
    
    showError(message) {
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
                <div class="error-screen">
                    <div class="error-content">
                        <h2>⚠️ Error</h2>
                        <p>${message}</p>
                        <button class="btn" onclick="location.reload()">Reload Page</button>
                    </div>
                </div>
            `;
        }
    }
    
    // Debug and utility methods
    getAppInfo() {
        return {
            map: {
                center: this.map ? this.map.getCenter() : null,
                zoom: this.map ? this.map.getZoom() : null
            },
            grid: this.gridSystem ? this.gridSystem.getGridInfo() : null,
            zones: this.zoneManager ? this.zoneManager.getZoneStatistics() : null,
            dinosaurs: this.dinoDatabase ? this.dinoDatabase.exportData() : null,
            user: {
                location: this.userLocationMarker ? this.userLocationMarker.getLatLng() : null,
                zone: this.currentUserZone
            },
            session: this.adManager ? this.adManager.getSessionInfo() : null
        };
    }
    
    // Helper method to detect mobile devices and close dinosaur finder panel
    closePanelOnMobile() {
        // Check if device is mobile using viewport width and user agent
        const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            const dinoPanel = document.getElementById('dinoPanel');
            if (dinoPanel && dinoPanel.classList.contains('open')) {
                dinoPanel.classList.remove('open');
            }
        }
    }
    
    exportAllData() {
        return {
            config: CONFIG,
            app: this.getAppInfo(),
            grid: this.gridSystem ? this.gridSystem.exportGridData() : null,
            zones: this.zoneManager ? this.zoneManager.exportZoneData() : null
        };
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Global app instance
    window.app = new JWAMapApp();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JWAMapApp;
}