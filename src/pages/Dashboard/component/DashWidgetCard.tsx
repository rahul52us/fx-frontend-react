import { Grid, GridItem } from "@chakra-ui/react";
import axios from "axios";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";
import { HiMiniBuildingOffice2, HiMiniUsers } from "react-icons/hi2";
import { MdOutlineQuiz, MdOutlineTravelExplore } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import NewWidgetCard from "../../../config/component/WigdetCard/NewWidgetCard";
import { dashboard } from "../../../config/constant/routes";

const DashWidgetCard = observer(() => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>({}); 

  const fetchExportRegisterData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://srv864630.hstgr.cloud:8000/dashboard/dashboardCount/",
        { condition: "" }
      );
      const result = response.data?.data || [];
      // const withSerial = result.map((item: any, idx: number) => ({
      //   ...item,
      //   sno: idx + 1,
      // }));
      setDashboardData(result);
    } catch (error) {
      console.error("Error fetching export register data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchExportRegisterData();
  },[])

console.log('dashboardData',dashboardData)
  return (
 <Grid
  templateColumns={{
    base: "repeat(1, 1fr)",
    sm: "repeat(2, 1fr)",
    md: "repeat(4, 1fr)",
    lg: "repeat(5, 1fr)",
  }}
  gap={6}
>
  {[
    {
      count: dashboardData?.exportRegister,
      title: "Export",
      link: dashboard.exportRegister,
      icon: HiMiniUsers,
    },
    {
      count: dashboardData?.importRegister,
      title: "Import",
      link: dashboard.importRegister,
      icon: HiMiniBuildingOffice2,
    },
    {
      count: dashboardData?.forwordRegister,
      title: "Forward",
      link: dashboard.forwardRegister,
      icon: MdOutlineTravelExplore,
    },
    {
      count: dashboardData?.pcfcRegister,
      title: "PCFC",
      link: dashboard.pcfc,
      icon: FaCode,
    },
    {
      count: dashboardData?.dailyExposureData,
      title: "Daily Exposure",
      link: dashboard.dailyExposureSheet,
      icon: MdOutlineQuiz,
    },
  ].map((item, key) => (
    <GridItem key={key}>
      <NewWidgetCard
        totalCount={item.count}
        handleClick={() => navigate(item.link)}
        title={item.title}
        loading={loading}
        icon={item.icon}
      />
    </GridItem>
  ))}
</Grid>

  );
});

export default DashWidgetCard;
