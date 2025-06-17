import { CalendarIcon } from "@chakra-ui/icons";
import { AiOutlineStock } from "react-icons/ai";
import { BsFillForwardFill } from "react-icons/bs";
import {
  FaCog,
  FaShip
} from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { IoDocumentText, IoPieChartSharp } from "react-icons/io5";
import { MdLocalShipping } from "react-icons/md";
import { dashboard } from "../../../../constant/routes";

interface SidebarItem {
  id: number;
  name: string;
  icon: JSX.Element;
  url: string;
  role?: string[];
  children?: SidebarItem[];
}

const sidebarDatas: SidebarItem[] = [
  {
    id: 401,
    name: "Dashboard",
    icon: <IoPieChartSharp />,
    url: "/dashboard",
    role: ["user", "admin", "superadmin", "manager"],
  },
  //  Blogs
  {
    id: 505,
    name: "Export Register",
    icon: <MdLocalShipping />,
    url: dashboard.exportRegister,
    role: ["user","superadmin","manager","admin"],
    children: [
      {
        id: 506,
        name: "index",
        icon: <CalendarIcon />,
        url: `${dashboard.exportRegister}`,
        role: ["user","superadmin","manager","admin"],
      }
    ]
  },
  {
    id: 601,
    name: "Import Register",
    icon: <FaShip />,
    url: dashboard.importRegister,
    role: ["user","superadmin","manager","admin"],
    children: [
      {
        id: 602,
        name: "index",
        icon: <CalendarIcon />,
        url: `${dashboard.importRegister}`,
        role: ["user","superadmin","manager","admin"],
      }
    ]
  },
  {
    id: 601,
    name: "Daily Exposure",
    icon: <AiOutlineStock />,
    url: dashboard.importRegister,
    role: ["user","superadmin","manager","admin"],
    children: [
      {
        id: 602,
        name: "index",
        icon: <CalendarIcon />,
        url: `${dashboard.dailyExposureSheet}`,
        role: ["user","superadmin","manager","admin"],
      }
    ]
  },
  {
    id: 501,
    name: "Pcfc",
    icon: <IoDocumentText />,
    url: dashboard.pcfc,
    role: ["user","superadmin","manager","admin"],
    children: [
      {
        id: 502,
        name: "index",
        icon: <CalendarIcon />,
        url: `${dashboard.pcfc}`,
        role: ["user","superadmin","manager","admin"],
      }
    ]
  },
  {
    id: 605,
    name: "Forward Register",
    icon: <BsFillForwardFill />,
    url: dashboard.forwardRegister,
    role: ["user","superadmin","manager","admin"],
    children: [
      {
        id: 606,
        name: "index",
        icon: <CalendarIcon />,
        url: `${dashboard.forwardRegister}`,
        role: ["user","superadmin","manager","admin"],
      }
    ]
  },
  {
    id: 700,
    name: "Forward Cancellation",
    icon: <ImCancelCircle />,
    url: dashboard.forwardCancellation,
    role: ["user","superadmin","manager","admin"],
    children: [
      {
        id: 601,
        name: "index",
        icon: <CalendarIcon />,
        url: `${dashboard.forwardCancellation}`,
        role: ["user","superadmin","manager","admin"],
      }
    ]
  },
];

export const sidebarFooterData: SidebarItem[] = [
  {
    id: 34,
    name: "Settings",
    icon: <FaCog />,
    url: "/profile",
    role: ["user", "admin", "superadmin", "manager"],
  },
];

const getSidebarDataByRole = (role: string[] = ["user"]): SidebarItem[] => {
  const filterByRole = (items: SidebarItem[]): SidebarItem[] => {
    return items
      .filter((item) => !item.role || item.role.some((r) => role.includes(r)))
      .map((item) => ({
        ...item,
        children: item.children ? filterByRole(item.children) : undefined,
      }));
  };
  return filterByRole(sidebarDatas);
};

// Example usage
const userRole = ["user"]; // Example role
const sidebarData = getSidebarDataByRole(userRole);

export { getSidebarDataByRole, sidebarData };

