import { useState, useCallback } from "react";
import { toast } from "react-toastify";

import outpassService from "../services/outpassService";

const useOutpass = () => {
  const [loading, setLoading] = useState(false);

  // ==========================================================================
  // Apply Outpass
  // ==========================================================================

  const submitOutpass = useCallback(async (payload) => {
    try {
      setLoading(true);

      return await outpassService.applyOutpass(payload);
    } catch (error) {
      console.error("Submit Outpass Error :", error);

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.errors?.join(", ") ||
          "Failed to submit outpass.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================================================
  // Active Outpass
  // ==========================================================================

  const fetchActiveOutpass = useCallback(async () => {
    try {
      setLoading(true);

      return await outpassService.getActiveOutpass();
    } catch (error) {
      console.error("Fetch Active Outpass Error :", error);

      toast.error(
        error?.response?.data?.message || "Failed to fetch active outpass.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================================================
  // History
  // ==========================================================================

  const fetchHistory = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);

      return await outpassService.getOutpassHistory(page, limit);
    } catch (error) {
      console.error("Fetch History Error :", error);

      toast.error(
        error?.response?.data?.message || "Failed to fetch outpass history.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================================================
  // Outpass Details
  // ==========================================================================

  const fetchOutpassDetails = useCallback(async (outpassId) => {
    try {
      setLoading(true);

      return await outpassService.getOutpassDetails(outpassId);
    } catch (error) {
      console.error("Fetch Details Error :", error);

      toast.error(
        error?.response?.data?.message || "Failed to fetch outpass details.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================================================
  // Cancel Outpass
  // ==========================================================================

  const cancelOutpass = useCallback(async (outpassId) => {
    try {
      setLoading(true);

      const response = await outpassService.cancelOutpass(outpassId);

      if (response?.success) {
        toast.success(response.message || "Outpass cancelled successfully.");
      } else {
        toast.error(response?.message || "Unable to cancel outpass.");
      }

      return response;
    } catch (error) {
      console.error("Cancel Outpass Error :", error);

      toast.error(
        error?.response?.data?.message || "Failed to cancel outpass.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================================================
  // Export
  // ==========================================================================

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
