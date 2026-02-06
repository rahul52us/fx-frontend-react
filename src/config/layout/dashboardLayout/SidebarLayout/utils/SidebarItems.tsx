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
    role: ["user", "admin", "manager", "superadmin"],
  },

  // ───────────────────────────────────────────────
  // Export Register Section
  // ───────────────────────────────────────────────
  {
    id: 200,
    name: "Export Register",
    icon: <MdLocalShipping />,
    url: dashboard.exportRegister,
    role: ["user", "manager", "admin", "superadmin"],
    children: [
      {
        id: 201,
        name: "Index / List",
        icon: <CalendarIcon />,
        url: dashboard.exportRegister,
        role: ["user", "manager", "admin", "superadmin"],
      },
      // {
      //   id: 201,
      //   name: "Export Approval",
      //   icon: <CalendarIcon />,
      //   url: dashboard.exportApproval,
      //   role: ["user", "manager", "admin", "superadmin"],
      // },
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
    role: ["user", "manager", "admin", "superadmin"],
    children: [
      {
        id: 301,
        name: "Index / List",
        icon: <CalendarIcon />,
        url: dashboard.importRegister,
        role: ["user", "manager", "admin", "superadmin"],
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
    role: ["user", "manager", "admin", "superadmin"],
    children: [
      {
        id: 401,
        name: "Index / List",
        icon: <CalendarIcon />,
        url: dashboard.dailyExposureSheet,
        role: ["user", "manager", "admin", "superadmin"],
      },
      // {
      //   id: 402,
      //   name: "Exposure Input",
      //   icon: <CalendarIcon />,
      //   url: dashboard.dailyExposureSheet, // ← update if different route exists
      //   role: ["user", "manager", "admin", "superadmin"],
      // },
      // {
      //   id: 403,
      //   name: "Exposure Settlement",
      //   icon: <CalendarIcon />,
      //   url: dashboard.dailyExposureSheet,
      //   role: ["user", "manager", "admin", "superadmin"],
      // },
      // You can remove duplicates or update URLs later
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
    role: ["user", "manager", "admin", "superadmin"],
    children: [
      {
        id: 501,
        name: "Index / List",
        icon: <CalendarIcon />,
        url: dashboard.pcfc,
        role: ["user", "manager", "admin", "superadmin"],
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
    role: ["user", "manager", "admin", "superadmin"],
    children: [
      {
        id: 601,
        name: "Index / List",
        icon: <CalendarIcon />,
        url: dashboard.forwardRegister,
        role: ["user", "manager", "admin", "superadmin"],
      },
      // {
      //   id: 602,
      //   name: "Forward Booking",
      //   icon: <CalendarIcon />,
      //   url: dashboard.forwardRegister, // ← update if different route
      //   role: ["user", "manager", "admin", "superadmin"],
      // },
      // {
      //   id: 603,
      //   name: "Forward Cancellation",
      //   icon: <CalendarIcon />,
      //   url: dashboard.forwardRegister,
      //   role: ["user", "manager", "admin", "superadmin"],
      // },
      // {
      //   id: 604,
      //   name: "Unitization against exposure",
      //   icon: <CalendarIcon />,
      //   url: dashboard.forwardRegister,
      //   role: ["user", "manager", "admin", "superadmin"],
      // },
      // {
      //   id: 605,
      //   name: "Unitization against PCFC",
      //   icon: <CalendarIcon />,
      //   url: dashboard.forwardRegister,
      //   role: ["user", "manager", "admin", "superadmin"],
      // },
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
    role: ["user", "manager", "admin", "superadmin"],
    children: [
      {
        id: 701,
        name: "Index / List",
        icon: <CalendarIcon />,
        url: dashboard.forwardCancellation,
        role: ["user", "manager", "admin", "superadmin"],
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
    role: ["user", "manager", "admin", "superadmin"],
    children: [
      {
        id: 801,
        name: "Index / List",
        icon: <CalendarIcon />,
        url: dashboard.eefcRegister,
        role: ["user", "manager", "admin", "superadmin"],
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
    role: ["user", "manager", "admin", "superadmin"],
    children: [
      {
        id: 901,
        name: "Index / List",
        icon: <CalendarIcon />,
        url: dashboard.mtm,
        role: ["user", "manager", "admin", "superadmin"],
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
    role: ["user", "manager", "admin", "superadmin"],
    children: [
      {
        id: 1001,
        name: "Index / List",
        icon: <CalendarIcon />,
        url: dashboard.rp,
        role: ["user", "manager", "admin", "superadmin"],
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
    role: ["superadmin"],
    children: [
      {
        id: 1101,
        name: "Index / Overview",
        icon: <CalendarIcon />,
        url: dashboard.superAdminTab,
        role: ["superadmin"],
      },
    ],
  },
  {
    id: 1200,
    name: "Admin Panel",
    icon: <GrDocumentPerformance />,
    url: dashboard.adminTab,
    role: ["admin", "superadmin"],
    children: [
      {
        id: 1201,
        name: "Index / Overview",
        icon: <CalendarIcon />,
        url: dashboard.adminTab,
        role: ["admin", "superadmin"],
      },
      {
        id: 1201,
        name: "Approvals",
        icon: <CalendarIcon />,
        url: dashboard.approvals,
        role: ["admin", "superadmin"],
      },
    ],
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