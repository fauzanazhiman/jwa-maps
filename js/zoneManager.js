/* ==========================================================================
   Zone Manager for JWA Map
   ========================================================================== */

class ZoneManager {
    constructor(map, gridSystem) {
        this.map = map;
        this.gridSystem = gridSystem;
        this.zoneLayer = null;
        this.zoneAssignments = new Map(); // Store zone assignments for grid cells
        this.isVisible = true;
        this.zoneLabelCache = new Map(); // Cache zone labels for performance
        
        this.init();
    }
    
    init() {
        // Create single layer group for zones with integrated labels
        this.zoneLayer = L.layerGroup().addTo(this.map);
        
        // Listen for grid updates
        this.gridSystem.map.on('moveend zoomend', () => {
            setTimeout(() => this.updateZones(), CONFIG.PERFORMANCE.GRID_UPDATE_DELAY + 50);
        });
        
        // Listen for explicit zone update requests
        this.map.on('zonesNeedUpdate', () => {
            this.updateZones();
        });
        
        // Listen for map ready events to ensure initial render
        this.map.on('ready', () => {
            if (CONFIG.DEBUG.ENABLED) {
                console.log('Map ready event received, scheduling zone update');
            }
            setTimeout(() => this.updateZones(), 100);
        });
        
        // Also listen for when the map view is reset (important for first load)
        this.map.on('viewreset', () => {
            if (CONFIG.DEBUG.ENABLED) {
                console.log('Map view reset, updating zones');
            }
            setTimeout(() => this.updateZones(), 50);
        });
        
        if (CONFIG.DEBUG.ENABLED) {
            console.log('Zone manager initialized - using integrated zone+label system');
        }
    }
    
    updateZones() {
        if (!this.isVisible || this.map.getZoom() < CONFIG.MAP.GRID_VISIBLE_MIN_ZOOM) {
            this.clearZones();
            return;
        }
        
        // Clear existing zones
        this.clearZones();
        
        // Get grid cells and assign zones
        const gridCells = this.gridSystem.getAllGridCells();
        this.assignZones(gridCells);
        
        // Draw zones with integrated labels
        this.drawZonesWithLabels();
        
        if (CONFIG.DEBUG.ENABLED) {
            console.log(`Updated zones with integrated labels at zoom ${this.map.getZoom()}`);
        }
    }
    
    // Method to refresh zones and labels if needed
    refreshZones() {
        // Small delay to ensure elements render properly
        setTimeout(() => {
            if (this.zoneLayer && this.map.hasLayer(this.zoneLayer)) {
                // Force visibility of all elements in the zone layer
                this.zoneLayer.eachLayer(layer => {
                    if (layer instanceof L.Marker) {
                        // This is a label
                        const element = layer.getElement();
                        if (element) {
                            element.style.setProperty('visibility', 'visible', 'important');
                            element.style.setProperty('display', 'block', 'important');
                            element.style.setProperty('z-index', '1000', 'important');
                        }
                    }
                });
                
                const totalElements = this.zoneLayer.getLayers().length;
                
                if (CONFIG.DEBUG.ENABLED) {
                    console.log(`Zone layer refresh: ${totalElements} total elements (zones + labels)`);
                }
            }
        }, 100);
    }
    
