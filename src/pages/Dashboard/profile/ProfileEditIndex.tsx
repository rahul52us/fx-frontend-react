import { observer } from "mobx-react-lite";
import CustomDrawer from "../../../config/component/Drawer/CustomDrawer";
import PersonalDetailsForm from "../Users/component/UserDetails/formContainer/forms/PersonalDetailsForm";
import { getUserValidation } from "../Users/component/UserDetails/utils/validations";
import {
  generateSubmitResponse,
  getUserInitialValues,
} from "../Users/component/UserDetails/utils/constant";
import store from "../../../store/store";
import { readFileAsBase64 } from "../../../config/constant/function";
import { useState } from "react";
import PersonalPermissions from "../Users/component/UserDetails/formContainer/forms/PersonalPermissions";
import PersonalBankDetails from "../Users/component/UserDetails/formContainer/forms/PersonalBankDetails";
import FamilyDetails from "../Users/component/UserDetails/formContainer/forms/PersonalFamilyDetails";
import PersonalWorkExperience from "../Users/component/UserDetails/formContainer/forms/PersonalWorkExperience";
import PersonalDocuments from "../Users/component/UserDetails/formContainer/forms/PersonalDocuments";
import PersonalCompanyDetails from "../Users/component/UserDetails/formContainer/forms/PersonalCompanyDetails";
import PersonalQualifications from "../Users/component/UserDetails/formContainer/forms/PersonalQualification";

