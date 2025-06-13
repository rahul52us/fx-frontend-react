// import { manipulateDateWithMonth } from "../../../../../../config/constant/dateUtils";

// import { readFileAsBase64 } from "../../../../../../config/constant/function";
import { transformPermissionsForForm } from "./function";

export const defaultPermissions: any = {
  adminAccess:{add : false},
  dashboard: { view: true },
  user: { add: false, edit: false, delete: false, view: false },
  personalProfile : { edit: false, delete: false, view: true },
  trip: { add: false, edit: false, view: true, delete: false },
  course: { add: false, edit: false, view: false, delete: false },
  videos: { add: false, edit: false, view: false, delete: false },
  project: { add: false, edit: false, view: true, delete: false },
  task: { add: false, edit: false, view: true, delete: false },
  managers: { view: false },
  books : {view : true, add : false, edit : false, delete : false },
  bookCategory : {view : true, add : false, edit : false, delete : false }
};

export const employDropdownData: any = [
  {
    label: "BSE",
    options: [
      { label: "Rahul", value: "rahul" },
      { label: "kuldeep", value: "kuldeep" },
    ],
  },
  {
    label: "Gamers",
    options: [
      { label: "POKY", value: "poky" },
      { label: "hockey", value: "hockey" },
    ],
  },
];

export const titles: any = [
  {
    label: "MR",
    value: "mr",
  },
  {
    label: "MRS",
    value: "mrs",
  },
];

export const eTypeOption = [
  { label: "User", value: "user" },
  {
    label: "Manager",
    value: "manager",
  },
  { label: "admin", value: "admin" },
  { label: "SuperAdmin", value: "superadmin" },
];

export const getUserInitialValues = (type: string, data: any) => {
  if (type === "profile-details") {
    data = { ...data, ...data?.profileDetails[0] };
    let dt: any = {
      title:
        titles.find((item: any) => item.value === data?.title) || titles[0],
      firstName: data?.name?.split(" ")[0] || "",
      lastName: data?.name?.split(" ")[1] || "",
      code: data?.code || "",
      language: Array.isArray(data?.language)
        ? data?.language.map((item: any) => ({ label: item, value: item }))
        : [],
      username: data?.username || "",
      pic:  data ? data.pic?.url ? {file : data.pic } : {file : []} : {file : []},
      dob: data.dob ? new Date(data?.dob) : new Date(),
      personalEmail: data?.personalEmail || "",
      nickName: data?.nickName || "",
      healthCardNo: data?.healthCardNo || "",
      bloodGroup: data?.bloodGroup || "",
      panNo: data?.panNo || "",
      maritalStatus: data?.maritalStatus || "",
      aadharNo: data?.aadharNo || "",
      pfUanNo: data?.pfUanNo || "",
      insuranceCardNo: data?.insuranceCardNo || "",
      medicalCertificationDetails: data?.medicalCertificationDetails || "",
      refferedBy: data?.refferedBy || "",
      weddingDate: data?.weddingDate ? new Date(data?.weddingDate) : undefined,
      mobileNo: data?.mobileNo || "",
      bio: data?.bio || "",
      password: "",
      confirmPassword: "",
      emergencyNo: data?.emergencyNo || "",
      addressInfo: data?.addressInfo?.length
        ? data?.addressInfo
        : [
            {
              address: "",
              country: "",
              state: "",
              city: "",
              pinCode: "",
            },
          ],
    };
    if (data) {
      delete dt.password;
      delete dt.confirmPassword;
    }
    return { profileDetails: dt };
  } else if (type === "bank-details") {
    let bankDetail: any = {};
    console.log(data)
    if (data) {
      bankDetail = {
        ...data?.bankDetails[0]
      };
    }
    return {
      bankDetails: {
        cancelledCheque:  data ? data.bankDetails[0].cancelledCheque?.url ? {file : data.bankDetails[0].cancelledCheque } : {file : []} : {file : []},
        nameAsPerBank: bankDetail?.nameAsPerBank || "",
        name: bankDetail?.name || "",
        accountNo: bankDetail?.accountNo || "",
        ifsc: bankDetail?.ifsc || "",
        branch: bankDetail?.branch || "",
      },
    };
  } else if (type === "family-details") {
    let familyDetails = { ...data?.familyDetails[0] };
    return {
      familyDetails: {
        relations: familyDetails?.relations || [],
      },
    };
  } else if (type === "work-experience") {
    let workExperience: any = {
      experienceDetails: [
        {
          pastUserr: "",
          startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          endDate: new Date(),
          relevantExperience: "",
          designation: "",
          jobProfile: "",
          Lastctc: "",
          leavingReason: "",
          certificate: {
            file: null,
            isDeleted: 0,
            isAdd: 0,
          },
        },
      ],
    };
    if (data && data?.workExperience[0]?.experienceDetails) {
      workExperience = {
        experienceDetails: data.workExperience[0]?.experienceDetails?.map(
          (item: any) => ({
            ...item,
            startDate: new Date(item.startDate),
            endDate: new Date(item.endDate),
            certificate: item.certificate
              ? { file: [{ ...item.certificate, file: item.certificate?.url }] }
              : null,
          })
        ),
      };
    }
    return {
      workExperience: workExperience
    };
  }
  else if (type === "documents") {
    return {documents : {documents : data?.documents?.length ? data?.documents[0]?.documents ? data?.documents[0]?.documents?.map((it: any) => ({
      ...it,
      file: Object.entries(it.file || {}).length ? [it.file] : undefined,
    })) : [] : [],deleteAttachments : []}}

  }
  else if (type === "qualifications") {
    return {qualifications : {qualifications : data?.qualifications?.length ? data?.qualifications[0]?.qualifications ? data?.qualifications[0]?.qualifications?.map((it: any) => ({
      ...it,
      file: Object.entries(it.file || {}).length ? [it.file] : undefined,
    })) : [] : [],deleteAttachments : []}}
  }
   else if (type === "company-details") {
    let details: any = {};
    if (data) {
      details = data?.companyDetail?.length
        ? data.companyDetail[0].details?.length
          ? data.companyDetail[0].details[
              data.companyDetail[0].details?.length - 1
            ]
          : {}
        : {};
    }
    return {
      companyDetails: {
        department: undefined,
        designation: undefined,
        managers: undefined,
        workTiming: undefined,
        workingLocation: undefined,
        eType: eTypeOption[0],
        description: "",
        ...details,
        doj: details.doj ? new Date(details.doj) : new Date(),
        confirmationDate: details.confirmationDate
          ? new Date(details.confirmationDate)
          : new Date(),
      },
    };
  } else if (type === "permissions") {
    return {
      permissions: {
        permissions: data
          ? transformPermissionsForForm(data?.permissions || defaultPermissions)
          : defaultPermissions,
      },
    };
  } else {
    return { profileDetails: {} };
  }
};

export const generateSubmitResponse = async (datas: any) => {
  const data = { ...datas };

  let dt: any = { ...data };
  dt.name = `${dt.firstName} ${dt.lastName}`;
  dt.title = dt.title?.value;
  dt.language = dt.language?.map((item: any) => item.value);
  delete dt.firstName;
  delete dt.lastName;
  delete dt.confirmPassword;
  dt = {
    ...dt,
    dob: dt.dob,
    weddingDate: dt.weddingDate,
  };
  return dt;
};

export const generateTableData = (data: any[]) => {
  return data.map((item: any) => ({
    ...item,
    ...item.profileDetails[0],
    ...item.userData,
  }));
};
