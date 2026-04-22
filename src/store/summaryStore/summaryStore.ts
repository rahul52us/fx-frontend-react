import axios from "axios";
import { action, makeObservable, observable } from "mobx";

class SummaryStore {
  summaryData: any = {
    data: [],
    loading: false,
    error: null,
  };

  usdSummaryData: any = {
    data: null,
    loading: false,
    error: null,
  };

  filters: any = {
    userId: "",
    exposureType: "export", // default
    currency: "",
    year: new Date().getFullYear().toString(),
    financialYear: "",
    businessUnit: "",
    bank: "",
  };

  constructor() {
    makeObservable(this, {
      summaryData: observable,
      usdSummaryData: observable,
      filters: observable,
      setFilters: action,
      fetchSummaryData: action,
      fetchUSDSummaryData: action,
      resetSummaryData: action,
      resetUSDSummaryData: action,
    });
  }

  setFilters = (newFilters: any) => {
    this.filters = { ...this.filters, ...newFilters };
  };

  resetSummaryData = () => {
    this.summaryData = {
      data: null,
      loading: false,
      error: null,
    };
  };

  resetUSDSummaryData = () => {
    this.usdSummaryData = {
      data: null,
      loading: false,
      error: null,
    };
  };

  fetchSummaryData = async () => {
    this.summaryData.loading = true;
    try {
      this.summaryData.loading = true;
      const { userId, exposureType, currency, year, financialYear, businessUnit, bank } = this.filters;
      
      const payload = {
        userId: userId,
        exposureType: { value: exposureType },
        currency,
        year: financialYear ? "" : year,
        financialYear: financialYear || "",
        businessUnit: businessUnit || "",
        bank: bank || ""
      };

      const { data: responseData } = await axios.post("/mtmview/conversionsummary/", payload);
      console.log("Raw Response Data:", responseData);
      
      // The actual data object is in responseData.data[0]
      const actualData = responseData.data && responseData.data[0] ? responseData.data[0] : {};
      console.log("Actual Data Object:", actualData);

      // Transfrom object (month-year keys) into array
      const transformedData = Object.entries(actualData).map(([monthYear, values]: [string, any]) => ({
        monthYear,
        ...values
      }));
      console.log("Transformed Data Array:", transformedData);

      this.summaryData.data = transformedData;
    } catch (err: any) {
      console.error("Error fetching summary data:", err);
      this.summaryData.data = [];
    } finally {
      this.summaryData.loading = false;
    }
  };

  fetchUSDSummaryData = async () => {
    this.usdSummaryData.loading = true;
    try {
      const { userId, exposureType, currency, year, financialYear, businessUnit, bank } = this.filters;
      const payload = { 
        userId,
        exposureType: { value: exposureType },
        currency,
        year: financialYear ? "" : year,
        financialYear: financialYear || "",
        businessUnit: businessUnit || "",
        bank: bank || ""
      };

      const { data: responseData } = await axios.post(
        `${process.env.REACT_APP_FX_BASE_URL}/mtmview/summary/`,
        payload
      );
      
      console.log("USD Summary Raw Response:", responseData);
      this.usdSummaryData.data = responseData.data || null;
      this.usdSummaryData.error = null;
    } catch (err: any) {
      console.error("Error fetching USD summary data:", err);
      this.usdSummaryData.error = err.message || "Failed to fetch USD summary";
      this.usdSummaryData.data = null;
    } finally {
      this.usdSummaryData.loading = false;
    }
  };
}

export default SummaryStore;
