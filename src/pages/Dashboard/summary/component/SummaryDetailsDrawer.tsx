import React from "react";
import CustomDrawer from "../../../../config/component/Drawer/CustomDrawer";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Heading,
} from "@chakra-ui/react";
import { primaryColor } from "../../../../globalColors";

interface SummaryDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: any; // Changed from any[] to any
  exposureType: string;
}

const SummaryDetailsDrawer: React.FC<SummaryDetailsDrawerProps> = ({ isOpen, onClose, data, exposureType }) => {
  const renderTable = (tableData: any[], type: string) => (
    <Box mb={8}>
      <Heading size="sm" mb={4} color={primaryColor}>{type.charAt(0).toUpperCase() + type.slice(1)} Breakdowns</Heading>
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead bgGradient={`linear(to-r, ${primaryColor}, #1A365D)`}>
            <Tr>
              {type === "export" && <Th color="white">PCFC Drawdown</Th>}
              {type === "export" && <Th color="white">PCFC Rate</Th>}
              <Th color="white">Spot Conversion</Th>
              <Th color="white">Spot Rate</Th>
              <Th color="white">EEFC Conversion</Th>
              <Th color="white">EEFC Rate</Th>
              <Th color="white">Forward Utilization</Th>
              <Th color="white">Forward Rate</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tableData.map((item, index) => (
              <Tr key={index}>
                {type === "export" && <Td>{item.pcfcDrawDown}</Td>}
                {type === "export" && <Td>{item.pcfcRate}</Td>}
                <Td>{item.spotConversion}</Td>
                <Td>{item.spotRate}</Td>
                <Td>{item.eefcConversion}</Td>
                <Td>{item.eefcRate}</Td>
                <Td>{item.forwardUtilization}</Td>
                <Td>{item.forwardRate}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );

  const hasData = exposureType === "total" ? (data?.exportDetails?.length > 0 || data?.importDetails?.length > 0) : (data?.length > 0);

  return (
    <CustomDrawer
      open={isOpen}
      close={onClose}
      title={`${exposureType.charAt(0).toUpperCase() + exposureType.slice(1)} Details`}
      width="90vw"
    >
      <Box p={4}>
        {!hasData && <Text p={4} textAlign="center">No details available.</Text>}
        
        {exposureType === "total" ? (
          <>
            {data?.exportDetails?.[0]?.details?.length > 0 && renderTable(data.exportDetails[0].details, "export")}
            {data?.importDetails?.[0]?.details?.length > 0 && renderTable(data.importDetails[0].details, "import")}
          </>
        ) : (
          data?.length > 0 && renderTable(data, exposureType)
        )}
      </Box>
    </CustomDrawer>
  );
};

export default SummaryDetailsDrawer;
