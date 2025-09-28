/* ==========================================================================
   JWA Data Processor - Convert Paleo.gg data to JWA Map format
   ========================================================================== */

function processJWAData(jwaData) {
    console.log('Processing JWA data...', jwaData);
    
    if (!jwaData || !jwaData.items || !Array.isArray(jwaData.items)) {
        console.error('Invalid JWA data structure. Expected: { items: [...] }');
        return [];
    }

    const processedDinosaurs = [];
    let id = 1;

    jwaData.items.forEach(creature => {
        try {
            const processedCreature = processCreature(creature, id++);
            if (processedCreature) {
                processedDinosaurs.push(processedCreature);
            }
        } catch (error) {
            console.warn(`Error processing creature ${creature.name || 'unknown'}:`, error);
        }
    });

    console.log(`Processed ${processedDinosaurs.length} dinosaurs from ${jwaData.items.length} items`);
    return processedDinosaurs;
}

function processCreature(creature, id) {
    // Skip if no name or essential data
    if (!creature.name) {
        console.warn('Skipping creature without name:', creature);
        return null;
    }

    // Process zones from DNA sources
    const zones = extractZones(creature.dna_source || []);
    const timing = extractTiming(creature.dna_source || []);

    // Map rarity
    const type = mapRarity(creature.rarity);

    // Generate image URL
    const image = creature.uuid ? 
        `https://cdn.paleo.gg/games/jwa/images/creature/${creature.uuid}.png` : null;

    // Create description
    const description = createDescription(creature);

    return {
        id: id,
        name: creature.name,
        type: type,
        zones: zones,
        timing: timing,
        description: description,
        image: image,
        uuid: creature.uuid || null,
        rarity: creature.rarity || 'common'
    };
}

function extractZones(dnaSources) {
    const zones = new Set();
    
    dnaSources.forEach(source => {
        if (source.loc) {
            const mappedZones = mapLocation(source.loc);
            mappedZones.forEach(zone => zones.add(zone));
        }
    });

    // Convert Set to Array and sort
    const zoneArray = Array.from(zones).sort((a, b) => a - b);
    
    // If no zones found, default to all zones
    return zoneArray.length > 0 ? zoneArray : [1, 2, 3, 4];
}

function mapLocation(location) {
    const locationMap = {
        'local_area_1': [1],
        'local_area_2': [2], 
        'local_area_3': [3],
        'local_area_4': [4],
        'everywhere': [1, 2, 3, 4],
        'global': [1, 2, 3, 4] // fallback for global spawns
    };

    if (locationMap[location]) {
        return locationMap[location];
    }

    // If location not found, log it and default to all zones
    console.warn(`Unknown location: ${location}, defaulting to all zones`);
    return [1, 2, 3, 4];
}

function extractTiming(dnaSources) {
    const timings = new Set();
    
    dnaSources.forEach(source => {
        if (source.time && Array.isArray(source.time)) {
            source.time.forEach(time => {
                const normalizedTime = normalizeTime(time);
                if (normalizedTime) {
                    timings.add(normalizedTime);
                }
            });
        }
    });

    // Convert Set to Array
    const timingArray = Array.from(timings);
    
    // If no timing found, default to all times
    return timingArray.length > 0 ? timingArray : ['dawn', 'day', 'dusk', 'night'];
}

function normalizeTime(time) {
    if (!time || typeof time !== 'string') return null;
    
    const timeStr = time.toLowerCase().trim();
    
    // Map common time variations
    const timeMap = {
        'dawn': 'dawn',
        'morning': 'dawn',
        'early': 'dawn',
        'day': 'day',
        'daytime': 'day',
        'afternoon': 'day',
        'dusk': 'dusk',
        'evening': 'dusk',
        'sunset': 'dusk',
        'night': 'night',
        'nighttime': 'night',
        'late': 'night'
    };

    return timeMap[timeStr] || timeStr;
}

function mapRarity(rarity) {
    if (!rarity || typeof rarity !== 'string') return 'common';
    
    const rarityStr = rarity.toLowerCase().trim();
    
    // Map JWA rarities to our system
    const rarityMap = {
        'common': 'common',
        'rare': 'rare', 
        'epic': 'epic',
        'legendary': 'omega',
        'unique': 'omega',
        'apex': 'omega'
    };

    return rarityMap[rarityStr] || 'common';
}

function createDescription(creature) {
    let description = '';
    
    // Use existing description if available
    if (creature.description) {
        description = creature.description;
    } else {
        // Generate description based on creature data
        const type = creature.type || 'dinosaur';
        const rarity = creature.rarity || 'common';
        
        description = `A ${rarity} ${type}`;
        
        if (creature.hybrid) {
            description += ' hybrid';
        }
        
        description += ' from Jurassic World Alive.';
    }

    return description;
}

// Export functions for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        processJWAData,
        processCreature,
        extractZones,
        extractTiming,
        mapLocation,
        normalizeTime,
        mapRarity
    };
}