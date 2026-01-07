import { Box } from "@chakra-ui/react";
import ExportRegisterTable from "./component/ExportRegisterTable/ExportRegsiterTable";
import DashPageTitle from "../../../config/component/common/DashPageTitle/DashPageTitle";

const ExportRegister = () => {
  return (
    <Box
      px={{ base: 2, md: 2 }}
      py={{ base: 2, md: 2 }}
      w="100%"
      overflowX="hidden"
    >
      <DashPageTitle
        title="Export Registrations"
        subTitle="Export Registrations Details"
      />

      <Box w="100%">
        <ExportRegisterTable />
      </Box>
    </Box>
  );
};

export default ExportRegister;
