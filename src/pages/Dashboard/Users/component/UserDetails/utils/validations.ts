import * as Yup from "yup";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const panRegExp = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
const aadharRegExp = /^\d{12}$/;
const insuranceCardRegExp = /^[A-Za-z]{3}[0-9]{9}$/;

export const ChangePasswordValidation = Yup.object().shape({
  oldPassword: Yup.string()
    .required("Old Password is required")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, and one number"
    ),
  newPassword: Yup.string()
    .required("New Password is required")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

const addressValidation = Yup.object().shape({
  address: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title must not exceed 120 characters")
    .required("Title is required"),
  country: Yup.string().required("please select the country"),
  state: Yup.string().required("please select the state"),
  city: Yup.string().required("please select the city"),
  pinCode: Yup.string().required("please enter the pinCode"),
});

export const UserCreateValidation = Yup.object().shape({
  title:Yup.mixed().required('title is required'),
  firstName: Yup.string()
    .min(2, "First Name should be at least 2 characters")
    .max(60, "First Name cannot be longer than 60 characters")
    .required("First Name is required"),
  lastName: Yup.string()
    .min(2, "Last Name should be at least 2 characters")
    .max(60, "Last Name cannot be longer than 60 characters")
    .required("Last Name is required"),
  mobileNo: Yup.string()
    .required("Mobile number is required")
    .matches(phoneRegExp, "Mobile number is not valid"),
  emergencyNo: Yup.string().matches(
    phoneRegExp,
    "Emergency number is not valid"
  ),
  username: Yup.string()
    .min(3, "Username should be at least 3 characters")
    .required("Username is required"),
  code: Yup.string()
    .min(4, "Code should be at least 4 characters")
    .required("Code is required")
    .trim(),
  dob: Yup.date().required('Date Of Birth is required'),
  bio: Yup.string().trim().min(20, "Bio should be at least 20 characters"),
  language: Yup.mixed()
    .required("Select the language")
    .typeError("Select the language"),
  addressInfo: Yup.array()
    .min(1, "At least 1 address is required")
    .of(addressValidation),
  password: Yup.string()
    .required("New Password is required")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
  personalEmail: Yup.string().email("Invalid email address").required(),
  healthCardNo: Yup.string(),
  bloodGroup: Yup.string(),
  panNo: Yup.string().matches(panRegExp, "Invalid PAN number"),
  maritalStatus: Yup.string(),
  aadharNo: Yup.string()
    .matches(aadharRegExp, "Invalid Aadhar number")
    .nullable(),
  pfUanNo: Yup.string(),
  insuranceCardNo: Yup.string()
    .matches(insuranceCardRegExp, "Invalid insurance card number")
    .nullable(),
  medicalCertificationDetails: Yup.string(),
  refferedBy: Yup.string(),
  weddingDate: Yup.date(),
});

export const UserUpdateProfileValidation = Yup.object().shape({
  title:Yup.mixed().required('title is required'),
  firstName: Yup.string()
    .min(2, "First Name should be at least 2 characters")
    .max(60, "First Name cannot be longer than 60 characters")
    .required("First Name is required"),
  lastName: Yup.string()
    .min(2, "Last Name should be at least 2 characters")
    .max(60, "Last Name cannot be longer than 60 characters")
    .required("Last Name is required"),
  mobileNo: Yup.string()
    .required("Mobile number is required")
    .matches(phoneRegExp, "Mobile number is not valid"),
  emergencyNo: Yup.string().matches(
    phoneRegExp,
    "Emergency number is not valid"
  ),
  username: Yup.string()
    .min(3, "Username should be at least 3 characters")
    .required("Username is required"),
  code: Yup.string()
    .min(4, "Code should be at least 4 characters")
    .required("Code is required")
    .trim(),
  dob: Yup.date().required('Date Of Birth is required'),
  bio: Yup.string().trim().min(20, "Bio should be at least 20 characters"),
  language: Yup.mixed()
    .required("Select the language"),
  addressInfo: Yup.array()
    .min(1, "At least 1 address is required")
    .of(addressValidation),
  personalEmail: Yup.string().email("Invalid email address").required(),
  healthCardNo: Yup.string(),
  bloodGroup: Yup.string(),
  panNo: Yup.string().matches(panRegExp, "Invalid PAN number"),
  maritalStatus: Yup.string(),
  aadharNo: Yup.string()
    .matches(aadharRegExp, "Invalid Aadhar number")
    .nullable(),
  pfUanNo: Yup.string(),
  insuranceCardNo: Yup.string()
    .matches(insuranceCardRegExp, "Invalid insurance card number")
    .nullable(),
  medicalCertificationDetails: Yup.string(),
  refferedBy: Yup.string(),
  weddingDate: Yup.date(),
});

export const UserEditValidation = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First Name atleast of 2 characters")
    .max(60, "First Name cannot greater than 60 characters")
    .required("First Name is required"),
  lastName: Yup.string()
    .min(2, "Last Name atleast of 2 characters")
    .max(60, "Last Name cannot greater than 60 characters")
    .required("Last Name is required"),
  mobileNo: Yup.string()
    .required("Mobile number is Required")
    .matches(phoneRegExp, "Mobile number is not valid"),
  emergencyNo: Yup.string().matches(
    phoneRegExp,
    "Emergency number is not valid"
  ),
  username: Yup.string()
    .min(3, "username name should be atleast of 3 characters")
    .required()
    .typeError("username is required"),
  motherName: Yup.string()
    .trim()
    .min(2, "Mother Name atleast of 2 characters")
    .required("Mother Name is required"),
  nickName: Yup.string().trim().min(2, "Nick Name atleast of 2 characters"),
  bio: Yup.string().trim().min(20, "Bio atleast of 20 characters"),
  fatherName: Yup.string()
    .trim()
    .min(2, "Father Name atleast of 2 characters")
    .required("Father Name is required"),
  language: Yup.mixed()
    .required("Select the language")
    .typeError("Select the language"),
  addressInfo: Yup.array()
    .min(1, "atleast 1 address is required")
    .of(addressValidation),
});


