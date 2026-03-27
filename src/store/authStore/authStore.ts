import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { action, makeObservable, observable } from "mobx";
import CryptoJS from "crypto-js";
import { backendBaseUrl } from "../../config/constant/urls";
import { registerPermissions } from "../../pages/Dashboard/Users/component/UserDetails/utils/constant";

interface Notification {
  title?: any;
  message: string;
  type?: any;
  placement?: string;
  action?: any;
}

class AuthStore {
  loading: boolean = false;
  user: any | null = null;
  company: any | null = null;
  openSearch: any = false;
  loginModel: Boolean = false;
  notification: Notification | null = null;
  isRememberCredential = true;
  companyUsers = [];
  viewAsUserId: string | null = null;
  role: any = "user";
  webLoader: boolean = false;
  currentCompanyDetails: any = {};
  bussinessUnitsData: any[] = [];
  banksData: any[] = [];
  currenciesData: any[] = [];
  businessUnits: any[] = [
    {
      unitCode: "unit bank 1",
      banks: [
        {
          bankName: "bank 1",
          currency: "GAME",
          margin: "20",
          location: "india",
        },
        {
          bankName: "bank 2",
          currency: "SECOND",
          margin: "50",
          location: "agra",
        },
      ],
    },
    {
      unitCode: "NOS",
      banks: [
        {
          bankName: "second bank 1",
          currency: "GAME",
          margin: "50",
          location: "location",
        },
      ],
    },
  ];
  constructor() {
    this.initiatAppOptions();
    makeObservable(this, {
      user: observable,
      notification: observable,
      companyUsers: observable,
      openSearch: observable,
      loginModel: observable,
      company: observable,
      viewAsUserId: observable,
      bussinessUnitsData: observable,
      banksData: observable,
      role: observable,
      webLoader: observable,
      currentCompanyDetails: observable,
      businessUnits: observable,
      openLoginModel: action,
      login: action,
      register: action,
      doLogout: action,
      updateProfile: action,
      closeSearchBar: action,
      openNotification: action,
      closeNotication: action,
      checkPermission: action,
      setViewAsUserId: action,
      updateUserProfile: action,
      uploadUserPic: action,
      sendNotification: action,
      restoreUser: action,
      forgotPasswordStore: action,
      changePasswordStore: action,
      resetPasswordStore: action,
      verifyEmail: action,
      createOrganisation: action,
      getCompanyUsers: action,
      getCurrentCompany: action,
      hasComponentAccess: action,
      canPerformTableAction: action,
      getPolicy: action,
      verifyAppEmail: action,
      handleContactMail: action,
      setBusinessUnits: action,
      getBusinessUnits: action,
    });
  }

  setAppAxiosDefaults = async () => {
    axios.defaults.baseURL = backendBaseUrl;
  };

  initiatAppOptions = () => {
    this.loading = true;
    this.setAppAxiosDefaults();
    const authorization_token = process.env.REACT_APP_AUTHORIZATION_TOKEN;
    if (authorization_token) {
      const token: string | null = localStorage.getItem(authorization_token);
      if (token && token !== "undefined") {
        const headers: AxiosRequestConfig["headers"] = {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        };
        Object.assign(axios.defaults.headers, headers);
        this.setUserOptions();
      } else {
        this.loading = false;
        this.user = null;
        this.clearLocalStorage();
      }
    } else {
      this.loading = false;
      this.user = null;
      this.clearLocalStorage();
    }
  };

  setUserOptions = () => {
    this.webLoader = true;
    axios
      .post("/auth/me/")
      .then(({ data }: AxiosResponse<{ data: any }>) => {
        this.company = "company_id";
        this.user = data.data;
        this.role = this.user?.role;
        this.user.permissions = this.user.permissions || registerPermissions || {};
        this.currentCompanyDetails = this.company;
        if (this.user.role === "user") {
          this.viewAsUserId = this.user?.userId;
        }
        this.setBanksDetailsData(this.user?.businessUnits || []);
        sessionStorage.setItem(
          process.env.REACT_APP_AUTHORIZATION_USER_DATA!,
          CryptoJS.AES.encrypt(
            JSON.stringify(this.user),
            process.env.REACT_APP_ENCRYPT_SECRET_KEY!
          ).toString()
        );
      })
      .catch(() => {
        this.loading = false;
        this.clearLocalStorage();
        this.initiatAppOptions();
      })
      .finally(() => {
        this.webLoader = false;
      });
  };

  // setBanksDetailsData = (data: any) => {
  //   const businessUnits = Array.from(
  //     new Set<string>(data.map((u: any) => u.unitCode))
  //   ).map((unit) => ({ label: unit, value: unit }));

  //   const banks = Array.from(
  //     new Set<string>(
  //       data.flatMap((u: any) =>
  //         u.banks.map((b: any) => b.bankName)
  //       )
  //     )
  //   ).map((bank) => ({ label: bank, value: bank }));

