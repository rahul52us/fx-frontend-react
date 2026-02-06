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

  getEditedData = async (userId: string) => {
    this.loading = true;
    try {
      const { data } = await axios.post("/api/getedited/", { userId });
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
