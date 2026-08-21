import {
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Grid,
  GridItem,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const LabelValue = ({ label, value }: any) => (
  <Grid templateColumns="150px 1fr" fontSize="sm">
    <GridItem color="gray.500">{label}:</GridItem>
    <GridItem fontWeight="500">{value ?? "--"}</GridItem>
  </Grid>
);

const ExposureRefsCell = (row: any) => {
  const exposureRefs = row.exposureRefs || [];
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!exposureRefs.length) {
    return <Text color="gray.400">--</Text>;
  }

  return (
    <>
      <Button size="xs" variant="outline" colorScheme="blue" onClick={onOpen}>
        View ({exposureRefs.length})
      </Button>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent borderTopLeftRadius="xl" borderBottomLeftRadius="xl">
          <DrawerCloseButton />
          <DrawerHeader fontSize="lg" fontWeight="600">
            Exposure References
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing={4}>
              {exposureRefs.map((ref: any, index: number) => (
                <Box
                  key={index}
                  p={3}
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="lg"
                >
                  {/* Header */}
                  <Stack
                    direction="row"
                    // justify="space-between"
                    align="center"
                    mb={2}
                  >
                    <Text fontWeight="600">
                      Exposure #{index + 1}
                    </Text>
                    <Badge colorScheme="purple" ml={12} variant="subtle" px={2} py={0.75} rounded={'full'}>
                      {ref.exposureRefNumber}
                    </Badge>
                  </Stack>

                  {/* Details */}
                  <Stack spacing={2}>
                    <LabelValue
                      label="Unhedged Amount"
                      value={ref.outStandingAmount}
                    />
                    <LabelValue
                      label="RM Policy Rate"
                      value={ref.rmPolicyRate}
                    />
                    <LabelValue label="Due Date" value={ref.dueDate} />
                    <LabelValue
                      label="Allocated Amount"
                      value={ref.allocatedAmount}
                    />
                  </Stack>
                </Box>
              ))}
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ExposureRefsCell;
