import { useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";

import outpassService from "../services/outpassService";

// ============================================================
// RESPONSE HELPERS
// ============================================================

const unwrapResponse = (response) => {
  // Axios: { data: { success, data } }
  // Service: { success, data }

  if (
    response &&
    typeof response === "object" &&
    response.data &&
    typeof response.data === "object" &&
    typeof response.data.success === "boolean"
  ) {
    return response.data;
  }

  return response;
};

const getErrorMessage = (error, fallback = "Something went wrong.") => {
  const serverData = error?.response?.data;

  const errors = serverData?.errors || error?.errors;

  if (Array.isArray(errors) && errors.length) {
    return errors
      .map((item) =>
        typeof item === "string" ? item : item?.message || "Validation failed.",
      )
      .join(", ");
  }

  return serverData?.message || error?.message || fallback;
};

const requireSuccessfulResponse = (response, fallback) => {
  const result = unwrapResponse(response);

  if (!result || result.success !== true) {
    const error = new Error(
      result?.message ||
        (Array.isArray(result?.errors) ? result.errors.join(", ") : "") ||
        fallback,
    );

    // Preserve backend error codes for
    // ApplyOutpass.jsx daily limit detection.
    error.code = result?.code;
    error.errors = result?.errors;
    error.response = {
      data: result || {},
    };

    throw error;
  }

  return result;
};

// ============================================================
// CUSTOM OUTPASS HOOK
// ============================================================

const useOutpass = () => {
  const [loading, setLoading] = useState(false);

  const pendingRequests = useRef(0);

  const beginRequest = useCallback(() => {
    pendingRequests.current += 1;
    setLoading(true);
  }, []);

  const finishRequest = useCallback(() => {
    pendingRequests.current = Math.max(0, pendingRequests.current - 1);

    if (pendingRequests.current === 0) {
      setLoading(false);
    }
  }, []);

  // ==========================================================
  // APPLY OUTPASS
  //
  // IMPORTANT:
  // Do not show toast here.
  // ApplyOutpass.jsx handles success and error toast.
  //
  // Preserve backend daily-limit errors.
  // ==========================================================

  const submitOutpass = useCallback(
    async (payload) => {
      beginRequest();

      try {
        // Student, parent and mentor details
        // are resolved by the existing backend.
        const requestData = {
          reason: String(payload?.reason || "").trim(),
          destination: String(payload?.destination || "").trim(),
          outDate: payload?.outDate,
          outTime: payload?.outTime,
          inTime: payload?.inTime || null,
        };

        const response = await outpassService.applyOutpass(requestData);

        return requireSuccessfulResponse(
          response,
          "Unable to submit outpass request.",
        );
      } finally {
        finishRequest();
      }
    },
    [beginRequest, finishRequest],
  );

  // ==========================================================
  // ACTIVE OUTPASS
  // ==========================================================

  const fetchActiveOutpass = useCallback(async () => {
    beginRequest();

    try {
      const response = await outpassService.getActiveOutpass();

      const result = unwrapResponse(response);

      if (result?.success === false) {
        throw new Error(result.message || "Unable to fetch active outpass.");
      }

      return result;
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to fetch active outpass."), {
        duration: 1000,
      });

      throw error;
    } finally {
      finishRequest();
    }
  }, [beginRequest, finishRequest]);

  // ==========================================================
  // OUTPASS HISTORY
  // ==========================================================

  const fetchHistory = useCallback(
    async (page = 1, limit = 10) => {
      beginRequest();

      try {
        const response = await outpassService.getOutpassHistory(page, limit);

        const result = unwrapResponse(response);

        if (result?.success === false) {
          throw new Error(result.message || "Unable to fetch outpass history.");
        }

        return result;
      } catch (error) {
        toast.error(
          getErrorMessage(error, "Failed to fetch outpass history."),
          { duration: 1000 },
        );

        throw error;
      } finally {
        finishRequest();
      }
    },
    [beginRequest, finishRequest],
  );

  // ==========================================================
  // OUTPASS DETAILS
  // ==========================================================

  const fetchOutpassDetails = useCallback(
    async (outpassId) => {
      beginRequest();

      try {
        const response = await outpassService.getOutpassDetails(outpassId);

        const result = unwrapResponse(response);

        if (result?.success === false) {
          throw new Error(result.message || "Unable to fetch outpass details.");
        }

        return result;
      } catch (error) {
        toast.error(
          getErrorMessage(error, "Failed to fetch outpass details."),
          { duration: 1000 },
        );

        throw error;
      } finally {
        finishRequest();
      }
    },
    [beginRequest, finishRequest],
  );

  // ==========================================================
  // CANCEL OUTPASS
  // ==========================================================

  const cancelOutpass = useCallback(
    async (outpassId) => {
      beginRequest();

      try {
        const response = await outpassService.cancelOutpass(outpassId);

        const result = requireSuccessfulResponse(
          response,
          "Unable to cancel outpass.",
        );

        toast.success(result.message || "Outpass cancelled successfully.", {
          duration: 1000,
        });

        return result;
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to cancel outpass."), {
          duration: 1000,
        });

        throw error;
      } finally {
        finishRequest();
      }
    },
    [beginRequest, finishRequest],
  );

  // ==========================================================
  // EXPORT
  // ==========================================================

  return {
    loading,
    submitOutpass,
    fetchActiveOutpass,
    fetchHistory,
    fetchOutpassDetails,
    cancelOutpass,
  };
};

export default useOutpass;
