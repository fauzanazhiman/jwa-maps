/* ==========================================================================
   Grid System for JWA Map
   ========================================================================== */

class GridSystem {
    constructor(map) {
        this.map = map;
        this.gridLayer = null;
        this.isVisible = true;
        this.currentZoom = map.getZoom();
        this.gridCells = new Map(); // Store grid cell data
        
        this.init();
    }
    
    init() {
        // Create layer group for grid elements
        this.gridLayer = L.layerGroup().addTo(this.map);
        
        // Listen for zoom and move events
        this.map.on('zoomend', () => this.handleZoomChange());
        this.map.on('moveend', () => this.handleMapMove());
        
        // Listen for map ready to ensure initial grid render
        this.map.on('ready', () => {
            if (CONFIG.DEBUG.ENABLED) {
                console.log('Map ready - initializing grid');
            }
            setTimeout(() => this.updateGrid(), 50);
        });
        
        // Also update on view reset
        this.map.on('viewreset', () => {
            if (CONFIG.DEBUG.ENABLED) {
                console.log('View reset - updating grid');
            }
            setTimeout(() => this.updateGrid(), 25);
        });
        
        // Try initial update, but don't worry if map isn't ready yet
        try {
            this.updateGrid();
        } catch (error) {
            if (CONFIG.DEBUG.ENABLED) {
                console.log('Initial grid update failed (map not ready), will retry on map ready event');
            }
        }
        
        if (CONFIG.DEBUG.ENABLED) {
            console.log('Grid system initialized');
        }
    }
    
    handleZoomChange() {
        const newZoom = this.map.getZoom();
        this.currentZoom = newZoom;
        
        // Update grid visibility based on zoom level
        if (newZoom >= CONFIG.MAP.GRID_VISIBLE_MIN_ZOOM) {
            this.show();
        } else {
            this.hide();
        }
        
        // Update zoom display
        const zoomDisplay = document.getElementById('zoomLevel');
        if (zoomDisplay) {
            zoomDisplay.textContent = newZoom;
        }
        
        // Debounce grid update for performance
        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(() => {
            this.updateGrid();
            // Trigger a zone manager update after grid is ready
            setTimeout(() => {
                this.map.fire('zonesNeedUpdate');
            }, 50);
        }, CONFIG.PERFORMANCE.GRID_UPDATE_DELAY);
    }
    
    handleMapMove() {
        // Debounce grid update for performance
        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(() => {
            this.updateGrid();
        }, CONFIG.PERFORMANCE.GRID_UPDATE_DELAY);
    }
    
    updateGrid() {
        if (!this.isVisible || this.currentZoom < CONFIG.MAP.GRID_VISIBLE_MIN_ZOOM) {
            return;
        }
        
        // Clear existing grid
        this.clearGrid();
        
        // Get map bounds
        const bounds = this.map.getBounds();
        const gridData = this.calculateGridLines(bounds);
        
        // Draw grid lines
        this.drawGridLines(gridData.horizontalLines, gridData.verticalLines);
        
        // Calculate and store grid cells
        this.calculateGridCells(gridData.horizontalLines, gridData.verticalLines);
    }
    
