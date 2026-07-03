// services/approval.service.ts
import axios from "axios";
import { autoToken } from "../pages/Dashboard/utils/constant";

const BASE_URL = process.env.REACT_APP_FX_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: autoToken,
  },
});

// Optional: attach token dynamicallyon th
// export const setAuthToken = (token: string) => {
//   api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// };

/* =========================
   FETCH APPROVALS
========================= */
export const fetchApprovals = async (payload: {
  // register: string;
  userId: string;
}) => {
  const res = await api.post("/api/getedited/", payload);
  return res.data;
};

/* =========================
   PROCESS APPROVAL (NEW API)
========================= */
export const processApproval = async (payload: {
  register: string;
  userId: string;
  action: "approved" | "rejected";
  data: any[]; // ApprovalItem[]
}) => {
  const res = await api.post("/api/updateval/", payload);
  return res.data;
};




// // services/approval.service.ts

// import axios from "axios";

// const BASE_URL = process.env.REACT_APP_FX_BASE_URL;

// export const fetchApprovals = (payload: any) =>
//   axios.post(`${BASE_URL}/api/getedited/`, payload);

// export const processApproval = (payload: {
//   rowId: string;
//   action: "approve" | "reject";
//   userId: string;
// }) =>
//   axios.post(`${BASE_URL}/api/process-approval/`, payload);
