import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import TripDetails from "../TripDetails/TripDetails";
import { useParams } from "react-router-dom";
import { formatCurrency } from "../../../../../../config/constant/function";
import { useEffect, useState } from "react";
import store from "../../../../../../store/store";
import PageLoader from "../../../../../../config/component/Loader/PageLoader";
import DashPageHeader from "../../../../../../config/component/common/DashPageHeader/DashPageHeader";
import { tripBreadCrumb } from "../../../../utils/breadcrumb.constant";

const IndividualTrip = observer(() => {
  const { tripId } = useParams();
  const {
    tripStore: { getSingleTrip, getIndividualTripAmount, getIndividualTrip },
    auth: { user, hasComponentAccess },
  } = store;

  const [tripData, setTripData] = useState<{ loading: boolean; data: any }>({
    loading: true,
    data: null,
  });
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const query: any = { tripId };
        if (!hasComponentAccess()) {
          query["userId"] = user._id;
        }

        await getIndividualTrip(query);

        const singleTripData = await getSingleTrip({ _id: tripId });

        singleTripData.attach_files = singleTripData.attach_files ? singleTripData?.attach_files?.map((it: any) => ({
          ...it,
          file: it.file ? [it.file] : undefined,
        })) : []

        setTripData({ data: singleTripData, loading: false });

        const tripAmountData = await getIndividualTripAmount({ tripId });
        if (tripAmountData.length > 0) {
          setHasPermission(true);
          setTripData((prev) => ({
            ...prev,
            data: {
              ...prev?.data,
              totalTripExpense: formatCurrency(tripAmountData[0].amount),
            },
          }));
        }
      } catch (err : any) {
        setTripData({ data: null, loading: false });
      }
    };

    fetchTripData();
  }, [tripId, getSingleTrip, getIndividualTrip, getIndividualTripAmount, hasComponentAccess, user._id]);

  return (
    <Box>
      <PageLoader loading={tripData.loading} noRecordFoundText={!tripData.data && !hasPermission} height="30vh">
        <DashPageHeader breadcrumb={tripBreadCrumb.individualTrip} />
        {tripData.data && (
          <TripDetails
            trip={tripData.data}
            setTripData={setTripData}
            userId={user._id}
          />
        )}
      </PageLoader>
    </Box>
  );
});

export default IndividualTrip;
