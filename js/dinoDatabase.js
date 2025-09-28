/* ==========================================================================
   Dinosaur Database for JWA Map
   ========================================================================== */

class DinosaurDatabase {
    constructor() {
        this.dinosaurs = [];
        this.filteredDinosaurs = [];
        this.currentFilters = {
            search: '',
            type: 'all',
            timing: 'all',
            zone: 'all'
        };
        
        this.init();
    }
    
    async init() {
        // Load dinosaur data
        await this.loadDinosaurData();
        
        // Initialize search functionality
        this.initializeSearch();
        
        if (CONFIG.DEBUG.ENABLED) {
            console.log('Dinosaur database initialized with', this.dinosaurs.length, 'dinosaurs');
            console.log('Statistics:', this.getStatistics());
        }
    }
    
    async loadDinosaurData() {
        try {
            if (CONFIG.DEBUG.ENABLED) {
                console.log('Loading hardcoded JWA dinosaur data...');
            }
            
            // Use hardcoded JWA data
            this.dinosaurs = this.getJWADinosaurData();
            console.log('Loaded', this.dinosaurs.length, 'JWA dinosaurs from hardcoded data');
            
            if (CONFIG.DEBUG.ENABLED) {
                console.log('Sample dinosaur:', this.dinosaurs[0]);
            }
            
        } catch (error) {
            console.error('Error loading dinosaur data:', error);
            this.dinosaurs = this.getSampleDinosaurData();
        }
    }
    
