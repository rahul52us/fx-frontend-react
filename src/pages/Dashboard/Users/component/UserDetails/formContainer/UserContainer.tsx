import { Box, Button, Grid } from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { dashboard } from "../../../../../../config/constant/routes";
import UserFormSidebar from "../component/UserFormSidebar";
import PersonalCompanyDetails from "./forms/PersonalCompanyDetails";
import PersonalDetails from "./forms/PersonalDetailsForm";
import PersonalBankDetails from "./forms/PersonalBankDetails";
import FamilyDetails from "./forms/PersonalFamilyDetails";
import PersonalDetailsChangePassword from "./forms/PersonalDetailsChangePassword";
import PersonalWorkExperience from "./forms/PersonalWorkExperience";
import PersonalDocuments from "./forms/PersonalDocuments";
import PersonalPermissions from "./forms/PersonalPermissions";
import PersonalQualifications from "./forms/PersonalQualification";
import PersonalSalaryStructureForm from "./forms/PersonalSalaryStructureForm";

const UserContainer = observer(
  ({
    profileData,
    type,
    changePassword,
    handleSubmitProfile,
    initialValues,
    validations,
    files,
    setFiles,
  }: any) => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const tab: any = new URLSearchParams(location.search).get("tab");

    const getEditActiveComponent = ({
      profileData,
      type,
      handleSubmitProfile,
    }: any) => {
      switch (tab) {
        case "profile-details":
          return (
            <PersonalDetails
              type={type}
              profileData={profileData}
              handleSubmitProfile={handleSubmitProfile}
              initialValues={initialValues?.profileDetails}
              validations={validations}
            />
          );
        case "bank-details":
          return (
            <PersonalBankDetails
              type={type}
              profileData={profileData}
              handleSubmitProfile={handleSubmitProfile}
              initialValues={initialValues?.bankDetails}
              validations={validations}
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
              initialValues={initialValues?.familyDetails}
              validations={validations}
              files={files}
              setFiles={setFiles}
            />
          );
        case "change-password":
          return (
            <PersonalDetailsChangePassword changePassword={changePassword} />
          );
        case "work-experience":
          return (
            <PersonalWorkExperience
              type={type}
              profileData={profileData}
              handleSubmitProfile={handleSubmitProfile}
              initialValues={initialValues?.workExperience}
              validations={validations}
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
              initialValues={initialValues?.documents}
              validations={validations}
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
              initialValues={initialValues?.qualifications}
              validations={validations}
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
              initialValues={initialValues?.companyDetails}
              validations={validations}
              files={files}
              setFiles={setFiles}
            />
          );
        case "salary-structure":
          return <PersonalSalaryStructureForm />;
        case "permissions":
          return (
            <PersonalPermissions
              type={type}
              profileData={profileData}
              handleSubmitProfile={handleSubmitProfile}
              initialValues={initialValues?.permissions}
              validations={validations}
            />
          );
        default:
          return (
            <Button
              onClick={() =>
                navigate(
                  `${dashboard.Users.details}/edit/${id}?tab=profile-details`
                )
              }
            >
              Something went here
            </Button>
          );
      }
    };

    const getCreateActiveComponent = () => {
      switch (tab) {
        case "profile-details":
          return (
            <PersonalDetails
              type={type}
              profileData={profileData}
              handleSubmitProfile={handleSubmitProfile}
              initialValues={initialValues?.profileDetails}
              validations={validations}
            />
          );
        case "bank-details":
          return (
            <PersonalBankDetails
              type={type}
              profileData={profileData}
              handleSubmitProfile={handleSubmitProfile}
              initialValues={initialValues?.bankDetails}
              validations={validations}
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
              initialValues={initialValues?.familyDetails}
              validations={validations}
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
              initialValues={initialValues?.workExperience}
              validations={validations}
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
              initialValues={initialValues?.documents}
              validations={validations}
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
              initialValues={initialValues?.qualifications}
              validations={validations}
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
              initialValues={initialValues?.companyDetails}
              validations={validations}
              files={files}
              setFiles={setFiles}
            />
          );
        case "salary-structure":
          return <PersonalSalaryStructureForm />;
        case "permissions":
          return (
            <PersonalPermissions
              type={type}
              profileData={profileData}
              handleSubmitProfile={handleSubmitProfile}
              initialValues={initialValues?.permissions}
              validations={validations}
            />
          );
        default:
          return (
            <Button
              onClick={() =>
                navigate(`${dashboard.Users.details}/new?tab=profile-details`)
              }
            >
              Something went here
            </Button>
          );
      }
    };

    return (
      <Box p={{ base: 1.5, lg: 0 }}>
        <Grid gridTemplateColumns={{ lg: "0.25fr 1fr" }} gap={5} mt={3} mb={10}>
          <Box>
            <UserFormSidebar type={type} />
          </Box>
          <Box border="1px solid #e9ecef" borderRadius={5}>
            {type === "edit"
              ? getEditActiveComponent({
                  profileData,
                  type,
                  changePassword,
                  handleSubmitProfile,
                })
              : getCreateActiveComponent()}
          </Box>
        </Grid>
      </Box>
    );
  }
);

export default UserContainer;