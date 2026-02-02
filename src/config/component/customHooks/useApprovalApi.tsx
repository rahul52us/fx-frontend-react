// hooks/useApprovalApi.ts
import { useState } from "react";
import { fetchApprovals, processApproval } from "../../../services/service";
// import { fetchApprovals, processApproval } from "../services/approval.service";

export const useApprovalApi = () => {
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getApprovals = async (payload: {
    register: string;
    userId: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      return await fetchApprovals(payload);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch approvals");
      throw err;
    } finally {
      setLoading(false);
    }
  };

const submitApproval = async (payload: any) => {
  try {
    setActionLoading(true);
    return await processApproval(payload);
  } catch (err) {
    throw err; // 🔴 REQUIRED
  } finally {
    setActionLoading(false);
  }
};


  return {
    loading,
    actionLoading,
    error,
    getApprovals,
    submitApproval,
  };
};
