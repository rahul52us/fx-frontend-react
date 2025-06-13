import { observer } from "mobx-react-lite";
import TripForm from "./TripForm";
import CustomDrawer from "../../../../../../../config/component/Drawer/CustomDrawer";
import { useEffect, useState } from "react";
import store from "../../../../../../../store/store";
import { TripFormValues } from "../../../utils/interface";
import {
  generateEditInitialValues,
  generateTripResponse,
} from "../../../utils/functions";
import { getStatusType } from "../../../../../../../config/constant/statusCode";
import DrawerLoader from "../../../../../../../config/component/Loader/DrawerLoader";

const EditTripForm = observer(
  ({ tripFormData, setTripFormData, handleGetRecord }: any) => {
    const {
      tripStore: { updateTrip, getSingleTrip },
      auth: { openNotification },
    } = store;
    const [tripData, setTripData] = useState<any>({
      loading: true,
      data: {},
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [showError, setShowError] = useState(false);
    const [thumbnail, setThumbnail] = useState<any>([]);
    const [isFileDeleted, setIsFileDeleted] = useState(0);

    useEffect(() => {
      setTripData({ loading: true, data: {} });
      getSingleTrip({ _id: tripFormData?.data?._id })
        .then((data: any) => {
          let thumbnail: any = [];
          if (data?.thumbnail?.name && data?.thumbnail?.url) {
            thumbnail = [
              {
                ...data?.thumbnail,
                file: data?.thumbnail?.url,
              },
            ];
            setThumbnail(thumbnail);
          }
          setTripData({
            data: { ...generateEditInitialValues(data), thumbnail },
            loading: false,
          });
        })
        .catch((err) => {
          openNotification({
            title: "Failed to Get",
            message: err?.data?.message,
            type: getStatusType(err.status),
          });
          setTripData({ data: {}, loading: false });
        })
        .finally(() => {});
    }, [getSingleTrip, tripFormData, openNotification]);

    const submitForm = async (values: TripFormValues, resetForm: any) => {
      setLoading(true);
      if (isFileDeleted === 1 && thumbnail?.length) {
        values.thumbnail = thumbnail;
      } else {
        if (thumbnail?.length) {
          if (thumbnail[0]?.url) {
            delete values["thumbnail"];
          } else {
            values.thumbnail = thumbnail;
          }
        }
      }
      if (isFileDeleted === 1 && thumbnail?.length === 0) {
        delete values["thumbnail"];
      }

      const payload = await generateTripResponse(values);
      updateTrip(
        { ...payload, isFileDeleted: isFileDeleted },
        tripFormData?.data?._id
      )
        .then(() => {
          openNotification({
            title: "Trip Updated Successfully",
            message: "Trip has been Updated successfully",
          });
          resetForm();
          setThumbnail([]);
          setIsFileDeleted(0);
          setTripFormData({ open: false, type: "add" });
          handleGetRecord({});
        })
        .catch((err) => {
          openNotification({
            title: "Update Failed",
            message: err?.data?.message,
            type: getStatusType(err.status),
          });
        })
        .finally(() => {
          setLoading(false);
        });
    };

    return (
      <CustomDrawer
        title={`Edit Trip`}
        open={tripFormData.open && tripFormData.type === "edit"}
        close={() => {
          setTripFormData({ open: false, data: null, type: "add" });
          setThumbnail([]);
          setIsFileDeleted(0);
        }}
        props={{ minWidth: "85vw" }}
      >
        <DrawerLoader
          loading={tripData.loading}
          noRecordFoundText={Object.keys(tripData.data).length ? false : true}
        >
          <TripForm
            isEdit={true}
            loading={loading}
            thumbnail={thumbnail}
            setThumbnail={setThumbnail}
            initialValues={tripData.data}
            onSubmit={submitForm}
            showError={showError}
            setShowError={setShowError}
            isFileDeleted={isFileDeleted}
            setIsFileDeleted={setIsFileDeleted}
            onClose={() => {
              setTripFormData({ open: false, data: null, type: "add" });
              setIsFileDeleted(0);
              setThumbnail([]);
            }}
          />
        </DrawerLoader>
      </CustomDrawer>
    );
  }
);

export default EditTripForm;
