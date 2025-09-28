/* ==========================================================================
   Dinosaur Data Processor for JWA Map
   Converts Paleo.gg JSON format to our required format
   ========================================================================== */

class DinosaurDataProcessor {
    constructor() {
        this.locationMapping = {
            'local_area_1': [1],
            'local_area_2': [2], 
            'local_area_3': [3],
            'local_area_4': [4],
            'everywhere': [1, 2, 3, 4]
        };
        
        this.rarityMapping = {
            'Common': 'common',
            'Rare': 'rare',
            'Epic': 'epic',
            'Legendary': 'omega',
            'Unique': 'omega',
            'Apex': 'omega'
        };
    }

    /**
     * Process the raw Paleo.gg JSON data
     * @param {Object} rawData - The JSON data from props.pageProps.dex.items
     * @returns {Array} Processed dinosaur data in our format
     */
    processData(rawData) {
        if (!rawData || !rawData.props || !rawData.props.pageProps || !rawData.props.pageProps.dex) {
            console.error('Invalid data structure');
            return [];
        }

        const items = rawData.props.pageProps.dex.items;
        const processedDinosaurs = [];

        items.forEach((creature, index) => {
            try {
                const processedCreature = this.processCreature(creature, index + 1);
                if (processedCreature) {
                    processedDinosaurs.push(processedCreature);
                }
            } catch (error) {
                console.warn(`Failed to process creature:`, creature.name, error);
            }
        });

        return processedDinosaurs;
    }

    /**
     * Process a single creature from the raw data
     * @param {Object} creature - Single creature object from Paleo.gg
     * @param {number} id - Sequential ID to assign
     * @returns {Object} Processed creature in our format
     */
    processCreature(creature, id) {
        if (!creature) return null;

        // Extract basic info
        const name = creature.name || 'Unknown';
        const uuid = creature.uuid || '';
        const description = creature.description || `A creature from Jurassic World Alive.`;
        
        // Map rarity to our type system
        const rarity = creature.rarity || 'Common';
        const type = this.rarityMapping[rarity] || 'common';

        // Process DNA sources to get zones and timing
        const { zones, timing } = this.processDnaSources(creature.dna_source || []);

        // Generate image URL
        const imageUrl = uuid ? `https://cdn.paleo.gg/games/jwa/images/creature/${uuid}.png` : null;

        // Extract additional metadata
        const metadata = {
            class: creature.class || null,
            size: creature.size || null,
            version: creature.version || null,
            category: creature.category || null,
            hp: creature.hp || null,
            damage: creature.damage || null,
            speed: creature.speed || null,
            armor: creature.armor || null,
            crit: creature.crit || null
        };

        return {
            id,
            name,
            uuid,
            type,
            zones,
            timing,
            description,
            imageUrl,
            rarity,
            metadata
        };
    }

    /**
     * Process DNA sources to extract zones and timing information
     * @param {Array} dnaSources - Array of DNA source objects
     * @returns {Object} Object with zones and timing arrays
     */
    processDnaSources(dnaSources) {
        const zonesSet = new Set();
        const timingSet = new Set();

        dnaSources.forEach(source => {
            // Process location
            if (source.loc && this.locationMapping[source.loc]) {
                this.locationMapping[source.loc].forEach(zone => zonesSet.add(zone));
            }

            // Process timing
            if (source.time && Array.isArray(source.time)) {
                source.time.forEach(timeSlot => {
                    const normalizedTime = this.normalizeTime(timeSlot);
                    if (normalizedTime) {
                        timingSet.add(normalizedTime);
                    }
                });
            }
        });

        // Convert sets to arrays and provide defaults
        const zones = Array.from(zonesSet).sort();
        const timing = Array.from(timingSet).sort();

        // Default values if no data found
        return {
            zones: zones.length > 0 ? zones : [1], // Default to zone 1
            timing: timing.length > 0 ? timing : ['day'] // Default to day
        };
    }