export const bankCreationValidation = Yup.object().shape({
  nameAsPerBank: Yup.string()
    .min(2, "Name atleast of 2 characters")
    .max(120, "Name cannot greater than 120 characters").trim()
    .required("Name is required"),
  name: Yup.string()
    .min(2, "Bank Name atleast of 2 characters")
    .max(120, "Bank Name cannot greater than 120 characters").trim()
    .required("Bank Name is required"),
  accountNo: Yup.string()
    .min(8, "Account Number atleast of 8 characters")
    .max(60, "Bank Name cannot greater than 60 characters").trim()
    .required("Account Number is required"),
  ifsc: Yup.string()
    .min(6, "IFSC Number atleast of 6 characters")
    .max(60, "IFSC cannot greater than 60 characters").trim()
    .required("IFSC is required"),
    branch: Yup.string()
    .min(2, "Branch atleast of 2 characters")
    .max(180, "Branch cannot greater than 120 characters").trim()
    .required("Branch is required"),
})

const FamilyDetailsValidationSchema = Yup.object().shape({
  relations: Yup.array().of(
    Yup.object().shape({
      name: Yup.string(),
      relation: Yup.string(),
      dob: Yup.string(),
      contactNo: Yup.string(),
      aadharNo: Yup.string(),
      occupation: Yup.string(),
      pf_nomination: Yup.string(),
      gratuity_nomination: Yup.string(),
      esic_nomination: Yup.string(),
      coveredEsic: Yup.string(),
      coveredMediclaim: Yup.string(),
      address: Yup.string()
    })
  ),
});

const WorkExperienceDetails = Yup.object().shape({
  experienceDetails: Yup.array()
    .of(
      Yup.object().shape({
        pastUserr: Yup.string().trim().required('Past Userr is required'),
        startDate: Yup.date().required('start Date is required'),
        endDate: Yup.date().required('End Date is required'),
        relevantExperience: Yup.string().trim().required('Relevant Experience is required'),
        designation: Yup.string().trim().required('Desination is required'),
        jobProfile: Yup.string().trim(),
        Lastctc: Yup.string().trim().required('Ctc is required'),
        leavingReason: Yup.string().trim().required('Leaving reason is required')
      })
    )
    .required("Experience details are required"),
});

export const UserCompanyDetailsValidation = Yup.object().shape({
  workTiming:Yup.mixed().required('workTiming is required'),
  department:Yup.mixed().required('department is required'),
  designation:Yup.mixed().required('designation is required'),
  managers:Yup.mixed(),
  doj:Yup.mixed().required('Date of joining is required'),
  confirmationDate : Yup.mixed().required('Confirmation Date is required'),
  workingLocation:Yup.mixed().required('work Location is required'),
  eType:Yup.mixed().required('E-Type is required'),
  description:Yup.string().trim()
})

export const getUserValidation = (type : string, mode : string) => {
  if(type === "profile-details"){
    if(mode === "edit"){
      return UserUpdateProfileValidation
    }
    else {
      return UserCreateValidation
    }
  }
  else if(type === "bank-details"){
    if(mode === "edit"){
      return bankCreationValidation
    }
    else {
      return bankCreationValidation
    }
  }
  else if(type === "family-details"){
    if(mode === "edit"){
      return FamilyDetailsValidationSchema
    }
    else {
      return FamilyDetailsValidationSchema
    }
  }
  else if(type === "work-experience"){
    if(mode === "edit"){
      return WorkExperienceDetails
    }
    else {
      return WorkExperienceDetails
    }
  }
  else if(type === "company-details"){
    if(mode === "edit"){
      return UserCompanyDetailsValidation
    }
    else {
      return UserCompanyDetailsValidation
    }
  }
  else if(type === "permissions"){
    if(mode === "edit"){
      return {}
    }
    else {
      return {}
    }
  }
  else {
    return UserCreateValidation
  }
}