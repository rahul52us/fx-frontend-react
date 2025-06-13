import {
  FaChartPie,
  FaCog,
} from "react-icons/fa";
import { CalendarIcon } from "@chakra-ui/icons";
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
  //  Blogs
  {
    id: 501,
    name: "Pcfc",
    icon: <FaChartPie />,
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
    id: 505,
    name: "exportRegister",
    icon: <FaChartPie />,
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
    name: "importRegister",
    icon: <FaChartPie />,
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
    id: 605,
    name: "forwardRegister",
    icon: <FaChartPie />,
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
    name: "forward Cancellation",
    icon: <FaChartPie />,
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

export { sidebarData, getSidebarDataByRole };