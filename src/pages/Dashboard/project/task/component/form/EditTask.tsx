import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import store from "../../../../../../store/store";
import { getStatusType } from "../../../../../../config/constant/statusCode";
import TaskForm from "./TaskForm";
import { generateInitialValues, generateSendTaskResponse } from "../utils/function";
import DrawerLoader from "../../../../../../config/component/Loader/DrawerLoader";

const EditTask = observer(({ task, fetchRecords,close }: any) => {
  const [showError, setShowError] = useState(false);
  const [fetchData, setFetchData] = useState({ loading: false, data: null });
  const {
    Project: { getSingleTask, updateTask, setOpenTaskDrawer },
    auth: { openNotification },
  } = store;


  useEffect(() => {
    setFetchData((prev) => ({ ...prev, loading: true, data: null }));
    getSingleTask({ id: task?._id })
      .then((data: any) => {
        setFetchData({
          loading: false,
          data: data.data,
        });
      })
      .catch((err: any) => {
        setFetchData({ loading: false, data: null });
        openNotification({
          title: "Failed to Fetch Record",
          message: err?.data?.message,
          type: getStatusType(err.status),
        });
      });
  }, [getSingleTask, openNotification, task]);

  const handleSubmit = async ({ values, setSubmitting, resetForm } : any) => {
    const response = await generateSendTaskResponse(values);
    setSubmitting(true)
    updateTask({ _id: task?._id, ...response })
        .then((data: any) => {
          openNotification({
            title: "Successfully Updated",
            message: `${data.message}`,
            type: "success",
          });
          if(fetchRecords){
            fetchRecords()
          }
          resetForm();
          setOpenTaskDrawer('create')
        })
        .catch((err) => {
          openNotification({
            title: "Update Failed",
            message: err?.data?.message,
            type: getStatusType(err.status),
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
  };

  return (
    <DrawerLoader
      loading={fetchData.loading}
      noRecordFoundText={fetchData.data === null ? true : false}
    >
      <TaskForm
        close={close}
        handleSubmitForm={handleSubmit}
        initialValues={generateInitialValues(fetchData.data)}
        showError={showError}
        setShowError={setShowError}
        type="edit"
      />
    </DrawerLoader>
  );
});

export default EditTask;
