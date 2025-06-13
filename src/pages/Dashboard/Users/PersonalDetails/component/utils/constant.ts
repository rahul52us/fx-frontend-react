interface AddressInfo {
  address: string;
  country: string;
  state: string;
  city: string;
  pinCode: string;
  _id: string;
}

// Define interface for Profile Details
interface ProfileDetail {
  _id: string;
  user: string;
  language: string[]; // Assuming language is an array of strings
  addressInfo: AddressInfo[];
  aadharNo?: string;
  bloodGroup?: string;
  dob?: string; // ISO string date
  emergencyNo?: string;
  healthCardNo?: string;
  insuranceCardNo?: string;
  maritalStatus?: string;
  medicalCertificationDetails?: string;
  mobileNo?: string;
  nickName?: string;
  panNo?: string;
  personalEmail?: string;
  pfUanNo?: string;
  refferedBy?: string;
  weddingDate?: string; // ISO string date
}

// Define interface for Designation
interface Designation {
  title: string;
}

// Define interface for Department
interface Department {
  title: string;
}

// Define interface for User Details
interface UserDetails {
  _id: string;
  username: string;
  name: string;
  code: string;
  title: string;
  profiledetails: ProfileDetail[];
  designation: Designation[];
  department: Department[];
  managerDetails: Omit<
    UserDetails,
    "profiledetails" | "designation" | "department" | "managerDetails"
  >[]; // To avoid circular reference
}

// Define interface for Company Detail
interface CompanyDetail {
  doj: string; // ISO string date
  department: Department[];
  designation: Designation[];
}

// Define interface for Users
export interface User {
  _id?: string;
  companydetail?: CompanyDetail;
  userDetails: Omit<
    UserDetails,
    "profiledetails" | "designation" | "department" | "managerDetails"
  >;
}

// Define interface for API response data
export interface ApiResponse {
  status?: string;
  data: {
    userDetails: UserDetails[];
    users: User[];
    page: number;
    limit: number;
  };
}

export const formatDate = (dateString: string): string => {
  const options:any = { day: 'numeric', month: 'short', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};