    calculateGridLines(bounds) {
        const refLat = CONFIG.PARALLEL_REFERENCE_LINE;
        const refLng = CONFIG.MERIDIAN_REFERENCE_LINE;
        const latDistanceKm = CONFIG.PARALLEL_DISTANCE_KM;
        const lngDistanceKm = CONFIG.MERIDIAN_DISTANCE_KM;
        
        // More precise conversion for Indonesian coordinates
        // 1 degree latitude ≈ 111.32 km everywhere
        const latDistanceDeg = latDistanceKm / 111.32;
        
        // For longitude, use the reference latitude for more accuracy
        const lngDistanceDeg = lngDistanceKm / (111.32 * Math.cos(refLat * Math.PI / 180));
        
        // Expand bounds to ensure full coverage
        const expandedBounds = {
            north: bounds.getNorth() + latDistanceDeg,
            south: bounds.getSouth() - latDistanceDeg,
            east: bounds.getEast() + lngDistanceDeg,
            west: bounds.getWest() - lngDistanceDeg
        };
        
        // Calculate grid lines with expanded bounds
        const horizontalLines = this.calculateParallelLines(expandedBounds, refLat, latDistanceDeg);
        const verticalLines = this.calculateMeridianLines(expandedBounds, refLng, lngDistanceDeg);
        
        if (CONFIG.DEBUG.LOG_GRID_CALCULATIONS) {
            console.log('Grid calculation:', {
                bounds: bounds,
                expandedBounds: expandedBounds,
                refLat: refLat,
                refLng: refLng,
                latDistanceDeg: latDistanceDeg,
                lngDistanceDeg: lngDistanceDeg,
                horizontalLines: horizontalLines.length,
                verticalLines: verticalLines.length
            });
        }
        
        return { horizontalLines, verticalLines };
    }
    
    calculateParallelLines(bounds, refLat, distanceDeg) {
        const lines = [];
        const south = bounds.south || bounds.getSouth();
        const north = bounds.north || bounds.getNorth();
        
        // Find the starting line (closest reference line south of viewport)
        let currentLat = refLat;
        
        // Go to the southernmost line we need
        while (currentLat > south) {
            currentLat -= distanceDeg;
        }
        
        // Add extra line before the viewport for better coverage
        currentLat -= distanceDeg;
        
        // Add lines within and beyond bounds
        while (currentLat <= north + distanceDeg) {
            lines.push(currentLat);
            currentLat += distanceDeg;
        }
        
        return lines;
    }
    
    calculateMeridianLines(bounds, refLng, distanceDeg) {
        const lines = [];
        const west = bounds.west || bounds.getWest();
        const east = bounds.east || bounds.getEast();
        
        // Find the starting line (closest reference line west of viewport)
        let currentLng = refLng;
        
        // Go to the westernmost line we need
        while (currentLng > west) {
            currentLng -= distanceDeg;
        }
        
        // Add extra line before the viewport for better coverage
        currentLng -= distanceDeg;
        
        // Add lines within and beyond bounds
        while (currentLng <= east + distanceDeg) {
            lines.push(currentLng);
            currentLng += distanceDeg;
        }
        
        return lines;
    }
    
    drawGridLines(horizontalLines, verticalLines) {
        const bounds = this.map.getBounds();
        const west = bounds.getWest();
        const east = bounds.getEast();
        const south = bounds.getSouth();
        const north = bounds.getNorth();
        
        const lineOptions = {
            color: '#4CAF50',
            weight: 1,
            opacity: 0.7,
            dashArray: '5, 5'
        };
        
        // Draw horizontal lines (parallels)
        horizontalLines.forEach(lat => {
            const line = L.polyline([
                [lat, west],
                [lat, east]
            ], lineOptions);
            this.gridLayer.addLayer(line);
        });
        
        // Draw vertical lines (meridians)
        verticalLines.forEach(lng => {
            const line = L.polyline([
                [south, lng],
                [north, lng]
            ], lineOptions);
            this.gridLayer.addLayer(line);
        });
    }
    
