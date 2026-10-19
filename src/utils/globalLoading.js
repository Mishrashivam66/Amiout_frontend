/**
 * ============================================================
 * AMIOUT ENTERPRISE - GLOBAL API LOADING MANAGER
 * ============================================================
 *
 * - Tracks requests on the shared Axios instance
 * - Supports parallel API calls
 * - Stops tracking on success, failure or cancellation
 * - Prevents duplicate interceptor installation
 * - Supports skipGlobalLoader for background requests
 *
 * IMPORTANT:
 * Install BEFORE the authentication response interceptor.
 * ============================================================
 */

let activeRequests = 0;

const listeners = new Set();
const attachedInstances = new WeakSet();

const TRACKING_KEY = "__amioutGlobalLoadingTracked";

// ============================================================
// NOTIFY ALL SUBSCRIBERS
// ============================================================

const notify = () => {
  for (const listener of listeners) {
    try {
      listener(activeRequests);
    } catch (error) {
      // A UI listener must not interrupt API processing.
      if (import.meta.env.DEV) {
        console.error("[AMIOUT] Global loader listener error:", error);
      }
    }
  }
};

// ============================================================
// SUBSCRIBE TO GLOBAL LOADING STATE
// ============================================================

export const subscribeGlobalLoading = (listener) => {
  if (typeof listener !== "function") {
    return () => {};
  }

  listeners.add(listener);

  listener(activeRequests);

  return () => {
    listeners.delete(listener);
  };
};

// ============================================================
// ATTACH AXIOS INTERCEPTORS ONLY ONCE
// ============================================================

export const attachGlobalLoading = (api) => {
  if (
    !api?.interceptors?.request ||
    !api?.interceptors?.response ||
    attachedInstances.has(api)
  ) {
    return;
  }

  attachedInstances.add(api);

  // ==========================================================
  // STOP TRACKING AN INDIVIDUAL REQUEST
  // ==========================================================

  const stopTracking = (config) => {
    if (!config?.[TRACKING_KEY]) {
      return;
    }

    // Prevent double decrement.
    config[TRACKING_KEY] = false;

    activeRequests = Math.max(0, activeRequests - 1);

    notify();
  };

  // ==========================================================
  // REQUEST INTERCEPTOR
  // ==========================================================

  api.interceptors.request.use(
    (config) => {
      if (config.skipGlobalLoader === true) {
        return config;
      }

      // Each dispatched request must be counted once.
      if (!config[TRACKING_KEY]) {
        config[TRACKING_KEY] = true;
        activeRequests += 1;
        notify();
      }

      return config;
    },
    (error) => {
      stopTracking(error?.config);
      return Promise.reject(error);
    },
  );

  // ==========================================================
  // RESPONSE INTERCEPTOR
  // ==========================================================

  api.interceptors.response.use(
    (response) => {
      stopTracking(response?.config);
      return response;
    },
    (error) => {
      stopTracking(error?.config);
      return Promise.reject(error);
    },
  );
};
