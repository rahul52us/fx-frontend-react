import {
  FaExclamationCircle,
  FaMale,
  FaFemale, // Import the female icon for gender specific cases
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";
import { dashboard } from "../../../../config/constant/routes";

// Helper function to assign icon based on requirement
const getIcon = (category : any) => {
  switch (category) {
    case "NoOfUsers":
      return FaUsers;
    case "NoOfMale":
      return FaMale;
    case "NoOfFemale":
      return FaFemale;
    case "CREATE":
      return FaTimesCircle;
    default:
      return FaExclamationCircle; // Default icon in case category doesn't match
  }
};

export const cardArrayData = {
  NoOfUsers: {
    title: "Total Users",
    value: 0,
    icon: getIcon("NoOfUsers"), // Dynamically assign the icon
    link: dashboard.Users.details,
    colorScheme: 'blue',
    bg:"#EDFFEF"
  },
  NoOfMale: {
    title: "Total Male",
    value: 0,
    icon: getIcon("NoOfMale"),
    link: "",
    colorScheme: 'teal',
    bg:"#ECFBFF"
  },
  NoOfFemale: {
    title: "Total Female",
    value: 0,
    icon: getIcon("NoOfFemale"),
    link: "",
    colorScheme: 'teal',
    bg:"#FFF2EC"
  },
  CREATE: {
    title: "Total Users",
    value: 0,
    icon: getIcon("CREATE"),
    colorScheme: 'red',
    link: `${dashboard.Users.details}/new/?tab=profile-details`,
    bg:"#F4F2FF"
  },
};