  //   const currencies = Array.from(
  //     new Set<string>(
  //       data.flatMap((u: any) =>
  //         u.banks.map((b: any) => b.currency)
  //       )
  //     )
  //   ).map((currency) => ({ label: currency, value: currency }));

  //   this.bussinessUnitsData = businessUnits;
  //   this.currenciesData = currencies;
  //   this.banksData = banks;
  // };


  setBanksDetailsData = (data: any) => {
  const businessUnits = Array.from(
    new Set<string>(data.map((u: any) => u.unitCode))
  ).map((unit) => ({ label: unit, value: unit }));

  // Build bankName → margin map (first occurrence wins)
  // If same bank has different margins per currency, see note below
  const bankMarginMap = new Map<string, string>();
  data.forEach((u: any) => {
    u.banks.forEach((b: any) => {
      if (!bankMarginMap.has(b.bankName)) {
        bankMarginMap.set(b.bankName, b.margin);
      }
    });
  });

  // ✅ Each bank option now carries its bankMargin
  const banks = Array.from(
    new Set<string>(
      data.flatMap((u: any) => u.banks.map((b: any) => b.bankName))
    )
  ).map((bank) => ({
    label: bank,
    value: bank,
    bankMargin: bankMarginMap.get(bank) ?? "",
  }));

  const currencies = Array.from(
    new Set<string>(
      data.flatMap((u: any) => u.banks.map((b: any) => b.currency))
    )
  ).map((currency) => ({ label: currency, value: currency }));

  this.bussinessUnitsData = businessUnits;
  this.currenciesData = currencies;
  this.banksData = banks;
};

// ✅ Helper to get margin by bank name
getBankMargin = (bankName: string): string => {
  const bank = this.banksData.find((b: any) => b.value === bankName);
  return (bank as any)?.bankMargin ?? "";
};

  clearLocalStorage = () => {
    localStorage.removeItem(
      process.env.REACT_APP_AUTHORIZATION_TOKEN as string
    );
    sessionStorage.removeItem(process.env.REACT_APP_AUTHORIZATION_USER_DATA!);
  };

