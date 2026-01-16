import {
    Badge,
    Box,
    Button,
    Grid,
    GridItem,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Stack,
    Text
} from "@chakra-ui/react";

const LabelValue = ({ label, value }: any) => (
  <Grid templateColumns="140px 1fr" gap={2} fontSize="sm">
    <GridItem color="gray.500">{label}</GridItem>
    <GridItem fontWeight="500">{value || "--"}</GridItem>
  </Grid>
);

const HedgeDealsCell = (row: any) => {
  const hedgeDeals = row.hedgeDeals || [];

  if (!hedgeDeals.length) {
    return <Text fontSize="sm" color="gray.400">--</Text>;
  }

  return (
    <Popover placement="left-start" trigger="hover">
      <PopoverTrigger>
        <Button
          size="xs"
          variant="outline"
          colorScheme="blue"
          fontWeight="500"
        >
          Hedge ({hedgeDeals.length})
        </Button>
      </PopoverTrigger>

      <PopoverContent
      w={'fit-content'}
        // maxW="460px"
        borderRadius="xl"
        boxShadow="xl"
      >
        <PopoverArrow />
        <PopoverBody p={4}>
          <Stack spacing={4}>
            {hedgeDeals.map((deal: any, index: number) => (
              <Box
                key={index}
                p={3}
                bg="gray.50"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
              >
                {/* Header */}
                <Stack
                  direction="row"
                  justify="space-between"
                  align="center"
                  mb={3}
                >
                  <Text fontWeight="600">
                    Hedge #{index + 1}
                  </Text>
                  <Badge colorScheme="blue" variant="subtle">
                    {deal.hedgeDealRefNo}
                  </Badge>
                </Stack>

                {/* Details */}
                <Stack spacing={2}>
                  <LabelValue label="Hedge Rate" value={deal.hedgeRate} />
                  <LabelValue
                    label="Delivery Period"
                    value={`${deal.deliveryDateFrom} → ${deal.deliveryDateTo}`}
                  />
                  <LabelValue
                    label="Hedge Amount"
                    value={deal.hedgeAmount}
                  />
                  <LabelValue
                    label="Outstanding Amount"
                    value={deal.outstandingAmount}
                  />
                  <LabelValue
                    label="Balance Amount"
                    value={deal.balanceAmount}
                  />
                </Stack>
              </Box>
            ))}
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default HedgeDealsCell;
