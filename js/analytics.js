/* ==========================================================================
   JWA Map Analytics Tracking
   ========================================================================== */

class Analytics {
    constructor() {
        this.isEnabled = typeof window !== 'undefined' && window.dataLayer;
        if (this.isEnabled) {
            console.log('Analytics tracking enabled');
        } else {
            console.warn('Analytics tracking disabled - dataLayer not found');
        }
    }

    // Generic event tracking method
    track(eventName, eventData = {}) {
        if (!this.isEnabled) return;

        const trackingData = {
            event: eventName,
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            ...eventData
        };

        window.dataLayer.push(trackingData);
        
        if (CONFIG.DEBUG?.ENABLED) {
            console.log('📊 Analytics Event:', eventName, trackingData);
        }
    }

    // App initialization tracking
    trackAppLoad() {
        this.track('app_loaded', {
            event_category: 'app_lifecycle',
            event_label: 'application_initialized'
        });
    }

    // Geolocation tracking
    trackLocationRequest() {
        this.track('location_requested', {
            event_category: 'geolocation',
            event_label: 'user_location_request'
        });
    }

    trackLocationSuccess(lat, lng, zone) {
        this.track('location_success', {
            event_category: 'geolocation',
            event_label: 'location_obtained',
            user_zone: zone,
            custom_parameters: {
                has_coordinates: true,
                zone_detected: !!zone
            }
        });
    }

    trackLocationError(errorType) {
        this.track('location_error', {
            event_category: 'geolocation',
            event_label: 'location_failed',
            error_type: errorType
        });
    }

    // Dinosaur search tracking
    trackDinosaurSearch(searchTerm, resultsCount) {
        this.track('dinosaur_search', {
            event_category: 'search',
            event_label: 'dinosaur_search_performed',
            search_term: searchTerm,
            results_count: resultsCount
        });
    }

    trackDinosaurView(dinoId, dinoName, dinoType) {
        this.track('dinosaur_viewed', {
            event_category: 'content',
            event_label: 'dinosaur_details_viewed',
            dinosaur_id: dinoId,
            dinosaur_name: dinoName,
            dinosaur_type: dinoType
        });
    }

    trackDinosaurLocate(dinoId, dinoName, zoneId, distance) {
        this.track('dinosaur_located', {
            event_category: 'interaction',
            event_label: 'show_on_map_clicked',
            dinosaur_id: dinoId,
            dinosaur_name: dinoName,
            target_zone: zoneId,
            distance_km: distance
        });
    }

    // Filter usage tracking
    trackFilterUsage(filterType, filterValue, resultsCount) {
        this.track('filter_applied', {
            event_category: 'filters',
            event_label: `${filterType}_filter_applied`,
            filter_type: filterType,
            filter_value: filterValue,
            results_count: resultsCount
        });
    }

    trackFilterClear(filterType) {
        this.track('filter_cleared', {
            event_category: 'filters',
            event_label: `${filterType}_filter_cleared`,
            filter_type: filterType
        });
    }

    // Map interaction tracking
    trackMapInteraction(interactionType, zoomLevel, center) {
        this.track('map_interaction', {
            event_category: 'map',
            event_label: interactionType,
            zoom_level: zoomLevel,
            map_center: center ? `${center.lat.toFixed(4)},${center.lng.toFixed(4)}` : null
        });
    }

    trackZoneClick(zoneId, zoneName) {
        this.track('zone_clicked', {
            event_category: 'map',
            event_label: 'zone_selected',
            zone_id: zoneId,
            zone_name: zoneName
        });
    }

    // Panel interactions
    trackPanelOpen(panelName) {
        this.track('panel_opened', {
            event_category: 'navigation',
            event_label: 'panel_opened',
            panel_name: panelName
        });
    }

    trackPanelClose(panelName) {
        this.track('panel_closed', {
            event_category: 'navigation',
            event_label: 'panel_closed',
            panel_name: panelName
        });
    }

    // Button clicks
    trackButtonClick(buttonName, context = null) {
        this.track('button_clicked', {
            event_category: 'interaction',
            event_label: 'button_clicked',
            button_name: buttonName,
            context: context
        });
    }

    // Feature usage
    trackFeatureUsage(featureName, details = {}) {
        this.track('feature_used', {
            event_category: 'features',
            event_label: featureName,
            ...details
        });
    }

    // Error tracking
    trackError(errorType, errorMessage, context = {}) {
        this.track('error_occurred', {
            event_category: 'errors',
            event_label: errorType,
            error_message: errorMessage,
            ...context
        });
    }

    // Performance tracking
    trackPerformance(metricName, value, unit = 'ms') {
        this.track('performance_metric', {
            event_category: 'performance',
            event_label: metricName,
            metric_value: value,
            metric_unit: unit
        });
    }

    // Session tracking
    trackSessionStart() {
        this.track('session_start', {
            event_category: 'session',
            event_label: 'user_session_started',
            session_id: this.generateSessionId()
        });
    }

    trackSessionEnd(duration) {
        this.track('session_end', {
            event_category: 'session',
            event_label: 'user_session_ended',
            session_duration: duration
        });
    }

    // Utility methods
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Batch tracking for multiple events
    trackBatch(events) {
        if (!this.isEnabled) return;
        
        events.forEach(event => {
            this.track(event.name, event.data);
        });
    }
}

// Create global analytics instance
window.analytics = new Analytics();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Analytics;
}