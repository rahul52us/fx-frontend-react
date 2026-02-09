import { Grid, GridItem } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import {
  HiOutlineCurrencyDollar,
  HiOutlineSwitchHorizontal,
  HiOutlineTrendingUp,
} from "react-icons/hi";
import {
  MdAppRegistration,
  MdCancelPresentation,
  MdInput,
  MdOutput,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import NewWidgetCard from "../../../config/component/WigdetCard/NewWidgetCard";
import { dashboard } from "../../../config/constant/routes";
import store from "../../../store/store";

interface DashboardCountData {
  eefc: { total: number;[key: string]: any };
  export: { total: number;[key: string]: any };
  import: { total: number;[key: string]: any };
  exposure: { total: number;[key: string]: any };
  forwardCancellation: { total: number;[key: string]: any };
  forwardRegister: { total: number;[key: string]: any };
  pcfc: { total: number;[key: string]: any };
}

const DashWidgetCard = observer(() => {
  const navigate = useNavigate();
  const {
    auth: { getDashboardCountsss, user },
  } = store;

  const [data, setData] = useState<DashboardCountData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response: any = await getDashboardCountsss({ userId: user?.userId });
        if (response?.status === "success") {
          setData(response.data);
        }
      } catch (error: any) {
        console.error("Failed to fetch dashboard counts", error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.userId) {
      fetchData();
    }
  }, [getDashboardCountsss, user?.userId]);

  // Widget Configuration
  const widgetConfig = [
    {
      key: "eefc",
      title: "EEFC",
      icon: HiOutlineCurrencyDollar,
      bg: "#E3F2FD", // Light Blue
      link: dashboard.eefcRegister,
    },
    {
      key: "export",
      title: "Export",
      icon: MdOutput,
      bg: "#E8F5E9", // Light Green
      link: dashboard.exportRegister,
    },
    {
      key: "import",
      title: "Import",
      icon: MdInput,
      bg: "#FFF3E0", // Light Orange
      link: dashboard.importRegister,
    },
    {
      key: "exposure",
      title: "Exposure",
      icon: HiOutlineTrendingUp,
      bg: "#F3E5F5", // Light Purple
      link: dashboard.dailyExposureSheet,
    },
    {
      key: "forwardRegister",
      title: "Forward Register",
      icon: MdAppRegistration,
      bg: "#E0F2F1", // Light Teal
      link: dashboard.forwardRegister,
    },
    {
      key: "forwardCancellation",
      title: "Forward Cancellation",
      icon: MdCancelPresentation,
      bg: "#FFEBEE", // Light Red
      link: dashboard.forwardCancellation,
    },
    {
      key: "pcfc",
      title: "PCFC",
      icon: HiOutlineSwitchHorizontal,
      bg: "#FFF8E1", // Light Amber
      link: dashboard.pcfc, // Verify if this matches route
    },
  ];

  return (
    <Grid
      templateColumns={{
        base: "repeat(1, 1fr)",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(4, 1fr)",
        xl: "repeat(5, 1fr)",
      }}
      gap={6}
    >
      {widgetConfig.map((widget) => {
        const widgetData = data?.[widget.key as keyof DashboardCountData];

        return (
          <GridItem key={widget.key}>
            <NewWidgetCard
              totalCount={widgetData?.total || 0}
              title={widget.title}
              loading={loading}
              icon={widget.icon}
              bg={widget.bg}
              handleClick={() => (widget.link ? navigate(widget.link) : {})}
              pending={widgetData?.pending || 0}
              approved={widgetData?.approved || 0}
              rejected={widgetData?.rejected || 0}
            />
          </GridItem>
        );
      })}
    </Grid>
  );
});

export default DashWidgetCard;