const ProfileEditIndex = observer(
  ({ selectedTab, setSelectedTab, userDetails, setHaveApiCall }: any) => {
    const {
      auth: { openNotification },
      User: {
        updateCompanyDetails,
        updateDocuments,
        updateFamilyDetails,
        updateUserBankDetails,
        updatePermissions,
        updateUserProfile,
        updateWorkExperience,
        updateQualifications
      },
    } = store;
    const [files, setFiles] = useState<any>({
      cancelledCheque: {
        file: null,
        isDeleted: 0,
        isAdd: 0,
      },
    });


    const handleSubmitProfile = async ({
      values,
      setSubmitting,
      setErrors,
      setShowError,
    }: any) => {
      if (selectedTab.type === "profile-details") {
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
        updateUserProfile(userDetails._id, { ...finalData, company: userDetails?.companyDetail?.company })
          .then(() => {
            setShowError(false);
            setErrors({});
            openNotification({
              type: "success",
              message: "Update Profile Successfully",
              title: "Updated Successfully",
            });
            setHaveApiCall(false);
            setSelectedTab({ open: false, type: "profile-details" });
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
      }

      else if (selectedTab.type === "company-details") {
        let data: any = {};
        data["workTiming"] = values.workTiming.map((item: any) => item.value);
        data["workingLocation"] = values.workingLocation.map(
          (item: any) => item.value
        );
        data["managers"] = values.managers.map((item: any) => item.value);
        data["eType"] = values.eType?.value;
        data["department"] = values.department?.value;
        data["designation"] = values.designation?.value;
        updateCompanyDetails(userDetails._id, {
          details: { ...values, ...data },
        })
          .then(() => {
            setShowError(false);
            setErrors({});
            openNotification({
              type: "success",
              message: "Update Company Details Successfully",
              title: "Updated Successfully",
            });
            setSelectedTab({ open: false, type: "profile-details" });
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
      }
      else if (selectedTab.type === "bank-details") {
        let bankDetails: any = {...values}
        if (
          bankDetails.cancelledCheque?.file &&
          bankDetails.cancelledCheque?.file?.length !== 0 &&
          bankDetails?.cancelledCheque?.isAdd
        ) {
          const buffer = await readFileAsBase64(bankDetails.cancelledCheque?.file);
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
        updateUserBankDetails(userDetails._id, bankDetails)
          .then(() => {
            setShowError(false);
            setErrors({});
            openNotification({
              type: "success",
              message: "Update Bank Successfully",
              title: "Updated Successfully",
            });
            setHaveApiCall(false);
            setSelectedTab({ open: false, type: "profile-details" });
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
      } else if (selectedTab.type === "family-details") {
        updateFamilyDetails(userDetails._id, values)
          .then(() => {
            setShowError(false);
            setErrors({});
            openNotification({
              type: "success",
              message: "Update Family Successfully",
              title: "Updated Successfully",
            });
            setHaveApiCall(false);
            setSelectedTab({ open: false, type: "profile-details" });
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
      } else if (selectedTab.type === "work-experience") {
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
        updateWorkExperience(userDetails._id, { experienceDetails: dt })
          .then(() => {
            setShowError(false);
            setErrors({});
            openNotification({
              type: "success",
              message: "Update Work Experience Successfully",
              title: "Updated Successfully",
            });
            setHaveApiCall(false);
            setSelectedTab({ open: false, type: "profile-details" });
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
      else if (selectedTab.type === "documents") {
        let vall = {...values}
        let dt = await Promise.all(
          vall.documents.map(async(item : any) => {
            if (item?.isAdd && item?.file) {
              const buffer = await readFileAsBase64(item?.file[0]);
              const fileData = {
                buffer: buffer,
                filename: item.file[0].name,
                type: item.file[0].type
              };
              return {title : item.title, file : fileData, isAdd : item.isAdd}
            } else {
              if(item.file && Array.isArray(item.file)){
                if(item.file?.length){
                  item.file = item.file[0]
                }
              }
                return {...item}
            }
          }))
        updateDocuments(userDetails._id, { ...vall, documents: dt })
          .then(() => {
            setShowError(false);
            setErrors({});
            openNotification({
              type: "success",
              message: "Update Documents Successfully",
              title: "Updated Successfully",
            });
          setSelectedTab({ ...selectedTab, open: false })

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
      else if (selectedTab.type === "qualifications") {
        let vall = {...values}
        let dt = await Promise.all(
          vall.qualifications.map(async(item : any) => {
            if (item?.isAdd && item?.file) {
              const buffer = await readFileAsBase64(item?.file[0]);
              const fileData = {
                buffer: buffer,
                filename: item.file[0].name,
                type: item.file[0].type
              };
              return {title : item.title, file : fileData, isAdd : item.isAdd}
            } else {
              if(item.file && Array.isArray(item.file)){
                if(item.file?.length){
                  item.file = item.file[0]
                }
              }
                return {...item}
            }
          }))
        updateQualifications(userDetails._id, { ...vall, qualifications: dt })
          .then(() => {
            setShowError(false);
            setErrors({});
            openNotification({
              type: "success",
              message: "Update Documents Successfully",
              title: "Updated Successfully",
            });
          setSelectedTab({ ...selectedTab, open: false })

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
      else if (selectedTab.type === "permissions") {
        updatePermissions(userDetails._id, values)
          .then(() => {
            setShowError(false);
            setErrors({});
            openNotification({
              type: "success",
              message: "Update Permissions Successfully",
              title: "Updated Successfully",
            });
            setHaveApiCall(false);
            setSelectedTab({ open: false, type: "profile-details" });
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
    };

    const getEditActiveComponent = ({
      profileData,
      type,
      handleSubmitProfile,
    }: any) => {
      switch (selectedTab.type) {
        case "profile-details":
          return (
            <PersonalDetailsForm
              type={type}
              profileData={profileData}
              handleSubmitProfile={handleSubmitProfile}
              initialValues={
                getUserInitialValues("profile-details", userDetails).profileDetails
              }
              validations={getUserValidation("profile-details", 'edit')}
            />
          );
        case "bank-details":
          return (
            <PersonalBankDetails
              type={type}
              profileData={profileData}
              handleSubmitProfile={handleSubmitProfile}
              initialValues={
                getUserInitialValues("bank-details", userDetails).bankDetails
              }
              validations={getUserValidation("bank-details", 'edit')}
              files={files}
              setFiles={setFiles}
            />
          );
        case "family-details":
          return (
            <FamilyDetails
              type={type}
              profileData={profileData}
              handleSubmitProfile={handleSubmitProfile}
              initialValues={
                getUserInitialValues("family-details", userDetails)
                  .familyDetails
              }
              validations={getUserValidation("family-details", 'edit')}
              files={files}
              setFiles={setFiles}
            />
          );
        case "work-experience":
          return (
            <PersonalWorkExperience
              type={type}
              profileData={profileData}
              handleSubmitProfile={handleSubmitProfile}
              initialValues={
                getUserInitialValues("work-experience", userDetails)
                  .workExperience
              }
              validations={getUserValidation("work-experience", 'edit')}
              files={files}
              setFiles={setFiles}
            />
          );
        case "documents":
          return (
            <PersonalDocuments
              type={type}
              profileData={profileData}
              handleSubmitProfile={handleSubmitProfile}
              initialValues={
                getUserInitialValues("documents", userDetails).documents
              }
              validations={getUserValidation("documents", 'edit')}
              files={files}
              setFiles={setFiles}
            />
          );
          case "qualifications":
            return (
              <PersonalQualifications
                type={type}
                profileData={profileData}
                handleSubmitProfile={handleSubmitProfile}
                initialValues={
                  getUserInitialValues("qualifications", userDetails).qualifications
                }
                validations={getUserValidation("qualifications", 'edit')}
                files={files}
                setFiles={setFiles}
              />
            );
        case "company-details":
          return (
            <PersonalCompanyDetails
              type={type}
              profileData={profileData}
              handleSubmitProfile={handleSubmitProfile}
              initialValues={
                getUserInitialValues("company-details", userDetails)
                  .companyDetails
              }
              validations={getUserValidation("company-details", 'edit')}
              files={files}
              setFiles={setFiles}
            />
          );
        case "permissions":
          return (
            <PersonalPermissions
              type={type}
              profileData={profileData}
              handleSubmitProfile={handleSubmitProfile}
              initialValues={
                getUserInitialValues("profile-details", userDetails).permissions
              }
              validations={{}}
            />
          );
      }
    };
    return (
      <div>
        <CustomDrawer
          title={selectedTab.type}
          open={selectedTab.open}
          close={() => setSelectedTab({ ...selectedTab, open: false })}
          width={"95vw"}
        >
          {userDetails &&
            getEditActiveComponent({
              profileData: userDetails,
              type: "edit",
              handleSubmitProfile: handleSubmitProfile,
            })}
        </CustomDrawer>
      </div>
    );
  }
);

export default ProfileEditIndex;