  updateUserProfile = async (sendData: any) => {
    try {
      const { data } = await axios.put("/auth/update-profile", sendData);
      this.user = data.data;
      return data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data);
    }
  };

  login = async (sendData: {
    remember_me: boolean;
    username: string;
    password: string;
    loginType: string;
  }) => {
    try {
      this.isRememberCredential = sendData.remember_me;
      const { data }: any = await axios.post<{ data: any }>("/auth/login/", {
        username: sendData.username,
        password: sendData.password,
        loginType: sendData.loginType,
      });
      const headersToUpdate = {
        Accept: "application/json",
        Authorization: `Bearer ${data.access_token}`,
      };
      axios.defaults.headers = Object.assign(
        {},
        axios.defaults.headers,
        headersToUpdate
      );
      localStorage.setItem(
        process.env.REACT_APP_AUTHORIZATION_TOKEN as string,
        data.access_token
      );
      this.setUserOptions();
      return data;
    } catch (err: any) {
      console.log(err?.message);
      return Promise.reject(err?.response?.data || err.message);
    }
  };

  createOrganisation = async (value: any) => {
    try {
      const { token, ...sendData } = value;
      const { data } = await axios.post(
        `/company/create?token=${token}`,
        sendData
      );
      return data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    }
  };

  handleContactMail = async (value: any) => {
    try {
      const { ...sendData } = value;
      const { data } = await axios.post(`/auth/contact/mail`, sendData);
      return data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    }
  };

  restoreUser = () => {
    try {
      const authorization_token = process.env.REACT_APP_AUTHORIZATION_TOKEN;
      if (authorization_token) {
        const storedData = sessionStorage.getItem(
          process.env.REACT_APP_AUTHORIZATION_USER_DATA!
        );
        if (storedData) {
          const decryptedBytes = CryptoJS.AES.decrypt(
            storedData,
            process.env.REACT_APP_ENCRYPT_SECRET_KEY!
          );
          const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
          this.user = JSON.parse(decryptedData);
          return true;
        } else {
          this.doLogout();
          return false;
        }
      } else {
        this.doLogout();
        return false;
      }
    } catch (err) {
      this.user = null;
      this.doLogout();
    }
  };

  doLogout = () => {
    this.user = null;
    sessionStorage.removeItem("lastRoute");
    sessionStorage.removeItem("justLoggedIn");

    this.clearLocalStorage();
  };

  register = () => {
    return this.user;
  };

  getCurrentCompany = () => {
    return this.company;
  };

  getPolicy = () => {
    return this?.user?.companyDetail?.company?.policy?._id;
  };

  updateProfile = async (sendData: any) => {
    try {
      const { data } = await axios.put("/auth", sendData);
      this.user = data.data;
      sessionStorage.setItem(
        process.env.REACT_APP_AUTHORIZATION_USER_DATA!,
        CryptoJS.AES.encrypt(
          JSON.stringify(data.data),
          process.env.REACT_APP_ENCRYPT_SECRET_KEY!
        ).toString()
      );
      return data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err?.message);
    }
  };

  forgotPasswordStore = async (value: any) => {
    try {
      const { data } = await axios.post("/auth/forgot-password", value);
      return data.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err?.message);
    }
  };

  resetPasswordStore = async (value: any) => {
    try {
      const { data } = await axios.post("/auth/reset-password", value);
      return data.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    }
  };

  changePasswordStore = async (value: any) => {
    try {
      const { data } = await axios.post("/auth/change-password", {
        oldPassword: value.oldPassword,
        newPassword: value.newPassword,
      });
      return data.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    }
  };

  verifyEmail = async (value: string) => {
    try {
      const { data } = await axios.get(`/auth/verify-email/${value}`);
      return data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    }
  };

  verifyAppEmail = async (sendData: any) => {
    try {
      const { data } = await axios.post(`${sendData.type}/token/verify`, {
        userId: this.user._id,
        company: this.getCurrentCompany(),
        ...sendData,
      });
      return data;
    } catch (err: any) {
      return Promise.reject(err?.response || err);
    }
  };

  openNotification = (data: {
    title: any;
    message: string;
    type?: string;
    placement?: string;
    action?: any;
  }) => {
    this.notification = {
      title: data.title,
      message: data.message,
      type: data.type ? data.type : "success",
      placement: data.placement ? data.placement : "bottom",
      action: data.action ? data.action : null,
    };
  };

  closeNotication = () => {
    this.notification = null;
  };

  getDashboardCountsss = async (payload: any) => {
    try {
      const { data } = await axios.post("/api/dashboardcountsss/", payload);
      return data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    }
  };

  checkPermission = (key: string, value: string) => {
    if (
      this.user?.role === "superadmin" ||
      this.user?.role === "admin" ||
      this.user?.permissions?.adminAccess?.add
    ) {
      return value === "view" ? true : false;
    } else {
      var status = false;
      Object.entries(this.user?.permissions || {}).forEach((item: any) => {
        if (item[0] === key) {
          if (item[1][value]) {
            status = true;
          } else {
            status = false;
          }
        }
      });
      return status;
    }
  };

  hasComponentAccess = () => {
    // Check if the user has an admin or superadmin role or hasAdminAcccess
    if (
      ["admin", "superadmin"].includes(this.user?.role) ||
      this.user?.permissions?.adminAccess?.add
    ) {
      return true;
    }
    return false;
  };

  // canPerformTableAction = (action: 'add' | 'edit' | 'delete', context?: string) => {
  //   // If user is admin role, block all table operations except user management
  //   if (this.user?.role === 'admin') {
  //     // Allow admins to manage users only
  //     return context === 'users' || context === 'user';
  //   }
  //   // Superadmin can do everything
  //   if (this.user?.role === 'superadmin') {
  //     return true;
  //   }
  //   // For other roles, use existing permission system
  //   return this.checkPermission(context || '', action);
  // };

  uploadUserPic = async (sendData: any) => {
    try {
      const { data } = await axios.post("/auth/upload-pic", sendData);
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  sendNotification = async (sendData: any) => {
    try {
      const { data } = await axios.post("/notification/create", sendData);
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  getCompanyUsers = async (sendData: any = {}) => {
    try {
      const { data } = await axios.post(
        `auth/get/users`,
        { company: [this.getCurrentCompany()] },
        { params: { ...sendData } }
      );
      this.companyUsers = data.data?.map((item: any) => ({
        user: { ...item },
      }));

      if (!this.viewAsUserId && this.companyUsers.length > 0) {
        this.viewAsUserId = (this.companyUsers[0] as any).user?._id;
      }

      return this.companyUsers;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
    }
  };

  canPerformTableAction = (action: 'add' | 'edit' | 'delete', context?: string) => {
    // If user is admin role, block all table operations except user management
    if (this.user?.role === 'user') {
      // Allow admins to manage users only
      return true
    }
    // Superadmin can do everything
    // For other roles, use existing permission system
    return this.checkPermission(context || '', action);
  };

  closeSearchBar = async () => {
    if (this.openSearch) {
      this.openSearch = false;
    } else {
      this.openSearch = true;
    }
  };

  openLoginModel = async () => {
    this.loginModel = !this.loginModel ? true : false;
  };

  // Function to set business units data
  setBusinessUnits = (data: any[]) => {
    this.businessUnits = data;
  };

  // Function to get business units data
  getBusinessUnits = () => {
    return this.businessUnits;
  };

  setViewAsUserId = (id: string) => {
    this.viewAsUserId = id;
  };
}


export default AuthStore;