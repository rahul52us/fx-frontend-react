import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Grid,
    GridItem,
    Stack,
    Text,
    useDisclosure
} from "@chakra-ui/react";

const LabelValue = ({ label, value }: any) => (
  <Grid templateColumns="140px 1fr" gap={2} fontSize="sm">
    <GridItem color="gray.500">{label}</GridItem>
    <GridItem fontWeight="500">{value || "--"}</GridItem>
  </Grid>
);

const AmountSettledList = (row: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const amountSettledList = row.amountSettledList || [];

  if (!amountSettledList.length) {
    return (
      <Text fontSize="sm" color="gray.400">
        --
      </Text>
    );
  }

  return (
    <>
      <Button
        size="xs"
        variant="outline"
        colorScheme="pink"
        fontWeight="500"
        onClick={onOpen}
      >
        Settled Amount ({amountSettledList.length})
      </Button>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Settled Amount List</DrawerHeader>
          <DrawerBody p={4}>
            <Stack spacing={4}>
              {amountSettledList.map((deal: any, index: number) => (
                <Box
                  key={index}
                  p={3}
                  bg="gray.50"
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  {/* Header */}
                  {/* <Stack
                    direction="row"
                    justify="space-between"
                    align="center"
                    mb={3}
                  >
                    <Text fontWeight="600">Hedge #{index + 1}</Text>
                    <Badge colorScheme="blue" variant="subtle">
                      {deal.hedgeDealRefNo}
                    </Badge>
                  </Stack> */}

                  {/* Details */}
                  <Stack spacing={2}>
                    <LabelValue label="Settled Amount" value={deal.settledAmount} />
                    <LabelValue
                      label="Settlement Date"
                      value={ deal.settlementDate}
                    />
                    <LabelValue
                      label="Settlement Rate"
                      value={deal.settlementRate}
                    />
                  
                    {/* <LabelValue
                      label="Balance Amount"
                      value={deal.balanceAmount}
                    /> */}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AmountSettledList;