    getJWADinosaurData() {
        // Real JWA dinosaur data from dinodex
        return [
  {
    "id": 1,
    "name": "Acrocanthosaurus",
    "type": "epic",
    "zones": [
      2
    ],
    "timing": [
      "dawn",
      "day"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/acrocanthosaurus.png"
  },
  {
    "id": 2,
    "name": "Alanqa",
    "type": "epic",
    "zones": [
      1
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/alanqa.png"
  },
  {
    "id": 3,
    "name": "Albertosaurus",
    "type": "rare",
    "zones": [
      3
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/albertosaurus.png"
  },
  {
    "id": 4,
    "name": "Amphicyon",
    "type": "common",
    "zones": [
      1
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/amphicyon.png"
  },
  {
    "id": 5,
    "name": "Animantarx",
    "type": "epic",
    "zones": [
      1
    ],
    "timing": [
      "dawn",
      "day"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/animantarx.png"
  },
  {
    "id": 6,
    "name": "Ankylosaurus",
    "type": "epic",
    "zones": [
      2
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/ankylosaurus.png"
  },
  {
    "id": 7,
    "name": "Ankylosaurus Gen 2",
    "type": "common",
    "zones": [
      1,
      2,
      3,
      4
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/ankylosaurus_gen_2.png"
  },
  {
    "id": 8,
    "name": "Anurognathus",
    "type": "epic",
    "zones": [
      3
    ],
    "timing": [
      "dawn",
      "day"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/anurognathus.png"
  },
  {
    "id": 9,
    "name": "Apatosaurus",
    "type": "common",
    "zones": [
      1,
      2,
      3,
      4
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/apatosaurus.png"
  },
  {
    "id": 10,
    "name": "Archaeopteryx",
    "type": "rare",
    "zones": [
      1
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/archaeopteryx.png"
  },
  {
    "id": 11,
    "name": "Baryonyx Gen 2",
    "type": "rare",
    "zones": [
      1
    ],
    "timing": [
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/baryonyx_gen_2.png"
  },
  {
    "id": 12,
    "name": "Beelzebufo",
    "type": "epic",
    "zones": [
      1
    ],
    "timing": [
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/beelzebufo.png"
  },
  {
    "id": 13,
    "name": "Brunette",
    "type": "epic",
    "zones": [
      1
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/brunette.png"
  },
  {
    "id": 14,
    "name": "Carbonemys",
    "type": "epic",
    "zones": [
      2
    ],
    "timing": [
      "dawn",
      "day"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/carbonemys.png"
  },
  {
    "id": 15,
    "name": "Compsognathus Gen 2",
    "type": "rare",
    "zones": [
      2
    ],
    "timing": [
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/compsognathus_gen_2.png"
  },
  {
    "id": 16,
    "name": "Cryolophosaurus",
    "type": "omega",
    "zones": [
      1
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/cryolophosaurus.png"
  },
  {
    "id": 17,
    "name": "Dakotaraptor",
    "type": "epic",
    "zones": [
      3
    ],
    "timing": [
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/dakotaraptor.png"
  },
  {
    "id": 18,
    "name": "Darwinopterus",
    "type": "epic",
    "zones": [
      2
    ],
    "timing": [
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/darwinopterus.png"
  },
  {
    "id": 19,
    "name": "Deinosuchus",
    "type": "rare",
    "zones": [
      3
    ],
    "timing": [
      "dawn",
      "day"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/deinosuchus.png"
  },
  {
    "id": 20,
    "name": "Deinotherium",
    "type": "rare",
    "zones": [
      2
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/deinotherium.png"
  },
  {
    "id": 21,
    "name": "Dilophosaurus Gen 2",
    "type": "common",
    "zones": [
      1,
      2,
      3,
      4
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/dilophosaurus_gen_2.png"
  },
  {
    "id": 22,
    "name": "Dimetrodon",
    "type": "rare",
    "zones": [
      3
    ],
    "timing": [
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/dimetrodon.png"
  },
  {
    "id": 23,
    "name": "Dimetrodon Gen 2",
    "type": "common",
    "zones": [
      3
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/dimetrodon_gen_2.png"
  },
  {
    "id": 24,
    "name": "Dimorphodon",
    "type": "common",
    "zones": [
      4
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/dimorphodon.png"
  },
  {
    "id": 25,
    "name": "Diplocaulus Gen 2",
    "type": "rare",
    "zones": [
      3
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/diplocaulus_gen_2.png"
  },
  {
    "id": 26,
    "name": "Diplodocus",
    "type": "epic",
    "zones": [
      4
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/diplodocus.png"
  },
  {
    "id": 27,
    "name": "Dodo",
    "type": "epic",
    "zones": [
      1,
      2,
      3,
      4
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/dodo.png"
  },
  {
    "id": 28,
    "name": "Dsungaripterus",
    "type": "rare",
    "zones": [
      1
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/dsungaripterus.png"
  },
  {
    "id": 29,
    "name": "Echo",
    "type": "rare",
    "zones": [
      2
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/echo.png"
  },
  {
    "id": 30,
    "name": "Edmontosaurus",
    "type": "rare",
    "zones": [
      4
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/edmontosaurus.png"
  },
  {
    "id": 31,
    "name": "Einiosaurus",
    "type": "common",
    "zones": [
      2
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/einiosaurus.png"
  },
  {
    "id": 32,
    "name": "Elasmotherium",
    "type": "rare",
    "zones": [
      4
    ],
    "timing": [
      "dawn",
      "day"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/elasmotherium.png"
  },
  {
    "id": 33,
    "name": "Erlikosaurus Gen 2",
    "type": "rare",
    "zones": [
      1,
      2,
      3,
      4
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/erlikosaurus_gen_2.png"
  },
  {
    "id": 34,
    "name": "Erythrosuchus",
    "type": "omega",
    "zones": [
      2
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/erythrosuchus.png"
  },
  {
    "id": 35,
    "name": "Glyptodon",
    "type": "common",
    "zones": [
      3
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/glyptodon.png"
  },
  {
    "id": 36,
    "name": "Gorgosaurus",
    "type": "rare",
    "zones": [
      1
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/gorgosaurus.png"
  },
  {
    "id": 37,
    "name": "Haast Eagle",
    "type": "epic",
    "zones": [
      4
    ],
    "timing": [
      "dawn",
      "day"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/haast_eagle.png"
  },
  {
    "id": 38,
    "name": "Hatzegopteryx",
    "type": "common",
    "zones": [
      4
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/hatzegopteryx.png"
  },
  {
    "id": 39,
    "name": "Homalocephale",
    "type": "omega",
    "zones": [
      4
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/homalocephale.png"
  },
  {
    "id": 40,
    "name": "Inostrancevia",
    "type": "common",
    "zones": [
      1
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/inostrancevia.png"
  },
  {
    "id": 41,
    "name": "Kaprosuchus",
    "type": "rare",
    "zones": [
      4
    ],
    "timing": [
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/kaprosuchus.png"
  },
  {
    "id": 42,
    "name": "Koolasuchus",
    "type": "epic",
    "zones": [
      4
    ],
    "timing": [
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/koolasuchus.png"
  },
  {
    "id": 43,
    "name": "Koolasuchus Gen 2",
    "type": "rare",
    "zones": [
      3
    ],
    "timing": [
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/koolasuchus_gen_2.png"
  },
  {
    "id": 44,
    "name": "Lystrosaurus",
    "type": "epic",
    "zones": [
      4
    ],
    "timing": [
      "dawn",
      "day"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/lystrosaurus.png"
  },
  {
    "id": 45,
    "name": "Majungasaurus",
    "type": "common",
    "zones": [
      2
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/majungasaurus.png"
  },
  {
    "id": 46,
    "name": "Megaloceros",
    "type": "rare",
    "zones": [
      1
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/megaloceros.png"
  },
  {
    "id": 47,
    "name": "Megistotherium",
    "type": "epic",
    "zones": [
      3
    ],
    "timing": [
      "dawn",
      "day"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/megistotherium.png"
  },
  {
    "id": 48,
    "name": "Monolophosaurus",
    "type": "epic",
    "zones": [
      4
    ],
    "timing": [
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/monolophosaurus.png"
  },
  {
    "id": 49,
    "name": "Nundasuchus",
    "type": "common",
    "zones": [
      1
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/nundasuchus.png"
  },
  {
    "id": 50,
    "name": "Ophiacodon",
    "type": "common",
    "zones": [
      4
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/ophiacodon.png"
  },
  {
    "id": 51,
    "name": "Ornithomimus",
    "type": "rare",
    "zones": [
      2
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/ornithomimus.png"
  },
  {
    "id": 52,
    "name": "Parasaurolophus",
    "type": "common",
    "zones": [
      1
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/parasaurolophus.png"
  },
  {
    "id": 53,
    "name": "Phorusrhacos",
    "type": "common",
    "zones": [
      2
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/phorusrhacos.png"
  },
  {
    "id": 54,
    "name": "Postosuchus",
    "type": "rare",
    "zones": [
      1
    ],
    "timing": [
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/postosuchus.png"
  },
  {
    "id": 55,
    "name": "Proceratosaurus",
    "type": "rare",
    "zones": [
      2
    ],
    "timing": [
      "dawn",
      "day"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/proceratosaurus.png"
  },
  {
    "id": 56,
    "name": "Protoceratops",
    "type": "epic",
    "zones": [
      1
    ],
    "timing": [
      "dawn",
      "day"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/protoceratops.png"
  },
  {
    "id": 57,
    "name": "Pteranodon",
    "type": "epic",
    "zones": [
      4
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/pteranodon.png"
  },
  {
    "id": 58,
    "name": "Quetzalcoatlus",
    "type": "rare",
    "zones": [
      4
    ],
    "timing": [
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/quetzalcoatlus.png"
  },
  {
    "id": 59,
    "name": "Quetzalcoatlus Gen 2",
    "type": "epic",
    "zones": [
      3
    ],
    "timing": [
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/quetzalcoatlus_gen_2.png"
  },
  {
    "id": 60,
    "name": "Rajasaurus",
    "type": "epic",
    "zones": [
      1
    ],
    "timing": [
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/rajasaurus.png"
  },
  {
    "id": 61,
    "name": "Rinchenia",
    "type": "epic",
    "zones": [
      2
    ],
    "timing": [
      "dawn",
      "day"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/rinchenia.png"
  },
  {
    "id": 62,
    "name": "Sarcosuchus",
    "type": "common",
    "zones": [
      3
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/sarcosuchus.png"
  },
  {
    "id": 63,
    "name": "Saurornitholestes",
    "type": "common",
    "zones": [
      4
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/saurornitholestes.png"
  },
  {
    "id": 64,
    "name": "Scaphognathus",
    "type": "rare",
    "zones": [
      4
    ],
    "timing": [
      "dawn",
      "day"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/scaphognathus.png"
  },
  {
    "id": 65,
    "name": "Scutosaurus",
    "type": "epic",
    "zones": [
      2
    ],
    "timing": [
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/scutosaurus.png"
  },
  {
    "id": 66,
    "name": "Secodontosaurus",
    "type": "epic",
    "zones": [
      3
    ],
    "timing": [
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/secodontosaurus.png"
  },
  {
    "id": 67,
    "name": "Smilodon",
    "type": "epic",
    "zones": [
      3
    ],
    "timing": [
      "dawn",
      "day"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/smilodon.png"
  },
  {
    "id": 68,
    "name": "Sonorasaurus",
    "type": "epic",
    "zones": [
      2
    ],
    "timing": [
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/sonorasaurus.png"
  },
  {
    "id": 69,
    "name": "Sphaerotholus",
    "type": "rare",
    "zones": [
      1
    ],
    "timing": [
      "dawn",
      "day"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/sphaerotholus.png"
  },
  {
    "id": 70,
    "name": "Spinosaurus Gen 2",
    "type": "epic",
    "zones": [
      4
    ],
    "timing": [
      "dawn",
      "day"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/spinosaurus_gen_2.png"
  },
  {
    "id": 71,
    "name": "Struthiomimus",
    "type": "epic",
    "zones": [
      1
    ],
    "timing": [
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/struthiomimus.png"
  },
  {
    "id": 72,
    "name": "Stygimoloch Gen 2",
    "type": "common",
    "zones": [
      2
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/stygimoloch_gen_2.png"
  },
  {
    "id": 73,
    "name": "Tanycolagreus",
    "type": "common",
    "zones": [
      1,
      2,
      3,
      4
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/tanycolagreus.png"
  },
  {
    "id": 74,
    "name": "Tarbosaurus",
    "type": "common",
    "zones": [
      3
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/tarbosaurus.png"
  },
  {
    "id": 75,
    "name": "Tenontosaurus",
    "type": "rare",
    "zones": [
      3
    ],
    "timing": [
      "dawn",
      "day"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/tenontosaurus.png"
  },
  {
    "id": 76,
    "name": "Tiger",
    "type": "epic",
    "zones": [
      3
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/tiger.png"
  },
  {
    "id": 77,
    "name": "Titanoboa Gen 2",
    "type": "rare",
    "zones": [
      2
    ],
    "timing": [
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/titanoboa_gen_2.png"
  },
  {
    "id": 78,
    "name": "Triceratops",
    "type": "rare",
    "zones": [
      4
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/triceratops.png"
  },
  {
    "id": 79,
    "name": "Troodon",
    "type": "epic",
    "zones": [
      2
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/troodon.png"
  },
  {
    "id": 80,
    "name": "Tuojiangosaurus",
    "type": "rare",
    "zones": [
      2
    ],
    "timing": [
      "dawn",
      "day"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/tuojiangosaurus.png"
  },
  {
    "id": 81,
    "name": "Tupandactylus",
    "type": "rare",
    "zones": [
      3
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/tupandactylus.png"
  },
  {
    "id": 82,
    "name": "Tyrannosaurus Rex",
    "type": "epic",
    "zones": [
      3
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/tyrannosaurus_rex.png"
  },
  {
    "id": 83,
    "name": "Tyrannosaurus Rex Gen 2",
    "type": "rare",
    "zones": [
      4
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/tyrannosaurus_rex_gen_2.png"
  },
  {
    "id": 84,
    "name": "Velociraptor",
    "type": "common",
    "zones": [
      1,
      2,
      3,
      4
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/velociraptor.png"
  },
  {
    "id": 85,
    "name": "Woolly Rhino",
    "type": "epic",
    "zones": [
      1
    ],
    "timing": [
      "dawn",
      "day"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/woolly_rhino.png"
  },
  {
    "id": 86,
    "name": "Yutyrannus",
    "type": "omega",
    "zones": [
      3
    ],
    "timing": [
      "dawn",
      "day",
      "dusk",
      "night"
    ],
    "description": "A prehistoric creature from Jurassic World Alive.",
    "image": "https://cdn.paleo.gg/games/jwa/images/creature/yutyrannus.png"
  }
];
    }
    
    getSampleDinosaurData() {
        // Fallback sample data if JWA data fails
        return [
            {
                id: 1,
                name: "Allosaurus",
                type: "common",
                zones: [1],
                timing: ["day", "dusk"],
                description: "A large carnivorous dinosaur from the Late Jurassic period."
            }
        ];
    }
    
    initializeSearch() {
        const searchInput = document.getElementById('dinoSearch');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const timeButtons = document.querySelectorAll('.time-btn');
        const zoneButtons = document.querySelectorAll('.zone-btn');
        
        if (searchInput) {
            // Debounce search input
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.currentFilters.search = e.target.value.toLowerCase();
                    this.applyFilters();
                }, CONFIG.PERFORMANCE.SEARCH_DEBOUNCE);
            });
        }
        
        // Type filter buttons
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilters.type = e.target.dataset.type;
                this.applyFilters();
            });
        });
        
        // Timing filter buttons
        timeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                timeButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilters.timing = e.target.dataset.time;
                this.applyFilters();
            });
        });
        
        // Zone filter buttons
        zoneButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                zoneButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilters.zone = e.target.dataset.zone;
                this.applyFilters();
            });
        });
        
        // Initial display
        this.applyFilters();
    }
    
    // Method to set zone filter (called from map zone clicks)
    filterByZone(zoneId) {
        this.currentFilters.zone = zoneId.toString();
        
        // Update the active zone button in the UI
        const zoneButtons = document.querySelectorAll('.zone-btn');
        zoneButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.zone === zoneId.toString()) {
                btn.classList.add('active');
            }
        });
        
        this.applyFilters();
    }
    
    applyFilters() {
        const { search, type, timing, zone } = this.currentFilters;
        
        this.filteredDinosaurs = this.dinosaurs.filter(dino => {
            // Search filter
            if (search && !dino.name.toLowerCase().includes(search)) {
                return false;
            }
            
            // Type filter
            if (type !== 'all' && dino.type !== type) {
                return false;
            }
            
            // Timing filter
            if (timing !== 'all' && !dino.timing.includes(timing)) {
                return false;
            }
            
            // Zone filter
            if (zone !== 'all' && !dino.zones.includes(parseInt(zone))) {
                return false;
            }
            
            return true;
        });
        
        // Sort by rarity: common → rare → epic → omega
        const rarityOrder = { 'common': 0, 'rare': 1, 'epic': 2, 'omega': 3 };
        this.filteredDinosaurs.sort((a, b) => {
            const aRarity = rarityOrder[a.type] ?? 0;
            const bRarity = rarityOrder[b.type] ?? 0;
            if (aRarity !== bRarity) {
                return aRarity - bRarity;
            }
            // If same rarity, sort alphabetically by name
            return a.name.localeCompare(b.name);
        });
        
        // Limit results for performance
        this.filteredDinosaurs = this.filteredDinosaurs.slice(0, CONFIG.PERFORMANCE.MAX_SEARCH_RESULTS);
        
        this.displayResults();
    }
    
    displayResults() {
        const resultsContainer = document.getElementById('dinoResults');
        if (!resultsContainer) return;
        
        if (this.filteredDinosaurs.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>No dinosaurs found matching your criteria.</p>
                    <p>Try adjusting your search or filters.</p>
                </div>
            `;
            return;
        }
        
        const currentTiming = ConfigUtils.getCurrentTiming().toLowerCase();
        
        // Create icon grid layout
        resultsContainer.innerHTML = `
            <div class="dino-grid">
                ${this.filteredDinosaurs.map(dino => {
                    const isCurrentlyActive = dino.timing.includes(currentTiming);
                    const zoneNames = dino.zones.map(zoneId => `Zone ${zoneId}`).join(', ');
                    const timingNames = dino.timing.map(t => this.capitalizeFirst(t)).join(', ');
                    
                    // Handle image display
                    const imageHtml = dino.image ? 
                        `<img src="${dino.image}" alt="${dino.name}" loading="lazy" onerror="this.parentElement.classList.add('image-error')">` : 
                        '<div class="dino-emoji">🦕</div>';
                    
                    // Use the correct type mapping
                    const typeKey = dino.type ? dino.type.toUpperCase() : 'COMMON';
                    const typeInfo = CONFIG.DINOSAURS.TYPES[typeKey] || CONFIG.DINOSAURS.TYPES.COMMON;
                    
                    return `
                        <div class="dino-icon ${dino.type} ${isCurrentlyActive ? 'active-timing' : ''}" 
                             data-dino-id="${dino.id}"
                             data-name="${dino.name}"
                             data-zones="${zoneNames}"
                             data-timing="${timingNames}"
                             data-type="${typeInfo.displayName}"
                             data-active="${isCurrentlyActive}">
                            <div class="dino-icon-container">
                                ${imageHtml}
                                <div class="dino-type-indicator ${dino.type}"></div>
                                ${isCurrentlyActive ? '<div class="active-indicator">●</div>' : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            <div id="dinoExpanded" class="dino-expanded" style="display: none;"></div>
        `;
        
        // Add click handlers for result items
        this.attachResultHandlers();
    }
    
    attachResultHandlers() {
        const dinoIcons = document.querySelectorAll('.dino-icon');
        const expandedContainer = document.getElementById('dinoExpanded');
        let currentlyExpanded = null;
        
        dinoIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                const dinoId = icon.dataset.dinoId;
                const name = icon.dataset.name;
                const zones = icon.dataset.zones;
                const timing = icon.dataset.timing;
                const type = icon.dataset.type;
                const isActive = icon.dataset.active === 'true';
                
                // If clicking the same icon, collapse it
                if (currentlyExpanded === dinoId) {
                    expandedContainer.style.display = 'none';
                    icon.classList.remove('expanded');
                    currentlyExpanded = null;
                    return;
                }
                
                // Remove previous expanded state
                if (currentlyExpanded) {
                    const prevIcon = document.querySelector(`[data-dino-id="${currentlyExpanded}"]`);
                    if (prevIcon) prevIcon.classList.remove('expanded');
                }
                
                // Set new expanded state
                currentlyExpanded = dinoId;
                icon.classList.add('expanded');
                
                // Show expanded details
                expandedContainer.innerHTML = `
                    <div class="dino-expanded-content">
                        <div class="dino-expanded-header">
                            <h4>${name}</h4>
                            <div class="dino-type-badge ${icon.classList[1]}">
                                ${type}
                            </div>
                        </div>
                        <div class="dino-expanded-info">
                            <div class="info-row">
                                <strong>🗺️ Found in:</strong> ${zones}
                            </div>
                            <div class="info-row">
                                <strong>⏰ Active Times:</strong> ${timing}
                                ${isActive ? '<span class="current-indicator">• ACTIVE NOW</span>' : ''}
                            </div>
                        </div>
                        <div class="dino-expanded-actions">
                            <button class="btn-small locate-btn" onclick="app.locateDinosaur(${dinoId})">
                                📍 Show on Map
                            </button>
                        </div>
                    </div>
                `;
                expandedContainer.style.display = 'block';
                
                // Scroll the expanded section into view
                setTimeout(() => {
                    expandedContainer.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }, 100);
            });
        });
    }
    
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // Find dinosaur by ID
    findById(id) {
        return this.dinosaurs.find(dino => dino.id === id);
    }
    
    // Find dinosaurs by zone
    findByZone(zoneId) {
        return this.dinosaurs.filter(dino => dino.zones.includes(zoneId));
    }
    
    // Find dinosaurs by type
    findByType(type) {
        return this.dinosaurs.filter(dino => dino.type === type);
    }
    
    // Find dinosaurs by timing
    findByTiming(timing) {
        return this.dinosaurs.filter(dino => dino.timing.includes(timing));
    }
    
    // Find dinosaurs active at specific time
    findActiveAt(hour) {
        const timings = CONFIG.DINOSAURS.TIMINGS;
        let currentTiming = '';
        
        if (hour >= timings.DAWN.start && hour < timings.DAWN.end) currentTiming = 'dawn';
        else if (hour >= timings.DAY.start && hour < timings.DAY.end) currentTiming = 'day';
        else if (hour >= timings.DUSK.start && hour < timings.DUSK.end) currentTiming = 'dusk';
        else currentTiming = 'night';
        
        return this.findByTiming(currentTiming);
    }
    
    // Get dinosaur statistics
    getStatistics() {
        const stats = {
            total: this.dinosaurs.length,
            byType: {},
            byZone: {},
            byTiming: {}
        };
        
        // Count by type
        Object.keys(CONFIG.DINOSAURS.TYPES).forEach(type => {
            stats.byType[type] = this.findByType(type.toLowerCase()).length;
        });
        
        // Count by zone
        for (let i = 1; i <= 4; i++) {
            stats.byZone[`Zone ${i}`] = this.findByZone(i).length;
        }
        
        // Count by timing
        Object.keys(CONFIG.DINOSAURS.TIMINGS).forEach(timing => {
            stats.byTiming[timing] = this.findByTiming(timing.toLowerCase()).length;
        });
        
        return stats;
    }
    
    // Search dinosaurs by name (fuzzy search)
    searchByName(query, limit = 10) {
        query = query.toLowerCase();
        
        const results = this.dinosaurs
            .filter(dino => dino.name.toLowerCase().includes(query))
            .sort((a, b) => {
                // Sort by relevance (exact match first, then by position of match)
                const aIndex = a.name.toLowerCase().indexOf(query);
                const bIndex = b.name.toLowerCase().indexOf(query);
                
                if (aIndex !== bIndex) return aIndex - bIndex;
                return a.name.length - b.name.length;
            })
            .slice(0, limit);
            
        return results;
    }
    
    // Get recommendations based on current time and user location
    getRecommendations(userZone = null, limit = 5) {
        const currentTiming = ConfigUtils.getCurrentTiming().toLowerCase();
        let recommendations = this.findActiveAt(new Date().getHours());
        
        // If user zone is provided, prioritize dinosaurs in that zone
        if (userZone) {
            recommendations = recommendations.sort((a, b) => {
                const aInZone = a.zones.includes(userZone);
                const bInZone = b.zones.includes(userZone);
                
                if (aInZone && !bInZone) return -1;
                if (!aInZone && bInZone) return 1;
                return 0;
            });
        }
        
        // Prioritize rarer dinosaurs
        const rarityOrder = { 'omega': 0, 'epic': 1, 'rare': 2, 'common': 3 };
        recommendations = recommendations.sort((a, b) => {
            return rarityOrder[a.type] - rarityOrder[b.type];
        });
        
        return recommendations.slice(0, limit);
    }
    
    // Export data for debugging
    exportData() {
        return {
            totalDinosaurs: this.dinosaurs.length,
            filteredCount: this.filteredDinosaurs.length,
            currentFilters: this.currentFilters,
            statistics: this.getStatistics(),
            sampleData: this.dinosaurs.slice(0, 3) // First 3 for preview
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DinosaurDatabase;
}