import { observer } from "mobx-react-lite";
import ProjectForm from "./ProjectForm";
import { useEffect, useState } from "react";
import store from "../../../../../store/store";
import { generateProjectInitialValues } from "../utils/function";
import Loader from "../../../../../config/component/Loader/Loader";
import { getStatusType } from "../../../../../config/constant/statusCode";
import { readFileAsBase64 } from "../../../../../config/constant/function";

const EditProject = observer(({userId} : any) => {
  const {
    Project: {
      getSingleProject,
      openProjectDrawer,
      setOpenProjectDrawer,
      updateProject,
      getProjects,
      projects
    },
    auth: { openNotification },
  } = store;
  const [fetchProjectData, setFetchProjectData] = useState<any>({
    data: null,
    loading: true,
  });

  useEffect(() => {
    setFetchProjectData({ loading: true, data: null });
    getSingleProject({ id: openProjectDrawer?.data?._id })
      .then((data: any) => {
        setFetchProjectData({
          loading: false,
          data: generateProjectInitialValues(data.data),
        });
      })
      .catch(() => {
        setFetchProjectData({ loading: false, data: null });
      });
  }, [getSingleProject, openProjectDrawer]);

  const handleSubmitForm = async ({
    values,
    setSubmitting,
    resetForm,
  }: any) => {

    try {
      if (
        values.logo?.file &&
        values.logo?.file?.length !== 0 &&
        values?.logo?.isAdd
      ) {
        const buffer = await readFileAsBase64(values.logo?.file);
        const fileData = {
          buffer: buffer,
          filename: values.logo?.file?.name,
          type: values.logo?.file?.type,
          isDeleted: values?.logo?.isDeleted || 0,
          isAdd: values?.logo?.isAdd || 0,
        };
        values.logo = fileData;
      } else {
        if (values?.logo?.isDeleted) {
          const fileData = {
            isDeleted: values?.logo?.isDeleted || 0,
            isAdd: values?.logo?.isAdd || 0,
          };
          values.logo = fileData;
        }
      }
      setSubmitting(true)
      updateProject({ _id: fetchProjectData?.data?._id, ...values })
        .then((data: any) => {
          openNotification({
            title: "Successfully Updated",
            message: `${data.message}`,
            type: "success",
          });
          getProjects({page : projects.currentPage, limit : projects.limit, userId})
          resetForm();
          setOpenProjectDrawer("create");
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
    } catch (err: any) {}
  };

  return (
    <div>
      {fetchProjectData.loading === false ? (
        fetchProjectData.data && (
          <ProjectForm
            initialValuesOfProjects={fetchProjectData.data}
            handleSubmitForm={handleSubmitForm}
            isEdit={true}
          />
        )
      ) : (
        <Loader height="75vh" />
      )}
    </div>
  );
});

export default EditProject;