import { observer } from "mobx-react-lite";
import RoomForm from "./RoomForm";
import { useState } from "react";
import { readFileAsBase64 } from "../../../../../../../config/constant/function";
import store from "../../../../../../../store/store";
import { getStatusType } from "../../../../../../../config/constant/statusCode";
import { generateRoomInitialValues, generateSendRoomResponse } from "../utils/function";

const AddRoom = observer(({close, fetchRecords} :any) => {
  const {auth : {openNotification}, bookLiberary : {createRoom}} = store
  const [showError, setShowError] = useState(false);

  const handleSubmitForm = async({ values, setSubmitting, resetForm }: any) => {
    try {

      let formData = {
        ...values
      };

      if (values.coverImage?.file && values.coverImage?.file?.length !== 0) {
        const buffer = await readFileAsBase64(values.coverImage?.file);
        const fileData = {
          buffer: buffer,
          filename: values.coverImage?.file?.name,
          type: values.coverImage?.file?.type,
          isAdd : values.coverImage?.isAdd || 1
        };
        formData.coverImage = fileData;
      }

      createRoom(generateSendRoomResponse({...formData}))
        .then((data) => {
          openNotification({
            title: "Successfully Created",
            message: `${data.message}`,
            type: "success",
          });
          if(fetchRecords){
            fetchRecords()
          }
          close()
          resetForm();
        })
        .catch((err : any) => {
          openNotification({
            title: "Create Failed",
            message: err?.data?.message,
            type: getStatusType(err.status),
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
    } catch (err: any) {
      setSubmitting(false)
      console.log(err)
    }
  };

  return (
    <RoomForm
      initialValues={generateRoomInitialValues({})}
      showError={showError}
      setShowError={setShowError}
      close={close}
      handleSubmit={handleSubmitForm}
    />
  );
});

export default AddRoom;
