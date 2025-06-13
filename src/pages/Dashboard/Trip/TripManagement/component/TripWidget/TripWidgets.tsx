import { SimpleGrid } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import SummaryWidget from "../../../../../../config/component/WigdetCard/SummaryWidget";
import store from "../../../../../../store/store";
import { FaUser, FaUsers } from "react-icons/fa";
import { useCallback, useEffect } from "react";
import { MdOutlineTravelExplore } from "react-icons/md";
import { formatCurrency } from "../../../../../../config/constant/function";

const TripWidgets = observer(({userId} : any) => {
  const {
    auth: { openNotification },
    tripStore: {
      getTripCounts,
      tripCount,
      getUserTripTypeCounts,
      userTripTypeCount,
      getTotalTripAmount,
      totalTripAmount,
    },
  } = store;

  const fetchData = useCallback((getDataFn: any) =>
    new Promise((resolve, reject) => {
      getDataFn({userId : userId}).then(resolve).catch(reject);
    }),[userId]);

  useEffect(() => {
    Promise.all([
      fetchData(getTripCounts),
      fetchData(getUserTripTypeCounts),
      fetchData(getTotalTripAmount),
    ])
      .then(() => {})
      .catch((error: any) => {
        openNotification({
          type: "error",
          message: error?.message || "Something went wrong",
          title: "Failed to get data",
        });
      });
  }, [fetchData, getTripCounts, getUserTripTypeCounts, getTotalTripAmount, openNotification]);

  const summaryData = [
    {
      label: "Total Recorded Trips",
      value: tripCount.data,
      icon: MdOutlineTravelExplore,
      colorScheme: "teal",
      description: "The total number of trips logged in the system.",
      loading: tripCount.loading,
    },
    {
      label: "Individual Trip Count",
      value: userTripTypeCount?.data?.individual || 0,
      icon: FaUser,
      colorScheme: "blue",
      description: "The total count of trips taken by individual travelers.",
      loading: userTripTypeCount.loading,
    },
    {
      label: "Group Trip Count",
      value: userTripTypeCount?.data?.group || 0,
      icon: FaUsers,
      colorScheme: "purple",
      description: "The total count of trips taken by groups of travelers.",
      loading: userTripTypeCount.loading,
    },
    {
      label: "Total Trip Expense",
      value: formatCurrency(totalTripAmount?.data),
      icon: FaUsers,
      colorScheme: "purple",
      description: "The overall expenses incurred across all trips.",
      loading: totalTripAmount.loading,
    },
  ];


  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
      {summaryData.map((data, index) => (
        <SummaryWidget
          key={index}
          label={data.label}
          value={data.value}
          icon={data.icon}
          colorScheme={data.colorScheme}
          description={data.description}
          loading={data.loading}
        />
      ))}
    </SimpleGrid>
  );
});

export default TripWidgets;
