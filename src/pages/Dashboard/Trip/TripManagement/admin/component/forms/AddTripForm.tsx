import { observer } from "mobx-react-lite";
import TripForm from "./TripForm";
import CustomDrawer from "../../../../../../../config/component/Drawer/CustomDrawer";
import { useState } from "react";
import store from "../../../../../../../store/store";
import { initialValues } from "../../../utils/constant";
import {generateTripResponse} from '../../../utils/functions'
import { TripFormValues } from "../../../utils/interface";
import { getStatusType } from "../../../../../../../config/constant/statusCode";

const AddTripForm = observer(({ tripFormData, setTripFormData,handleGetRecord }: any) => {
  const {
    tripStore: { createTrip },
    auth: { openNotification },
  } = store;
  const [loading, setLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState(false);
  const [thumbnail, setThumbnail] = useState<any>([]);

  const submitForm = async (values: TripFormValues, resetForm: any) => {
    setLoading(true)
    values.thumbnail = thumbnail
    const payload = await generateTripResponse(values)
    createTrip(payload)
      .then(() => {
        openNotification({
          title: "Created Successfully",
          message: "Trip has been created successfully",
        });
        resetForm();
        setThumbnail([])
        setTripFormData({ open: false, type: "add" });
        handleGetRecord({page : 1})
      })
      .catch((err) => {
        openNotification({
          title: "Create Failed",
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
      title={`Create Trip`}
      open={tripFormData.open && tripFormData?.type === "add"}
      close={() => {
        setTripFormData({ open: false, data: null, type: "add" });
      }}
      props={{minWidth : '85vw'}}
    >
      <TripForm
        loading={loading}
        thumbnail={thumbnail}
        setThumbnail={setThumbnail}
        initialValues={initialValues}
        onSubmit={submitForm}
        showError={showError}
        setShowError={setShowError}
        onClose={() =>
          setTripFormData({ open: false, data: null, type: "add" })
        }
      />
    </CustomDrawer>
  );
});

export default AddTripForm;
