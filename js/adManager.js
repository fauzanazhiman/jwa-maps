/* ==========================================================================
   Ad Manager for JWA Map
   ========================================================================== */

class AdManager {
    constructor() {
        this.isFirstVisit = true;
        this.sessionEndTime = null;
        this.sessionTimer = null;
        this.adModal = null;
        this.hasActiveSession = false;
        
        this.init();
    }
    
    init() {
        // Check if user has an active session
        this.checkExistingSession();
        
        // Initialize modal elements
        this.adModal = document.getElementById('adModal');
        
        // Set up event handlers
        this.setupEventHandlers();
        
        if (CONFIG.DEBUG.ENABLED) {
            console.log('Ad manager initialized');
        }
    }
    
    checkExistingSession() {
        // Development bypass: if in test mode, allow direct access
        if (CONFIG.ADSENSE.TEST_MODE && CONFIG.DEBUG.ENABLED) {
            console.log('Debug mode: Bypassing ad check');
            this.hasActiveSession = true;
            this.sessionEndTime = new Date().getTime() + (CONFIG.ADSENSE.SESSION_DURATION * 60 * 1000);
            this.isFirstVisit = false;
            this.startSessionTimer();
            this.showApp();
            return;
        }
        
        const sessionData = localStorage.getItem('jwa_map_session');
        
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const now = new Date().getTime();
                
                if (now < session.endTime) {
                    // Valid session exists
                    this.hasActiveSession = true;
                    this.sessionEndTime = session.endTime;
                    this.isFirstVisit = false;
                    this.startSessionTimer();
                    this.showApp();
                    return;
                } else {
                    // Session expired, remove it
                    localStorage.removeItem('jwa_map_session');
                }
            } catch (error) {
                console.error('Error parsing session data:', error);
                localStorage.removeItem('jwa_map_session');
            }
        }
        
        // No valid session, show ad modal
        if (this.isFirstVisit) {
            this.showAdModal();
        } else {
            // Fallback: if something went wrong, show app anyway
            setTimeout(() => {
                console.warn('Fallback: Showing app without ad');
                this.showApp();
            }, 5000);
        }
    }
    
    setupEventHandlers() {
        const skipAdBtn = document.getElementById('skipAdBtn');
        
        if (skipAdBtn) {
            skipAdBtn.addEventListener('click', () => {
                this.skipAd();
            });
        }
        
        // Prevent closing modal by clicking outside
        if (this.adModal) {
            this.adModal.addEventListener('click', (e) => {
                if (e.target === this.adModal) {
                    e.preventDefault();
                }
            });
        }
    }
    
    showAdModal() {
        if (!this.adModal) return;
        
        this.adModal.style.display = 'flex';
        
        if (CONFIG.ADSENSE.TEST_MODE) {
            // In test mode, simulate ad loading and playback
            this.simulateAd();
        } else {
            // In production, load real AdSense ad
            this.loadRealAd();
        }
    }
    
    hideAdModal() {
        if (this.adModal) {
            this.adModal.style.display = 'none';
        }
    }
    
    simulateAd() {
        const adContainer = document.getElementById('adContainer');
        const skipBtn = document.getElementById('skipAdBtn');
        const skipTimer = document.getElementById('skipTimer');
        const adTimer = document.getElementById('adTimer');
        
        let timeLeft = CONFIG.ADSENSE.AD_DURATION;
        
        // Disable skip button initially but add fallback
        if (skipBtn) {
            skipBtn.disabled = true;
            skipBtn.innerHTML = `Skip Ad (Available in <span id="skipTimer">${timeLeft}</span>s)`;
        }
        
        // Update ad placeholder with better UI
        if (adContainer) {
            adContainer.innerHTML = `
                <div class="ad-placeholder">
                    <div class="ad-video-simulator">
                        <div class="ad-progress-bar">
                            <div class="ad-progress" id="adProgress"></div>
                        </div>
                        <p>🎬 Simulated Ad Playing...</p>
                        <p>Thank you for supporting JWA Map!</p>
                        <p>Time remaining: <span id="adTimer">${timeLeft}</span> seconds</p>
                        <div class="ad-controls">
                            <button id="emergencySkip" class="btn-small" style="display:none; margin-top: 10px;">Having Issues? Click to Continue</button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        const progressBar = document.getElementById('adProgress');
        const newAdTimer = document.getElementById('adTimer');
        const newSkipTimer = document.getElementById('skipTimer');
        const emergencySkip = document.getElementById('emergencySkip');
        
        // Show emergency skip after 3 seconds
        setTimeout(() => {
            if (emergencySkip) {
                emergencySkip.style.display = 'inline-block';
                emergencySkip.addEventListener('click', () => {
                    this.adCompleted();
                });
            }
        }, 3000);
        
        // Start countdown with error handling
        const countdown = setInterval(() => {
            timeLeft--;
            
            // Update timers with null checks
            if (newSkipTimer) newSkipTimer.textContent = timeLeft;
            if (newAdTimer) newAdTimer.textContent = timeLeft;
            
            // Update progress bar
            if (progressBar) {
                const progress = ((CONFIG.ADSENSE.AD_DURATION - timeLeft) / CONFIG.ADSENSE.AD_DURATION) * 100;
                progressBar.style.width = progress + '%';
            }
            
            // Enable skip button at 3 seconds remaining or less
            if (timeLeft <= 3 && skipBtn) {
                skipBtn.disabled = false;
                skipBtn.innerHTML = 'Continue to App';
                skipBtn.style.backgroundColor = '#4CAF50';
            }
            
            if (timeLeft <= 0) {
                clearInterval(countdown);
                this.adCompleted();
            }
        }, 1000);
        
        // Failsafe: auto-complete after double the expected time
        setTimeout(() => {
            this.adCompleted();
        }, (CONFIG.ADSENSE.AD_DURATION + 5) * 1000);
    }
    
    loadRealAd() {
        // This would integrate with Google AdSense
        // Placeholder for real implementation
        
        try {
            if (typeof adsbygoogle !== 'undefined') {
                // Load AdSense ad
                const adContainer = document.getElementById('adContainer');
                
                adContainer.innerHTML = `
                    <ins class="adsbygoogle"
                         style="display:block"
                         data-ad-client="${CONFIG.ADSENSE.CLIENT_ID}"
                         data-ad-slot="${CONFIG.ADSENSE.AD_SLOT}"
                         data-ad-format="auto"
                         data-full-width-responsive="true"></ins>
                `;
                
                (adsbygoogle = window.adsbygoogle || []).push({});
                
                // Set up timer for real ad
                setTimeout(() => {
                    this.adCompleted();
                }, CONFIG.ADSENSE.AD_DURATION * 1000);
                
            } else {
                console.warn('AdSense not loaded, falling back to simulation');
                this.simulateAd();
            }
        } catch (error) {
            console.error('Error loading AdSense ad:', error);
            this.simulateAd();
        }
    }
    
    adCompleted() {
        const skipBtn = document.getElementById('skipAdBtn');
        const skipTimer = document.getElementById('skipTimer');
        
        // Enable skip button
        if (skipBtn) {
            skipBtn.disabled = false;
            skipBtn.innerHTML = 'Continue to App';
            skipBtn.style.backgroundColor = '#4CAF50';
        }
        
        if (skipTimer) {
            skipTimer.textContent = '0';
        }
        
        // Auto-continue after a short delay
        setTimeout(() => {
            this.skipAd();
        }, 2000);
    }
    
    skipAd() {
        // Create session
        this.createSession();
        
        // Hide modal and show app
        this.hideAdModal();
        this.showApp();
        
        // Start session timer
        this.startSessionTimer();
    }
    
    createSession() {
        const now = new Date().getTime();
        const sessionDuration = CONFIG.ADSENSE.SESSION_DURATION * 60 * 1000; // Convert minutes to milliseconds
        this.sessionEndTime = now + sessionDuration;
        
        const sessionData = {
            startTime: now,
            endTime: this.sessionEndTime,
            adWatched: true
        };
        
        localStorage.setItem('jwa_map_session', JSON.stringify(sessionData));
        this.hasActiveSession = true;
        
        if (CONFIG.DEBUG.ENABLED) {
            console.log('Session created:', sessionData);
        }
    }
    
    startSessionTimer() {
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
        }
        
        this.updateSessionDisplay();
        
        this.sessionTimer = setInterval(() => {
            this.updateSessionDisplay();
            
            if (this.hasSessionExpired()) {
                this.handleSessionExpiry();
            }
        }, 1000);
    }
    
    updateSessionDisplay() {
        const sessionTimerElement = document.getElementById('sessionTimer');
        if (!sessionTimerElement || !this.sessionEndTime) return;
        
        const now = new Date().getTime();
        const timeLeft = Math.max(0, this.sessionEndTime - now);
        
        const minutes = Math.floor(timeLeft / (60 * 1000));
        const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
        
        sessionTimerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color when time is running low
        if (minutes < 5) {
            sessionTimerElement.style.color = '#ff6b6b';
        } else {
            sessionTimerElement.style.color = '#fff';
        }
    }
    
    hasSessionExpired() {
        if (!this.sessionEndTime) return true;
        return new Date().getTime() >= this.sessionEndTime;
    }
    
    handleSessionExpiry() {
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
        }
        
        // Clear session data
        localStorage.removeItem('jwa_map_session');
        this.hasActiveSession = false;
        this.sessionEndTime = null;
        
        // Show expiry message and reload
        this.showSessionExpiredMessage();
    }
    
    showSessionExpiredMessage() {
        const app = document.getElementById('app');
        
        if (app) {
            app.innerHTML = `
                <div class="session-expired">
                    <div class="session-expired-content">
                        <h2>⏰ Session Expired</h2>
                        <p>Your 1-hour access has expired.</p>
                        <p>Please watch another short ad to continue using JWA Map.</p>
                        <button class="btn" onclick="location.reload()">Watch Ad & Continue</button>
                    </div>
                </div>
            `;
        }
    }
    
    showApp() {
        const app = document.getElementById('app');
        const loadingScreen = document.getElementById('loadingScreen');
        
        if (app) {
            app.style.display = 'block';
        }
        
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        // Hide loading screen after a short delay for smooth transition
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.remove();
            }
        }, 1000);
    }
    
    // Utility methods
    getRemainingTime() {
        if (!this.sessionEndTime) return 0;
        return Math.max(0, this.sessionEndTime - new Date().getTime());
    }
    
    extendSession(additionalMinutes = 60) {
        if (this.hasActiveSession) {
            this.sessionEndTime += additionalMinutes * 60 * 1000;
            
            const sessionData = JSON.parse(localStorage.getItem('jwa_map_session'));
            sessionData.endTime = this.sessionEndTime;
            localStorage.setItem('jwa_map_session', JSON.stringify(sessionData));
            
            if (CONFIG.DEBUG.ENABLED) {
                console.log(`Session extended by ${additionalMinutes} minutes`);
            }
        }
    }
    
    // Emergency bypass for frozen ads
    emergencyBypass() {
        console.log('Emergency bypass activated');
        this.createSession();
        this.hideAdModal();
        this.showApp();
        this.startSessionTimer();
    }
    
    // Debug methods
    forceExpireSession() {
        if (CONFIG.DEBUG.ENABLED) {
            this.sessionEndTime = new Date().getTime() - 1000;
            this.handleSessionExpiry();
        }
    }
    
    // Skip ad completely (for development/debugging)
    skipAdCompletely() {
        if (CONFIG.DEBUG.ENABLED || CONFIG.ADSENSE.TEST_MODE) {
            this.emergencyBypass();
        }
    }
    
    getSessionInfo() {
        return {
            hasActiveSession: this.hasActiveSession,
            sessionEndTime: this.sessionEndTime,
            remainingTime: this.getRemainingTime(),
            isFirstVisit: this.isFirstVisit
        };
    }
}

// Additional utility functions for ad integration
const AdUtils = {
    // Check if ad blockers are present
    detectAdBlocker() {
        return new Promise((resolve) => {
            const testAd = document.createElement('div');
            testAd.innerHTML = '&nbsp;';
            testAd.className = 'adsbox';
            testAd.style.position = 'absolute';
            testAd.style.left = '-10000px';
            
            document.body.appendChild(testAd);
            
            setTimeout(() => {
                const isBlocked = testAd.offsetHeight === 0;
                document.body.removeChild(testAd);
                resolve(isBlocked);
            }, 100);
        });
    },
    
    // Show ad blocker message
    showAdBlockerMessage() {
        const app = document.getElementById('app');
        
        if (app) {
            app.innerHTML = `
                <div class="adblocker-message">
                    <div class="adblocker-content">
                        <h2>🚫 Ad Blocker Detected</h2>
                        <p>JWA Map is supported by ads to keep it free for everyone.</p>
                        <p>Please disable your ad blocker for this site to continue.</p>
                        <button class="btn" onclick="location.reload()">I've Disabled It</button>
                    </div>
                </div>
            `;
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdManager, AdUtils };
}