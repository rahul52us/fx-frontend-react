import { observer } from "mobx-react-lite";
import TaskForm from "./TaskForm";
import { useState } from "react";
import { initialValuesOfTask } from "../utils/constant";
import { generateSendTaskResponse } from "../utils/function";
import store from "../../../../../../store/store";
import { getStatusType } from "../../../../../../config/constant/statusCode";

const AddTask = observer(({projectId, fetchRecords, close} : any) => {
  const {Project : {createTask, setOpenTaskDrawer}, auth : {openNotification}} = store
  const [showError, setShowError] = useState(false);

  const handleSubmit = async ({ values, setSubmitting, resetForm } : any) => {
    const response = await generateSendTaskResponse(values);
    setSubmitting(true)
    createTask({...response,projectId}).then((data : any) => {
      openNotification({
        title: "Successfully Created",
        message: `${data.message}`,
        type: "success",
      });
      if(fetchRecords){
        fetchRecords()
      }
      setShowError(false);
      resetForm()
      setOpenTaskDrawer('create')
    }).catch((err) => {
      openNotification({
        title: "Create Failed",
        message: err?.data?.message,
        type: getStatusType(err.status),
      });
    }).finally(() => {
      setSubmitting(false);
    })
  };


  return (
    <TaskForm
      close={close}
      handleSubmitForm={handleSubmit}
      initialValues={initialValuesOfTask}
      showError={showError}
      setShowError={setShowError}
    />
  );
});

export default AddTask;