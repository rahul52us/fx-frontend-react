import { Box } from "@chakra-ui/react";
import DashPageHeader from "../../../../config/component/common/DashPageHeader/DashPageHeader";
import { UsersBreadCrumb } from "../../utils/breadcrumb.constant";
import PersonalDetailContainer from "./PersonalDetailContainer";
import { observer } from "mobx-react-lite";

const PersonalDetails = observer(() => {
  return (
    <Box>
      <DashPageHeader
        title="Users > Details"
        breadcrumb={UsersBreadCrumb.personalDetails}
      />
      <PersonalDetailContainer />
    </Box>
  );
})

export default PersonalDetails;
