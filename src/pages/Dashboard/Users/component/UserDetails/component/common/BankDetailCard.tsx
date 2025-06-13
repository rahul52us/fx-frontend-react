import { Box, Grid, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";

interface BankDetailsCardProps {
  bankDetails: {
    _id: string;
    accountNo?: string;
    name: string;
    branch?: string;
    ifsc?: string;
    cancelledCheque?: {
      name: string;
      url?: string;
      type?: string;
    };
  }[];
  cardBgColor?: string;
  borderColor?: string;
  shadow?: string;
}

const BankDetailsCard: React.FC<BankDetailsCardProps> = ({ bankDetails }) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box>
      <Box>
        <Heading size="md" color={"blue.600"}>
          Bank Details
        </Heading>
      </Box>
      <Box pt={2}>
        {bankDetails?.length > 0 ? (
          bankDetails?.map((bank) => (
            <Grid
              key={bank?._id || Math.random()}
              gap={6}
              templateColumns={"1fr 1fr"}
              borderBottom="1px"
              borderColor={borderColor}
              py={2}
              mb={4}
            >
              <Box>
                <Text fontWeight="bold">Account Number:</Text>
                <Text>{bank?.accountNo || "N/A"}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Bank Name:</Text>
                <Text>{bank?.name || "N/A"}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Branch:</Text>
                <Text>{bank?.branch || "N/A"}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">IFSC Code:</Text>
                <Text>{bank?.ifsc || "N/A"}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Cancel Cheque:</Text>
                <Text
                  as="a"
                  href={bank?.cancelledCheque?.url}
                  color="blue.500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Cheque
                </Text>
              </Box>
            </Grid>
          ))
        ) : (
          <Text>No bank details found</Text>
        )}
      </Box>
    </Box>
  );
};

export default BankDetailsCard;
