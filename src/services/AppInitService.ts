/**
 * Centralized App Initialization Service
 * 
 * REFACTORED: Removed global prefetching to implement lazy loading strategy
 * Each module now loads its own data when needed, preventing stale data issues
 * 
 * This service now only handles:
 * - Authentication state validation
 * - Essential app-level configuration
 * - No module data prefetching
 */
class AppInitService {
    private isInitialized = false;
    private isLoading = false;

    /**
     * Initialize application - minimal initialization only
     * No longer prefetches module data (lazy loading strategy)
     */
    async initialize(dispatch: any) {
        if (this.isInitialized || this.isLoading) {
            console.log("App already initialized or loading");
            return;
        }

        this.isLoading = true;
        try {
            console.log("Initializing app...");

            // Only initialize essential app-level configuration
            // Module data will be loaded lazily when modules are accessed
            
            // TODO: Add any essential app-level initialization here
            // Examples: theme, language, feature flags, etc.

            this.isInitialized = true;
            console.log("App initialization complete");
        } catch (error) {
            console.error("App initialization failed:", error);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * DEPRECATED: Force refresh methods removed
     * 
     * Modules should handle their own data refresh using RTK Query cache invalidation
     * or by dispatching their own fetch actions when needed.
     * 
     * This prevents stale data issues and keeps modules self-contained.
     */

    /**
     * Reset initialization state
     * Useful for logout or re-initialization scenarios
     */
    reset() {
        this.isInitialized = false;
        this.isLoading = false;
    }

    /**
     * Check if app is initialized
     */
    getIsInitialized(): boolean {
        return this.isInitialized;
    }
}

// Export singleton instance
export const appInitService = new AppInitService();