    // Force labels to be visible (separate method for debugging)
    forceLabelsVisible() {
        if (!this.zoneLayer) return;
        
        let labelCount = 0;
        this.zoneLayer.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                labelCount++;
                const element = layer.getElement();
                if (element) {
                    element.style.visibility = 'visible';
                    element.style.display = 'block';
                    element.style.opacity = '1';
                    element.style.zIndex = '2000';
                    
                    // Force the inner span to be visible too
                    const span = element.querySelector('span');
                    if (span) {
                        span.style.visibility = 'visible';
                        span.style.display = 'block';
                        span.style.opacity = '1';
                    }
                }
            }
        });
        
        if (CONFIG.DEBUG.ENABLED) {
            console.log(`Forced ${labelCount} labels to be visible`);
        }
    }
    
    assignZones(gridCells) {
        this.zoneAssignments.clear();
        
        const pattern = CONFIG.ZONE_PATTERN;
        
        gridCells.forEach((cell, cellId) => {
            let zoneId;
            
            switch (pattern.PATTERN_TYPE) {
                case 'checkerboard':
                    zoneId = this.calculateCheckerboardZone(cell.gridX, cell.gridY);
                    break;
                    
                case 'linear':
                    zoneId = this.calculateLinearZone(cell.gridX, cell.gridY);
                    break;
                    
                case 'quadrant':
                    zoneId = this.calculateQuadrantZone(cell.center.lat, cell.center.lng);
                    break;
                    
                case 'custom':
                    zoneId = this.calculateCustomZone(cell.gridX, cell.gridY);
                    break;
                    
                default:
                    zoneId = 1;
                    console.warn('Unknown pattern type, defaulting to zone 1');
            }
            
            // Ensure zoneId is within valid range (1-4)
            zoneId = Math.max(1, Math.min(4, zoneId));
            
            const zone = pattern.ZONES.find(z => z.id === zoneId);
            
            this.zoneAssignments.set(cellId, {
                zoneId: zoneId,
                zone: zone,
                cell: cell
            });
        });
        
        if (CONFIG.DEBUG.LOG_ZONE_ASSIGNMENTS) {
            console.log('Zone assignments:', Array.from(this.zoneAssignments.entries()));
        }
    }
    
    calculateCheckerboardZone(gridX, gridY) {
        // Use absolute grid coordinates to ensure consistency across zoom levels
        // Make sure we handle negative coordinates properly
        const patternX = ((gridX % 2) + 2) % 2; // Ensure positive result
        const patternY = ((gridY % 2) + 2) % 2; // Ensure positive result
        
        // Map pattern coordinates to zone IDs
        if (patternX === 0 && patternY === 0) return 1;
        if (patternX === 1 && patternY === 0) return 2;
        if (patternX === 0 && patternY === 1) return 3;
        return 4;
    }
    
    calculateLinearZone(gridX, gridY) {
        // Create a repeating pattern where zones repeat in sequence
        // Use absolute coordinates for consistency
        const totalIndex = Math.abs(gridY) * 1000 + Math.abs(gridX); // Handle negative coordinates
        return (totalIndex % 4) + 1;
    }
    
    calculateQuadrantZone(lat, lng) {
        const centerLat = CONFIG.ZONE_PATTERN.QUADRANT_BOUNDARIES.CENTER_LAT;
        const centerLng = CONFIG.ZONE_PATTERN.QUADRANT_BOUNDARIES.CENTER_LNG;
        
        const isNorth = lat >= centerLat;
        const isEast = lng >= centerLng;
        
        if (isNorth && isEast) return 1; // Northeast
        if (isNorth && !isEast) return 2; // Northwest
        if (!isNorth && !isEast) return 3; // Southwest
        return 4; // Southeast
    }
    
    calculateCustomZone(gridX, gridY) {
        const pattern = CONFIG.ZONE_PATTERN.CUSTOM_PATTERN;
        const patternHeight = pattern.length;
        const patternWidth = pattern[0].length;
        
        // Handle negative coordinates properly
        const patternX = ((gridX % patternWidth) + patternWidth) % patternWidth;
        const patternY = ((gridY % patternHeight) + patternHeight) % patternHeight;
        
        // Get the base zone value from the pattern
        const baseZone = pattern[patternY][patternX];
        
        // Get the current offset based on month and first Monday rule
        const offset = this.getCurrentMonthOffset();
        
        // Apply offset to rotate the zone (zones are 1-4, so we adjust accordingly)
        // offset = 0: no change (1,2,3,4 -> 1,2,3,4)
        // offset = 1: rotate by 1 (1,2,3,4 -> 2,3,4,1)
        // offset = 2: rotate by 2 (1,2,3,4 -> 3,4,1,2)
        // offset = 3: rotate by 3 (1,2,3,4 -> 4,1,2,3)
        const rotatedZone = ((baseZone - 1 + offset) % 4) + 1;
        
        return rotatedZone;
    }
    
    /**
     * Get the current month's offset, considering the first Monday rule.
     * The offset only applies starting from the first Monday of the month.
     * Before the first Monday, the previous month's offset is used.
     */
    getCurrentMonthOffset() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // 0-indexed (0 = January)
        const currentDay = now.getDate();
        
        // Find the first Monday of the current month
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const firstDayWeekday = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, ...
        
        // Calculate which day of the month is the first Monday
        // If first day is Monday (1), first Monday is day 1
        // If first day is Tuesday (2), first Monday is day 7 (1 + 7 - 2 + 1 = 7)
        // If first day is Sunday (0), first Monday is day 2
        let firstMondayDay;
        if (firstDayWeekday === 1) {
            firstMondayDay = 1; // First day is Monday
        } else if (firstDayWeekday === 0) {
            firstMondayDay = 2; // First day is Sunday, Monday is the 2nd
        } else {
            firstMondayDay = 1 + (8 - firstDayWeekday); // Days until next Monday
        }
        
        // Determine which month's offset to use
        let effectiveMonth;
        if (currentDay >= firstMondayDay) {
            // We're on or after the first Monday, use current month's offset
            effectiveMonth = currentMonth;
        } else {
            // We're before the first Monday, use previous month's offset
            effectiveMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        }
        
        // Get the offset for the effective month
        const monthOffsets = [
            CONFIG.ZONE_PATTERN.JANUARY_OFFSET,   // 0 = January
            CONFIG.ZONE_PATTERN.FEBRUARY_OFFSET,  // 1 = February
            CONFIG.ZONE_PATTERN.MARCH_OFFSET,     // 2 = March
            CONFIG.ZONE_PATTERN.APRIL_OFFSET,     // 3 = April
            CONFIG.ZONE_PATTERN.MAY_OFFSET,       // 4 = May
            CONFIG.ZONE_PATTERN.JUNE_OFFSET,      // 5 = June
            CONFIG.ZONE_PATTERN.JULY_OFFSET,      // 6 = July
            CONFIG.ZONE_PATTERN.AUGUST_OFFSET,    // 7 = August
            CONFIG.ZONE_PATTERN.SEPTEMBER_OFFSET, // 8 = September
            CONFIG.ZONE_PATTERN.OCTOBER_OFFSET,   // 9 = October
            CONFIG.ZONE_PATTERN.NOVEMBER_OFFSET,  // 10 = November
            CONFIG.ZONE_PATTERN.DECEMBER_OFFSET   // 11 = December
        ];
        
        const offset = monthOffsets[effectiveMonth] || 0;
        
        if (CONFIG.DEBUG.ENABLED && CONFIG.DEBUG.LOG_ZONE_ASSIGNMENTS) {
            console.log(`Month offset calculation: Current date ${now.toDateString()}, First Monday: day ${firstMondayDay}, Effective month: ${effectiveMonth}, Offset: ${offset}`);
        }
        
        return offset;
    }
    
    drawZonesWithLabels() {
        if (!this.zoneLayer) {
            console.error('Zone layer not initialized!');
            return;
        }
        
        // Group zone assignments by zone ID for label placement
        const zoneGroups = new Map();
        
        // First, draw all zone rectangles and group them
        this.zoneAssignments.forEach((assignment, cellId) => {
            const { zone, cell } = assignment;
            
            // Create zone rectangle with improved styling
            const zoneRect = L.rectangle(cell.bounds, {
                color: zone.color,
                weight: 1,
                opacity: 0.8,
                fillColor: zone.color,
                fillOpacity: zone.opacity,
                className: `zone zone-${zone.id}`,
                interactive: true
            });
            
            // Add popup with simple zone information and action button
            zoneRect.bindPopup(`
                <div class="zone-popup">
                    <h4>${zone.name}</h4>
                    <p><strong>Coordinates:</strong> ${cell.center.lat.toFixed(6)}, ${cell.center.lng.toFixed(6)}</p>
                    <button onclick="app.showDinosaursInZone(${zone.id})" class="btn" style="
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        margin-top: 8px;
                    ">Show Dinosaurs</button>
                </div>
            `);
            
            this.zoneLayer.addLayer(zoneRect);
            
            // Group for label placement
            if (!zoneGroups.has(zone.id)) {
                zoneGroups.set(zone.id, []);
            }
            zoneGroups.get(zone.id).push(assignment);
        });
        
        if (CONFIG.DEBUG.ENABLED) {
            console.log(`Drawing zones: ${zoneGroups.size} different zone types`);
            zoneGroups.forEach((assignments, zoneId) => {
                console.log(`Zone ${zoneId}: ${assignments.length} cells`);
            });
        }
        
        // Now add labels for each zone group - but find contiguous areas first
        zoneGroups.forEach((assignments, zoneId) => {
            const contiguousAreas = this.findContiguousAreas(assignments);
            if (CONFIG.DEBUG.ENABLED) {
                console.log(`Zone ${zoneId} has ${contiguousAreas.length} separate contiguous areas`);
            }
            
            contiguousAreas.forEach((area, areaIndex) => {
                this.addZoneLabelsToArea(area, zoneId, areaIndex);
            });
        });
        
        // Force a refresh to ensure labels are visible
        setTimeout(() => {
            this.forceLabelsVisible();
        }, 100);
        
        if (CONFIG.DEBUG.ENABLED) {
            const totalElements = this.zoneLayer.getLayers().length;
            console.log(`Drew ${totalElements} zone elements (rectangles + labels) for ${zoneGroups.size} zone types`);
        }
    }
    
    // Find contiguous areas within a zone to ensure each separate area gets labeled
    findContiguousAreas(assignments) {
        const areas = [];
        const visited = new Set();
        
        // Create a map of grid positions for quick lookup
        const positionMap = new Map();
        assignments.forEach(assignment => {
            const key = `${assignment.cell.gridX},${assignment.cell.gridY}`;
            positionMap.set(key, assignment);
        });
        
        // Helper function to check if two cells are adjacent
        const areAdjacent = (cell1, cell2) => {
            const dx = Math.abs(cell1.gridX - cell2.gridX);
            const dy = Math.abs(cell1.gridY - cell2.gridY);
            return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
        };
        
        // DFS to find connected components
        assignments.forEach(assignment => {
            const key = `${assignment.cell.gridX},${assignment.cell.gridY}`;
            if (!visited.has(key)) {
                const area = [];
                const stack = [assignment];
                
                while (stack.length > 0) {
                    const current = stack.pop();
                    const currentKey = `${current.cell.gridX},${current.cell.gridY}`;
                    
                    if (visited.has(currentKey)) continue;
                    
                    visited.add(currentKey);
                    area.push(current);
                    
                    // Check all adjacent positions
                    const neighbors = [
                        `${current.cell.gridX + 1},${current.cell.gridY}`,
                        `${current.cell.gridX - 1},${current.cell.gridY}`,
                        `${current.cell.gridX},${current.cell.gridY + 1}`,
                        `${current.cell.gridX},${current.cell.gridY - 1}`
                    ];
                    
                    neighbors.forEach(neighborKey => {
                        if (positionMap.has(neighborKey) && !visited.has(neighborKey)) {
                            stack.push(positionMap.get(neighborKey));
                        }
                    });
                }
                
                areas.push(area);
            }
        });
        
        return areas;
    }
    
    addZoneLabelsToArea(assignments, zoneId, areaIndex) {
        const zone = CONFIG.ZONE_PATTERN.ZONES.find(z => z.id === zoneId);
        if (!zone || assignments.length === 0) {
            if (CONFIG.DEBUG.ENABLED) {
                console.warn(`No zone found for ID ${zoneId} or no assignments in area ${areaIndex}`);
            }
            return;
        }
        
        // Hide zone labels when zoom level is less than 12
        const currentZoom = this.map.getZoom();
        if (currentZoom <= 12) {
            if (CONFIG.DEBUG.ENABLED) {
                console.log(`Zone labels hidden at zoom level ${currentZoom}`);
            }
            return;
        }
        
        // Calculate the geometric center of the zone area
        let sumLat = 0;
        let sumLng = 0;
        assignments.forEach(assignment => {
            sumLat += assignment.cell.center.lat;
            sumLng += assignment.cell.center.lng;
        });
        
        const centerLat = sumLat / assignments.length;
        const centerLng = sumLng / assignments.length;
        const geometricCenter = [centerLat, centerLng];
        
        // Clean label text without debugging coordinates
        const labelText = zone.name;
        
        // Create simple HTML for the label with inline styles that work
        const labelHtml = `<span style="
            display: block;
            background: ${zone.color};
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            text-align: center;
            white-space: nowrap;
            border: 1px solid ${zone.color};
            text-shadow: 1px 1px 1px rgba(0,0,0,0.8);
            box-shadow: 0 1px 3px rgba(0,0,0,0.5);
        ">${labelText}</span>`;
        
        // Create label marker positioned at the geometric center with proper text centering
        const label = L.marker(geometricCenter, {
            icon: L.divIcon({
                className: 'zone-label-marker', // Different class name to avoid CSS conflicts
                html: labelHtml,
                iconSize: [80, 20], // Fixed size for consistent centering
                iconAnchor: [40, 10] // Center the text (half of width, half of height)
            }),
            zIndexOffset: 2000 // High z-index to ensure visibility
        });
        
        // Add label to the same layer as zones
        this.zoneLayer.addLayer(label);
        
        if (CONFIG.DEBUG.ENABLED) {
            console.log(`Added label "${labelText}" for area ${areaIndex} at geometric center`, geometricCenter);
        }
    }
    

    selectLabelPositions(assignments) {
        // Ensure every zone gets at least one label, then add more based on size
        if (assignments.length === 0) return [];
        
        // Always show the center-most label
        const centerIndex = Math.floor(assignments.length / 2);
        let selectedPositions = [assignments[centerIndex]];
        
        // Add more labels based on zone size
        if (assignments.length >= 4) {
            // Add first position
            selectedPositions.push(assignments[0]);
        }
        
        if (assignments.length >= 8) {
            // Add last position
            selectedPositions.push(assignments[assignments.length - 1]);
        }
        
        if (assignments.length >= 12) {
            // Add quarter positions
            const quarter = Math.floor(assignments.length / 4);
            selectedPositions.push(assignments[quarter]);
            selectedPositions.push(assignments[quarter * 3]);
        }
        
        if (assignments.length >= 20) {
            // For very large zones, add more labels
            const interval = Math.max(4, Math.floor(assignments.length / 6));
            for (let i = interval; i < assignments.length; i += interval) {
                if (selectedPositions.length < 8) { // Max 8 labels per zone
                    selectedPositions.push(assignments[i]);
                }
            }
        }
        
        // Remove duplicates
        const uniquePositions = [];
        const seen = new Set();
        for (const pos of selectedPositions) {
            const key = `${pos.cell.center.lat.toFixed(6)}-${pos.cell.center.lng.toFixed(6)}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniquePositions.push(pos);
            }
        }
        
        return uniquePositions;
    }
    
    getZoneAt(lat, lng) {
        const cell = this.gridSystem.getGridCellAt(lat, lng);
        if (!cell) return null;
        
        const assignment = this.zoneAssignments.get(cell.id);
        return assignment ? assignment.zone : null;
    }
    
    getZoneInfo(zoneId) {
        const zone = CONFIG.ZONE_PATTERN.ZONES.find(z => z.id === zoneId);
        if (!zone) return null;
        
        const assignments = Array.from(this.zoneAssignments.values())
            .filter(a => a.zoneId === zoneId);
        
        return {
            zone: zone,
            cellCount: assignments.length,
            cells: assignments.map(a => a.cell)
        };
    }
    
    getAllZones() {
        return CONFIG.ZONE_PATTERN.ZONES.map(zone => ({
            ...zone,
            ...this.getZoneInfo(zone.id)
        }));
    }
    
    highlightZone(zoneId, duration = 3000) {
        const assignments = Array.from(this.zoneAssignments.values())
            .filter(a => a.zoneId === zoneId);
        
        if (assignments.length === 0) return;
        
        // Create highlight layer
        const highlightLayer = L.layerGroup().addTo(this.map);
        
        assignments.forEach(assignment => {
            const highlightRect = L.rectangle(assignment.cell.bounds, {
                color: '#FF0000',
                weight: 3,
                fillColor: assignment.zone.color,
                fillOpacity: 0.7,
                className: 'zone-highlight'
            });
            
            highlightLayer.addLayer(highlightRect);
        });
        
        // Remove highlight after duration
        if (duration > 0) {
            setTimeout(() => {
                this.map.removeLayer(highlightLayer);
            }, duration);
        }
        
        return highlightLayer;
    }
    
    show() {
        if (!this.isVisible) {
            this.isVisible = true;
            if (this.zoneLayer) this.map.addLayer(this.zoneLayer);
            this.updateZones();
        }
    }
    
    hide() {
        if (this.isVisible) {
            this.isVisible = false;
            this.clearZones();
        }
    }
    
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    clearZones() {
        if (this.zoneLayer) {
            this.zoneLayer.clearLayers();
        }
        this.zoneLabelCache.clear();
    }
    
    // Update zone pattern configuration
    updatePattern(newPattern) {
        CONFIG.ZONE_PATTERN = { ...CONFIG.ZONE_PATTERN, ...newPattern };
        this.updateZones();
        
        if (CONFIG.DEBUG.ENABLED) {
            console.log('Zone pattern updated:', newPattern);
        }
    }
    
    // Export zone data for debugging
    exportZoneData() {
        const data = {
            pattern: CONFIG.ZONE_PATTERN,
            assignments: Array.from(this.zoneAssignments.entries()).map(([cellId, assignment]) => ({
                cellId: cellId,
                zoneId: assignment.zoneId,
                zoneName: assignment.zone.name,
                gridPosition: [assignment.cell.gridX, assignment.cell.gridY],
                center: [assignment.cell.center.lat, assignment.cell.center.lng]
            })),
            statistics: this.getZoneStatistics()
        };
        
        return data;
    }
    
    getZoneStatistics() {
        const stats = {};
        
        CONFIG.ZONE_PATTERN.ZONES.forEach(zone => {
            const count = Array.from(this.zoneAssignments.values())
                .filter(a => a.zoneId === zone.id).length;
            stats[zone.name] = count;
        });
        
        return stats;
    }
    
    // Search for zones containing specific coordinates
    findZonesInArea(bounds) {
        const zonesInArea = new Set();
        
        this.zoneAssignments.forEach((assignment, cellId) => {
            if (bounds.intersects(assignment.cell.bounds)) {
                zonesInArea.add(assignment.zone);
            }
        });
        
        return Array.from(zonesInArea);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZoneManager;
}