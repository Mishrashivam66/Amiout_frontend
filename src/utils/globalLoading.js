/* ============================================================
   AMIOUT ENTERPRISE - GLOBAL API LOADING MANAGER

   - Tracks requests using the shared Axios instance
   - Supports multiple parallel requests
   - Automatically stops loading on success or error
   - Prevents duplicate interceptor registration
============================================================ */

let activeRequests = 0;

const listeners = new Set();
const attachedInstances = new WeakSet();

const notify = () => {
  for (const listener of listeners) {
    listener(activeRequests);
  }
};

// Subscribe from React.
export const subscribeGlobalLoading = (listener) => {
  listeners.add(listener);

  // Send current loading state immediately.
  listener(activeRequests);

  return () => {
    listeners.delete(listener);
  };
};

// Attach once to your EXISTING Axios instance.
export const attachGlobalLoading = (api) => {
  if (!api?.interceptors || attachedInstances.has(api)) {
    return;
  }

  attachedInstances.add(api);

  const stopTracking = (config) => {
    if (!config?.__amioutGlobalLoadingTracked) {
      return;
    }

    // Avoid decrementing more than once.
    config.__amioutGlobalLoadingTracked = false;

    activeRequests = Math.max(0, activeRequests - 1);

    notify();
  };

  // ================================================
  // REQUEST INTERCEPTOR
  // ================================================

  api.interceptors.request.use(
    (config) => {
      // Optional way to exclude background requests.
      if (config.skipGlobalLoader === true) {
        return config;
      }

      config.__amioutGlobalLoadingTracked = true;

      activeRequests += 1;

      notify();

      return config;
    },
    (error) => {
      stopTracking(error?.config);

      return Promise.reject(error);
    },
  );

  // ================================================
  // RESPONSE INTERCEPTOR
  // ================================================

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