    calculateGridCells(horizontalLines, verticalLines) {
        this.gridCells.clear();
        
        let cellCount = 0;
        
        // Calculate absolute grid positions based on reference lines
        const refLat = CONFIG.PARALLEL_REFERENCE_LINE;
        const refLng = CONFIG.MERIDIAN_REFERENCE_LINE;
        const latDistanceKm = CONFIG.PARALLEL_DISTANCE_KM;
        const lngDistanceKm = CONFIG.MERIDIAN_DISTANCE_KM;
        
        const latDistanceDeg = latDistanceKm / 111.32;
        // Use reference latitude for consistent longitude conversion
        const lngDistanceDeg = lngDistanceKm / (111.32 * Math.cos(refLat * Math.PI / 180));
        
        // Create grid cells from intersections
        for (let i = 0; i < horizontalLines.length - 1; i++) {
            for (let j = 0; j < verticalLines.length - 1; j++) {
                if (cellCount >= CONFIG.PERFORMANCE.MAX_GRID_CELLS) {
                    console.warn('Maximum grid cells reached, stopping calculation');
                    return;
                }
                
                const south = horizontalLines[i];
                const north = horizontalLines[i + 1];
                const west = verticalLines[j];
                const east = verticalLines[j + 1];
                
                // Calculate absolute grid coordinates relative to reference point
                const absoluteGridX = Math.round((west - refLng) / lngDistanceDeg);
                const absoluteGridY = Math.round((south - refLat) / latDistanceDeg);
                
                const cellId = `${absoluteGridX}-${absoluteGridY}`;
                const cell = {
                    id: cellId,
                    bounds: L.latLngBounds(
                        L.latLng(south, west),
                        L.latLng(north, east)
                    ),
                    center: L.latLng((south + north) / 2, (west + east) / 2),
                    gridX: absoluteGridX,
                    gridY: absoluteGridY,
                    localX: j, // Local position in current view
                    localY: i  // Local position in current view
                };
                
                this.gridCells.set(cellId, cell);
                cellCount++;
            }
        }
        
        if (CONFIG.DEBUG.LOG_GRID_CALCULATIONS) {
            console.log(`Created ${cellCount} grid cells with absolute coordinates`);
            console.log('Sample cells:', Array.from(this.gridCells.values()).slice(0, 3));
        }
    }
    
    getGridCellAt(lat, lng) {
        for (const [cellId, cell] of this.gridCells.entries()) {
            if (cell.bounds.contains(L.latLng(lat, lng))) {
                return cell;
            }
        }
        return null;
    }
    
    getAllGridCells() {
        return this.gridCells;
    }
    
    show() {
        if (!this.isVisible) {
            this.isVisible = true;
            if (this.gridLayer && this.map.hasLayer(this.gridLayer)) {
                this.map.addLayer(this.gridLayer);
            }
            this.updateGrid();
        }
    }
    
    hide() {
        if (this.isVisible) {
            this.isVisible = false;
            if (this.gridLayer && this.map.hasLayer(this.gridLayer)) {
                this.map.removeLayer(this.gridLayer);
            }
        }
    }
    
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    clearGrid() {
        if (this.gridLayer) {
            this.gridLayer.clearLayers();
        }
    }
    
    // Utility methods
    getGridInfo() {
        return {
            isVisible: this.isVisible,
            currentZoom: this.currentZoom,
            cellCount: this.gridCells.size,
            config: {
                meridianRef: CONFIG.MERIDIAN_REFERENCE_LINE,
                parallelRef: CONFIG.PARALLEL_REFERENCE_LINE,
                meridianDistance: CONFIG.MERIDIAN_DISTANCE_KM,
                parallelDistance: CONFIG.PARALLEL_DISTANCE_KM,
                minZoom: CONFIG.MAP.GRID_VISIBLE_MIN_ZOOM
            }
        };
    }
    
    // Method to update configuration dynamically
    updateConfig(newConfig) {
        // Update relevant config values
        Object.assign(CONFIG, newConfig);
        
        // Validate new configuration
        if (!ConfigUtils.validateConfig()) {
            console.error('Invalid configuration provided');
            return false;
        }
        
        // Rebuild grid with new configuration
        this.updateGrid();
        
        if (CONFIG.DEBUG.ENABLED) {
            console.log('Grid configuration updated:', newConfig);
        }
        
        return true;
    }
    
    // Export grid data for debugging
    exportGridData() {
        const data = {
            config: this.getGridInfo(),
            cells: Array.from(this.gridCells.entries()).map(([id, cell]) => ({
                id: id,
                center: [cell.center.lat, cell.center.lng],
                bounds: {
                    south: cell.bounds.getSouth(),
                    north: cell.bounds.getNorth(),
                    west: cell.bounds.getWest(),
                    east: cell.bounds.getEast()
                },
                gridPosition: [cell.gridX, cell.gridY]
            }))
        };
        
        return data;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GridSystem;
}