    /**
     * Normalize time values to our standard format
     * @param {string} timeSlot - Time slot from Paleo.gg
     * @returns {string|null} Normalized time or null if invalid
     */
    normalizeTime(timeSlot) {
        if (!timeSlot || typeof timeSlot !== 'string') return null;

        const normalized = timeSlot.toLowerCase().trim();
        
        // Map various time formats to our standards
        const timeMapping = {
            'dawn': 'dawn',
            'morning': 'dawn',
            'early_morning': 'dawn',
            'day': 'day',
            'daytime': 'day',
            'afternoon': 'day',
            'dusk': 'dusk',
            'evening': 'dusk',
            'sunset': 'dusk',
            'night': 'night',
            'nighttime': 'night',
            'all_day': 'all_day', // Special case for creatures active all day
            'anytime': 'all_day'
        };

        const mapped = timeMapping[normalized];
        
        // Handle 'all_day' case by returning all time slots
        if (mapped === 'all_day') {
            return ['dawn', 'day', 'dusk', 'night'];
        }

        return mapped || null;
    }

    /**
     * Validate processed data
     * @param {Array} processedData - Array of processed creatures
     * @returns {Object} Validation results
     */
    validateData(processedData) {
        const validation = {
            totalCreatures: processedData.length,
            errors: [],
            warnings: [],
            statistics: {
                byType: {},
                byZone: {},
                byTiming: {}
            }
        };

        processedData.forEach((creature, index) => {
            // Check required fields
            if (!creature.name) {
                validation.errors.push(`Creature ${index}: Missing name`);
            }
            if (!creature.zones || creature.zones.length === 0) {
                validation.errors.push(`Creature ${index} (${creature.name}): No zones assigned`);
            }
            if (!creature.timing || creature.timing.length === 0) {
                validation.errors.push(`Creature ${index} (${creature.name}): No timing assigned`);
            }

            // Collect statistics
            if (creature.type) {
                validation.statistics.byType[creature.type] = 
                    (validation.statistics.byType[creature.type] || 0) + 1;
            }

            creature.zones.forEach(zone => {
                const zoneKey = `Zone ${zone}`;
                validation.statistics.byZone[zoneKey] = 
                    (validation.statistics.byZone[zoneKey] || 0) + 1;
            });

            creature.timing.forEach(time => {
                validation.statistics.byTiming[time] = 
                    (validation.statistics.byTiming[time] || 0) + 1;
            });
        });

        return validation;
    }

    /**
     * Export processed data to JSON file
     * @param {Array} processedData - Processed dinosaur data
     * @param {string} filename - Output filename
     * @returns {string} JSON string
     */
    exportToJSON(processedData, filename = 'processed_dinosaurs.json') {
        const jsonData = JSON.stringify(processedData, null, 2);
        
        // In browser environment, create downloadable file
        if (typeof window !== 'undefined') {
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }

        return jsonData;
    }

    /**
     * Process data from a JSON file URL or file input
     * @param {string|File} source - URL string or File object
     * @returns {Promise<Array>} Promise resolving to processed data
     */
    async processFromSource(source) {
        let rawData;

        if (typeof source === 'string') {
            // URL source
            try {
                const response = await fetch(source);
                rawData = await response.json();
            } catch (error) {
                throw new Error(`Failed to fetch data from URL: ${error.message}`);
            }
        } else if (source instanceof File) {
            // File source
            try {
                const text = await source.text();
                rawData = JSON.parse(text);
            } catch (error) {
                throw new Error(`Failed to read file: ${error.message}`);
            }
        } else {
            // Direct data
            rawData = source;
        }

        return this.processData(rawData);
    }
}

// Usage example and testing function
function testProcessor() {
    const processor = new DinosaurDataProcessor();
    
    // Example of how to use with your data:
    console.log('Dinosaur Data Processor ready!');
    console.log('Usage:');
    console.log('1. const processor = new DinosaurDataProcessor();');
    console.log('2. const processed = processor.processData(yourPaleoGGData);');
    console.log('3. const validation = processor.validateData(processed);');
    console.log('4. processor.exportToJSON(processed, "dinosaurs.json");');
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DinosaurDataProcessor;
} else if (typeof window !== 'undefined') {
    window.DinosaurDataProcessor = DinosaurDataProcessor;
    // Auto-run test in browser
    testProcessor();
}