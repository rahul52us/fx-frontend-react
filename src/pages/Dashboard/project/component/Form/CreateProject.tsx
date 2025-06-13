import { observer } from "mobx-react-lite";
import ProjectForm from "./ProjectForm";
import { initialValuesOfProjects } from "../utils/constant";
import store from "../../../../../store/store";
import { getStatusType } from "../../../../../config/constant/statusCode";
import { readFileAsBase64 } from "../../../../../config/constant/function";

const CreateProject = observer(({userId} : any) => {
  const {
    Project: { createProject, setOpenProjectDrawer, getProjects, projects },
    auth: { openNotification },
  } = store;

  const handleSubmitForm = async({ values, setSubmitting, resetForm }: any) => {
    try {

      if (values.logo?.file && values.logo?.file?.length !== 0) {
        const buffer = await readFileAsBase64(values.logo?.file);
        const fileData = {
          buffer: buffer,
          filename: values.logo?.file?.name,
          type: values.logo?.file?.type,
        };
        values.logo = fileData;
      }

      let formData = {
        ...values
      };

      setSubmitting(true)
      createProject({...formData})
        .then((data) => {
          openNotification({
            title: "Successfully Created",
            message: `${data.message}`,
            type: "success",
          });
          getProjects({page : projects.currentPage, limit : projects.limit, userId})
          resetForm();
          setOpenProjectDrawer("create");
        })
        .catch((err) => {
          openNotification({
            title: "Create Failed",
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
    <ProjectForm
      initialValuesOfProjects={initialValuesOfProjects}
      handleSubmitForm={handleSubmitForm}
    />
  );
});

export default CreateProject;