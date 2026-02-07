import axios from "axios";
import { action, makeObservable, observable, runInAction } from "mobx";

class ApprovalStore {
  approvalData: any = {
    pending: [],
    approved: [],
    rejected: [],
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    totalPages: 1,
    currentPage: 1,
  };

  loading = false;
  actionLoading = false;

  constructor() {
    makeObservable(this, {
      approvalData: observable,
      loading: observable,
      actionLoading: observable,
      getEditedData: action,
      updateValidation: action,
    });
  }

  getEditedData = async ({ userId, status, page }: any) => {
    this.loading = true;
    try {
      const { data } = await axios.post("/api/getedited/", { userId, status, page });
      if (data.status === "success") {
        runInAction(() => {
          this.approvalData = data.data;
        });
      }
      return data;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateValidation = async (payload: any) => {
    this.actionLoading = true;
    try {
      const { data } = await axios.post("/api/updateval/", payload);
      return data;
    } finally {
      runInAction(() => {
        this.actionLoading = false;
      });
    }
  };
}

export default ApprovalStore;
