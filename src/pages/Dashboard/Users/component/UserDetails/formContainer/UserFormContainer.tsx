import { Box, Center } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import DashPageHeader from "../../../../../../config/component/common/DashPageHeader/DashPageHeader";
import { UsersBreadCrumb } from "../../../../utils/breadcrumb.constant";
import UserContainer from "./UserContainer";
import {
  getUserInitialValues,
  generateSubmitResponse,
} from "../utils/constant";
import { getUserValidation } from "../utils/validations";
import store from "../../../../../../store/store";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { dashboard } from "../../../../../../config/constant/routes";
import Loader from "../../../../../../config/component/Loader/Loader";
import { readFileAsBase64 } from "../../../../../../config/constant/function";
import { getStatusType } from "../../../../../../config/constant/statusCode";

const UserFormContainer = observer(() => {
  const [haveApiCall, setHaveApiCall] = useState(false);
  const [files, setFiles] = useState<any>({
    cancelledCheque: {
      file: null,
      isDeleted: 0,
      isAdd: 0,
    },
  });

  const location = useLocation();
  const tab: any = new URLSearchParams(location.search).get("tab");
  const navigate = useNavigate();
  const {
    User: {
      createUser,
      updateUserProfile,
      getUsersDetailsById,
      updateUserBankDetails,
      updateFamilyDetails,
      updateWorkExperience,
      updateDocuments,
      updateCompanyDetails,
      updatePermissions,
      updateQualifications
    },
    auth: { openNotification },
  } = store;
  const [userData, setUserData] = useState<any>(null);
  const [userId, setUserId] = useState<any>(null);
  const { id } = useParams();
  const [type, setType] = useState<any>(
    location.pathname?.split("/")[4] === "edit" && id
  );

  useEffect(() => {
    setType(location.pathname?.split("/")[4] === "edit" && id);
  }, [location.pathname, id, setType]);

  useEffect(() => {
    if (id) {
      setUserId(id);
    }
  }, [id]);

  const navigateUser = (id: any) => {
    navigate(`${dashboard.Users.details}/edit/${id}?tab=company-details`);
  };
  const handleSubmitProfile = async ({
    values,
    setSubmitting,
    setErrors,
    setShowError,
  }: any) => {
    if (type) {
      if (tab === "profile-details") {
        let updatedValues = { ...values };
        if (
          updatedValues.pic?.file &&
          updatedValues.pic?.file?.length !== 0 &&
          updatedValues?.pic?.isAdd
        ) {
          const buffer = await readFileAsBase64(updatedValues.pic?.file);
          const fileData = {
            buffer: buffer,
            filename: updatedValues.pic?.file?.name,
            type: updatedValues.pic?.file?.type,
            isDeleted: updatedValues?.pic?.isDeleted || 0,
            isAdd: updatedValues?.pic?.isAdd || 0,
          };
          updatedValues.pic = fileData;
        } else if (updatedValues?.pic?.isDeleted) {
          const fileData = {
            isDeleted: updatedValues?.pic?.isDeleted || 0,
            isAdd: updatedValues?.pic?.isAdd || 0,
          };
          updatedValues.pic = fileData;
        }

        const finalData = await generateSubmitResponse(updatedValues);
        updateUserProfile(userId, {
          ...finalData
        })
          .then(() => {
            setShowError(false);
            setErrors({});
            openNotification({
              type: "success",
              message: "Update Profile Successfully",
              title: "Updated Successfully",
            });
            setHaveApiCall(false);
          })
          .catch((err) => {
            openNotification({
              type: "error",
              message: err?.message,
              title: "Failed to Create",
            });
          })
          .finally(() => {
            setSubmitting(false);
          });
      } else if (tab === "company-details") {
        let data: any = {};
        data["workTiming"] = values.workTiming.map((item: any) => item.value);
        data["workingLocation"] = values.workingLocation.map(
          (item: any) => item.value
        );
        data["managers"] = values.managers.map((item: any) => item.value);
        data["eType"] = values.eType?.value;
        data["department"] = values.department?.value;
        data["designation"] = values.designation?.value;
        updateCompanyDetails(userId, { details: { ...values, ...data } })
          .then(() => {
            setShowError(false);
            setErrors({});
            openNotification({
              type: "success",
              message: "Update Company Details Successfully",
              title: "Updated Successfully",
            });
            setHaveApiCall(false);
          })
          .catch((err) => {
            openNotification({
              type: "error",
              message: err?.message,
              title: "Failed to Update",
            });
          })
          .finally(() => {
            setSubmitting(false);
          });
      } else if (tab === "bank-details") {
        let bankDetails: any = { ...values };
        if (
          bankDetails.cancelledCheque?.file &&
          bankDetails.cancelledCheque?.file?.length !== 0 &&
          bankDetails?.cancelledCheque?.isAdd
        ) {
          const buffer = await readFileAsBase64(
            bankDetails.cancelledCheque?.file
          );
          const fileData = {
            buffer: buffer,
            filename: bankDetails.cancelledCheque?.file?.name,
            type: bankDetails.cancelledCheque?.file?.type,
            isDeleted: bankDetails?.cancelledCheque?.isDeleted || 0,
            isAdd: bankDetails?.cancelledCheque?.isAdd || 0,
          };
          bankDetails.cancelledCheque = fileData;
        } else {
          if (bankDetails?.cancelledCheque?.isDeleted) {
            const fileData = {
              isDeleted: bankDetails?.cancelledCheque?.isDeleted || 0,
              isAdd: bankDetails?.cancelledCheque?.isAdd || 0,
            };
            bankDetails.cancelledCheque = fileData;
          }
        }
        updateUserBankDetails(userId, bankDetails)
          .then(() => {
            setShowError(false);
            setErrors({});
            openNotification({
              type: "success",
              message: "Update Bank Successfully",
              title: "Updated Successfully",
            });
            setHaveApiCall(false);
          })
          .catch((err) => {
            openNotification({
              type: "error",
              message: err?.message,
              title: "Failed to Update",
            });
          })
          .finally(() => {
            setSubmitting(false);
          });
      } else if (tab === "family-details") {
        updateFamilyDetails(userId, values)
          .then(() => {
            setShowError(false);
            setErrors({});
            openNotification({
              type: "success",
              message: "Update Family Successfully",
              title: "Updated Successfully",
            });
            setHaveApiCall(false);
          })
          .catch((err) => {
            openNotification({
              type: "error",
              message: err?.message,
              title: "Failed to Update Family Details",
            });
          })
          .finally(() => {
            setSubmitting(false);
          });
      } else if (tab === "work-experience") {
        let dt = await Promise.all(
          values.experienceDetails.map(async (item: any) => {
            if (item?.certificate?.isAdd && item?.certificate?.file) {
              const buffer = await readFileAsBase64(item?.certificate?.file[0]);
              const fileData = {
                buffer: buffer,
                filename: item.certificate.file[0].name,
                type: item.certificate.file[0].type,
                isFileDeleted: item.certificate.isDeleted,
                isAdd: item.certificate.isAdd,
              };
              return {
                ...item,
                certificate: fileData,
              };
            } else if (item.certificate?.isDeleted) {
              const fileData = {
                isFileDeleted: item.certificate.isDeleted,
              };
              return {
                ...item,
                certificate: fileData,
              };
            } else {
              if (
                item?.certificate &&
                Array.isArray(item?.certificate?.file) &&
                item?.certificate?.file?.length > 0
              ) {
                return { ...item, certificate: item?.certificate?.file[0] };
              } else {
                return item;
              }
            }
          })
        );
        updateWorkExperience(userId, { experienceDetails: dt })
          .then(() => {
            setShowError(false);
            setErrors({});
            openNotification({
              type: "success",
              message: "Update Work Experience Successfully",
              title: "Updated Successfully",
            });
            setHaveApiCall(false);
          })
          .catch((err) => {
            openNotification({
              type: "error",
              message: err?.message,
              title: "Failed to Update Work Experience",
            });
          })
          .finally(() => {
            setSubmitting(false);
          });
      }
      else if (tab === "documents") {
        let dt = await Promise.all(
          values.documents.map(async (item: any) => {
            if (item?.isAdd && item?.file) {
              const buffer = await readFileAsBase64(item?.file[0]);
              const fileData = {
                buffer: buffer,
                filename: item.file[0].name,
                type: item.file[0].type,
              };
              return { title: item.title, file: fileData, isAdd: item.isAdd };
            } else {
              if (item.file && Array.isArray(item.file)) {
                if (item.file?.length) {
                  item.file = item.file[0];
                }
              }
              return { ...item };
            }
          })
        );
        updateDocuments(userId, { ...values, documents: dt })
          .then(() => {
            setShowError(false);
            setErrors({});
            openNotification({
              type: "success",
              message: "Update Documents Successfully",
              title: "Updated Successfully",
            });
            setHaveApiCall(false);
          })
          .catch((err) => {
            openNotification({
              type: "error",
              message: err?.message,
              title: "Failed to Update Documents",
            });
          })
          .finally(() => {
            setSubmitting(false);
          });
      }
      else if (tab === "qualifications") {
        let dt = await Promise.all(
          values.qualifications.map(async (item: any) => {
            if (item?.isAdd && item?.file) {
              const buffer = await readFileAsBase64(item?.file[0]);
              const fileData = {
                buffer: buffer,
                filename: item.file[0].name,
                type: item.file[0].type,
              };
              return { title: item.title, file: fileData, isAdd: item.isAdd };
            } else {
              if (item.file && Array.isArray(item.file)) {
                if (item.file?.length) {
                  item.file = item.file[0];
                }
              }
              return { ...item };
            }
          })
        );
        updateQualifications(userId, { ...values, qualifications: dt })
          .then(() => {
            setShowError(false);
            setErrors({});
            openNotification({
              type: "success",
              message: "Update Documents Successfully",
              title: "Updated Successfully",
            });
            setHaveApiCall(false);
          })
          .catch((err) => {
            openNotification({
              type: "error",
              message: err?.message,
              title: "Failed to Update Documents",
            });
          })
          .finally(() => {
            setSubmitting(false);
          });
      }
      else if (tab === "permissions") {
        updatePermissions(userId, values)
          .then(() => {
            setShowError(false);
            setErrors({});
            openNotification({
              type: "success",
              message: "Update Permissions Successfully",
              title: "Updated Successfully",
            });
            setHaveApiCall(false);
          })
          .catch((err) => {
            openNotification({
              type: "error",
              message: err?.message,
              title: "Failed to Update Permissions Details",
            });
          })
          .finally(() => {
            setSubmitting(false);
          });
      }
    } else {
      if (tab === "profile-details") {
        let updatedValues = { ...values };
        if (
          updatedValues.pic?.file &&
          updatedValues.pic?.file?.length !== 0 &&
          updatedValues?.pic?.isAdd
        ) {
          const buffer = await readFileAsBase64(updatedValues.pic?.file);
          const fileData = {
            buffer: buffer,
            filename: updatedValues.pic?.file?.name,
            type: updatedValues.pic?.file?.type,
            isDeleted: updatedValues?.pic?.isDeleted || 0,
            isAdd: updatedValues?.pic?.isAdd || 0,
          };
          updatedValues.pic = fileData;
        } else if (updatedValues?.pic?.isDeleted) {
          const fileData = {
            isDeleted: updatedValues?.pic?.isDeleted || 0,
            isAdd: updatedValues?.pic?.isAdd || 0,
          };
          updatedValues.pic = fileData;
        }

        const finalData = await generateSubmitResponse(updatedValues);
        createUser({ ...finalData })
          .then((data: any) => {
            setShowError(false);
            setErrors({});
            openNotification({
              type: "success",
              message: "Create New User Successfully",
              title: "Create Successfully",
            });
            setHaveApiCall(false);
            navigateUser(data?.data?._id);
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
      } else {
        openNotification({
          title: `${tab} Tab Inaccessible`,
          message:
            "This tab is accessible only after completing the profile details.",
          type: "info",
        });
        setSubmitting(false);
      }
    }
  };

  useEffect(() => {
    // check this, is it edit page or not
    if (type && !haveApiCall) {
      getUsersDetailsById(id)
        .then((data: any) => {
          setUserData(data);
          setHaveApiCall(true);
        })
        .catch((err: any) => {
          openNotification({
            type: "error",
            message: err?.message,
            title: "Failed to Get Details",
          });
          setTimeout(() => {
            navigate(dashboard.Users.details);
          }, 2000);
        });
    }
  }, [
    type,
    location,
    id,
    openNotification,
    getUsersDetailsById,
    navigate,
    haveApiCall,
  ]);

  const commonProps = {
    handleSubmitProfile,
    initialValues: getUserInitialValues(tab, userData),
    validations: getUserValidation(tab, type ? "edit" : "create"),
    type: type ? "edit" : "create",
    changePassword: () => alert("not found"),
    files: files,
    setFiles: setFiles,
  };

  const isDataLoaded = type && userData;

  return (
    <Box>
      <DashPageHeader title="Users > New" breadcrumb={UsersBreadCrumb.new} />
      {isDataLoaded ? (
        <UserContainer {...commonProps} />
      ) : type === false ? (
        <UserContainer {...commonProps} />
      ) : (
        <Center>
          <Loader height={"70vh"} />
        </Center>
      )}
    </Box>
  );
});

export default UserFormContainer;
