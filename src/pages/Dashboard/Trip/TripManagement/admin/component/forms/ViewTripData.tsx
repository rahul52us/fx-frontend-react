import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import CustomDrawer from "../../../../../../../config/component/Drawer/CustomDrawer";
import DrawerLoader from "../../../../../../../config/component/Loader/DrawerLoader";
import { getStatusType } from "../../../../../../../config/constant/statusCode";
import store from "../../../../../../../store/store";
import TripDetails from "../../../component/TripDetails/TripDetails";
import { formatCurrency } from "../../../../../../../config/constant/function";

const ViewTripData = observer(({ item, open, onClose,userId }: any) => {
  const {
    tripStore: { getSingleTrip, getIndividualTripAmount },
    auth: { openNotification },
  } = store;
  const [tripData, setTripData] = useState<any>({ open: false, data: null });

  useEffect(() => {
    setTripData({ loading: true, data: null });
    getSingleTrip({ _id: item?._id })
      .then((data: any) => {
        data.attach_files = data.attach_files ? data?.attach_files?.map((it: any) => ({
          ...it,
          file: it.file ? [it.file] : undefined,
        })) : []
        setTripData({
          data:  data,
          loading: false,
        });
        getIndividualTripAmount({tripId : item._id}).then((dt : any) => {
          if(dt.length > 0)
          {
            setTripData((prev : any = {}) => ({...prev, data : {...prev?.data, totalTripExpense : formatCurrency(dt[0].amount)}}))
          }
        }).catch((err)=>{
          openNotification({
            title: "Failed to Trip Amount",
            message: err?.data?.message,
            type: getStatusType(err.status),
          });
        })
      })
      .catch((err) => {
        openNotification({
          title: "Failed to Get",
          message: err?.data?.message,
          type: getStatusType(err.status),
        });
        setTripData({ data: null, loading: false });
      })
      .finally(() => {});
  }, [getSingleTrip, item, openNotification, getIndividualTripAmount]);

  return (
    <CustomDrawer
      open={open}
      title={item?.title}
      close={onClose}
      width={"85vw"}
    >
      <DrawerLoader
        loading={tripData.loading}
        noRecordFoundText={!tripData.data}
      >
        {
            tripData?.data &&
            <Box>
              <TripDetails userId={userId} trip={tripData?.data} setTripData={setTripData}/>
            </Box>
        }

      </DrawerLoader>
    </CustomDrawer>
  );
});

export default ViewTripData;
