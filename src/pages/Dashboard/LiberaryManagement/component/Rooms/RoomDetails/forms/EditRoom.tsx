import { observer } from "mobx-react-lite";
import BookForm from "./RoomForm";
import { useEffect, useState } from "react";
import { readFileAsBase64 } from "../../../../../../../config/constant/function";
import store from "../../../../../../../store/store";
import { getStatusType } from "../../../../../../../config/constant/statusCode";
import DrawerLoader from "../../../../../../../config/component/Loader/DrawerLoader";
import { generateBookInitialValues } from "../../../Books/utils/function";
import { generateSendRoomResponse } from "../utils/function";

const EditRoom = observer(({ close, data, fetchRecords }: any) => {
  const {
    auth: { openNotification },
    bookLiberary: { getSingleRoom, updateRoom },
  } = store;
  const [showError, setShowError] = useState(false);

  const [fetchData, setFetchData] = useState<any>({
    data: null,
    loading: true,
  });

  useEffect(() => {
    setFetchData({ loading: true, data: null });
    getSingleRoom({ id: data?._id })
      .then((data: any) => {
        setFetchData({
          loading: false,
          data: data.data,
        });
      })
      .catch(() => {
        setFetchData({ loading: false, data: null });
      });
  }, [getSingleRoom, data]);

  const room = fetchData.data;

  const handleSubmitForm = async ({
    values,
    setSubmitting,
    resetForm,
  }: any) => {
    try {
      let formData: any = {
        ...values,
      };

      if (
        formData?.coverImage?.file &&
        formData?.coverImage?.file?.length !== 0 &&
        formData?.coverImage?.isAdd
      ) {
        const buffer = await readFileAsBase64(formData?.coverImage?.file);
        const fileData = {
          buffer: buffer,
          filename: formData?.coverImage?.file?.name,
          type: formData?.coverImage?.file?.type,
          isDeleted: formData?.coverImage?.isDeleted || 0,
          isAdd: formData?.coverImage?.isAdd || 0,
        };
        formData.coverImage = fileData;
      } else {
        if (formData?.coverImage?.isDeleted) {
          const fileData = {
            isDeleted: formData?.coverImage?.isDeleted || 0,
            isAdd: formData?.coverImage?.isAdd || 0,
          };
          formData.coverImage = fileData;
        }
      }

      updateRoom(generateSendRoomResponse({ ...formData, _id: room?._id }))
        .then((data) => {
          openNotification({
            title: "Successfully Updated",
            message: `${data.message}`,
            type: "success",
          });
          if (fetchRecords) {
            fetchRecords();
          }
          close();
          resetForm();
        })
        .catch((err: any) => {
          openNotification({
            title: "Update Failed",
            message: err?.data?.message,
            type: getStatusType(err.status),
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
    } catch (err: any) {
      setSubmitting(false);
    }
  };

  return (
    <DrawerLoader
      loading={fetchData.loading}
      noRecordFoundText={!fetchData.data}
    >
      {room && (
        <BookForm
          initialValues={generateBookInitialValues(room)}
          showError={showError}
          setShowError={setShowError}
          close={close}
          handleSubmit={handleSubmitForm}
          isEdit={true}
        />
      )}
    </DrawerLoader>
  );
});

export default EditRoom;
