import {
  Box,
  Image,
  Text,
  Stack,
  Heading,
  Flex,
  useColorModeValue,
  Icon,
  Divider,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import {
  FaRegCreditCard,
  FaUniversity,
  FaFileInvoiceDollar,
  FaCheckCircle,
} from "react-icons/fa";
import CustomButton from "../../../../config/component/Button/CustomButton";

const BankDetails = observer(({ bankDetails, setSelectedTab,isEditable }: any) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const iconColor = useColorModeValue("teal.500", "teal.300");

  return (
    <Flex width="100%">
      <Box
        w={"100%"}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg={cardBg}
        borderColor={cardBorder}
        boxShadow="lg"
        p={6}
      >
        <Stack spacing={6}>
          <Flex justify="space-between" alignItems="center">
            <Heading
              as="h2"
              size="xl"
              textAlign="center"
              color={textColor}
              fontSize={{ base: "sm", md: "2xl" }}
            >
              Bank Details
            </Heading>

            {isEditable && <CustomButton
              onClick={() =>
                setSelectedTab({ open: true, type: "bank-details" })
              }
              btnText="Edit"
            />}
          </Flex>
          <Divider />
          <Flex align="center">
            <Icon as={FaRegCreditCard} boxSize={6} color={iconColor} mr={3} />
            <Text fontSize="lg" color={textColor}>
              <strong>Account No:</strong> {bankDetails?.accountNo}
            </Text>
          </Flex>
          <Flex align="center">
            <Icon as={FaUniversity} boxSize={6} color={iconColor} mr={3} />
            <Text fontSize="lg" color={textColor}>
              <strong>Branch:</strong> {bankDetails?.branch}
            </Text>
          </Flex>
          <Flex align="center">
            <Icon
              as={FaFileInvoiceDollar}
              boxSize={6}
              color={iconColor}
              mr={3}
            />
            <Text fontSize="lg" color={textColor}>
              <strong>IFSC:</strong> {bankDetails?.ifsc}
            </Text>
          </Flex>
          <Flex align="center">
            <Icon as={FaCheckCircle} boxSize={6} color={iconColor} mr={3} />
            <Text fontSize="lg" color={textColor}>
              <strong>Name as per Bank:</strong> {bankDetails?.nameAsPerBank}
            </Text>
          </Flex>
          <Divider />
          <Box>
            <Text fontSize="lg" mb={2} color={textColor}>
              <strong>Cancelled Cheque:</strong>
            </Text>
            <Image
              src={bankDetails?.cancelledCheque?.url}
              alt={bankDetails?.cancelledCheque?.name}
              borderRadius="md"
              boxShadow="md"
              maxH="300px"
              objectFit="contain"
              mb={4}
            />
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
});

export default BankDetails;
