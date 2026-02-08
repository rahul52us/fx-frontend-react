import { CalendarIcon } from "@chakra-ui/icons";
import { BsFillForwardFill } from "react-icons/bs";
import { CgArrowsExchange } from "react-icons/cg";
import {
  FaCalendarAlt,
  FaShip,
} from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { GrDocumentPerformance } from "react-icons/gr";
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
    id: 101,
    name: "Dashboard",
    icon: <IoPieChartSharp />,
    url: "/dashboard",
    role: ["user", "admin", "manager"],
  },

  // ───────────────────────────────────────────────
  // Export Register Section
  // ───────────────────────────────────────────────
  {
    id: 200,
    name: "Export Register",
    icon: <MdLocalShipping />,
    url: dashboard.exportRegister,
    role: ["user", "manager", "admin"],
    children: [
      {
        id: 201,
        name: "Index / List",
        icon: <CalendarIcon />,
        url: dashboard.exportRegister,
        role: ["user", "manager", "admin"],
      }
    ],
  },

  // ───────────────────────────────────────────────
  // Import Register Section
  // ───────────────────────────────────────────────
  {
    id: 300,
    name: "Import Register",
    icon: <FaShip />,
    url: dashboard.importRegister,
    role: ["user", "manager", "admin"],
    children: [
      {
        id: 301,
        name: "Index / List",
        icon: <CalendarIcon />,
        url: dashboard.importRegister,
        role: ["user", "manager", "admin"],
      },
    ],
  },

  // ───────────────────────────────────────────────
  // Exposure Settlement Section
  // ───────────────────────────────────────────────
  {
    id: 400,
    name: "Exposure Settlement",
    icon: <FaCalendarAlt />,
    url: dashboard.dailyExposureSheet,
    role: ["user", "manager"],
    children: [
      {
        id: 401,
        name: "Index / List",
        icon: <CalendarIcon />,
        url: dashboard.dailyExposureSheet,
        role: ["user", "manager"],
      }
    ],
  },

  // ───────────────────────────────────────────────
  // PCFC Section
  // ───────────────────────────────────────────────
  {
    id: 500,
    name: "PCFC",
    icon: <IoDocumentText />,
    url: dashboard.pcfc,
    role: ["user", "manager", "admin"],
    children: [
      {
        id: 501,
        name: "Index / List",
        icon: <CalendarIcon />,
        url: dashboard.pcfc,
        role: ["user", "manager", "admin"],
      },
      // Add more sub-items when ready (they were commented out)
    ],
  },

  // ───────────────────────────────────────────────
  // Forward Register Section
  // ───────────────────────────────────────────────
  {
    id: 600,
    name: "Forward Register",
    icon: <BsFillForwardFill />,
    url: dashboard.forwardRegister,
    role: ["user", "manager", "admin"],
    children: [
      {
        id: 601,
        name: "Index / List",
        icon: <CalendarIcon />,
        url: dashboard.forwardRegister,
        role: ["user", "manager", "admin"],
      }
    ],
  },

  // ───────────────────────────────────────────────
  // Forward Cancellation (Top Level)
  // ───────────────────────────────────────────────
  {
    id: 700,
    name: "Forward Cancellation",
    icon: <ImCancelCircle />,
    url: dashboard.forwardCancellation,
    role: ["user", "manager", "admin"],
    children: [
      {
        id: 701,
        name: "Index / List",
        icon: <CalendarIcon />,
        url: dashboard.forwardCancellation,
        role: ["user", "manager", "admin"],
      },
    ],
  },

  // ───────────────────────────────────────────────
  // EEFC Register
  // ───────────────────────────────────────────────
  {
    id: 800,
    name: "EEFC Register",
    icon: <CgArrowsExchange />,
    url: dashboard.eefcRegister,
    role: ["user", "manager", "admin"],
    children: [
      {
        id: 801,
        name: "Index / List",
        icon: <CalendarIcon />,
        url: dashboard.eefcRegister,
        role: ["user", "manager", "admin"],
      },
    ],
  },

  // ───────────────────────────────────────────────
  // MTM / Mark to Market
  // ───────────────────────────────────────────────
  {
    id: 900,
    name: "MTM",
    icon: <GiCheckMark />,
    url: dashboard.mtm,
    role: ["user", "manager", "admin"],
    children: [
      {
        id: 901,
        name: "Index / List",
        icon: <CalendarIcon />,
        url: dashboard.mtm,
        role: ["user", "manager", "admin"],
      },
    ],
  },

  // ───────────────────────────────────────────────
  // RP (Risk Position?)
  // ───────────────────────────────────────────────
  {
    id: 1000,
    name: "RP",
    icon: <GrDocumentPerformance />,
    url: dashboard.rp,
    role: ["user", "manager"],
    children: [
      {
        id: 1001,
        name: "Index / List",
        icon: <CalendarIcon />,
        url: dashboard.rp,
        role: ["user"],
      },
    ],
  },

  // ───────────────────────────────────────────────
  // Super Admin & Admin sections (role restricted)
  // ───────────────────────────────────────────────
  {
    id: 1100,
    name: "Super Admin",
    icon: <GrDocumentPerformance />,
    url: dashboard.superAdminTab,
    role: ["superadmin"]
  },
  {
    id: 1201,
    name: "Approvals",
    icon: <CalendarIcon />,
    url: dashboard.approvals,
    role: ["admin"],
  },
  {
    id: 1202,
    name: "Index / Overview",
    icon: <CalendarIcon />,
    url: dashboard.adminTab,
    role: ["admin"],
  },
];

export const sidebarFooterData: SidebarItem[] = [
  // You can add footer items here later if needed
  // Example:
  // {
  //   id: 9999,
  //   name: "Settings",
  //   icon: <FaCog />,
  //   url: "/settings",
  //   role: ["user", "admin", "manager", "superadmin"],
  // },
];

const getSidebarDataByRole = (roles: string[] = ["admin"]): SidebarItem[] => {
  const filterByRole = (items: SidebarItem[]): SidebarItem[] => {
    return items
      .filter((item) => !item.role || item.role.some((r) => roles.includes(r)))
      .map((item) => ({
        ...item,
        children: item.children ? filterByRole(item.children) : undefined,
      }));
  };

  return filterByRole(sidebarDatas);
};

export { getSidebarDataByRole, sidebarDatas };