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
  <Grid templateColumns="150px 1fr" fontSize="sm">
    <GridItem color="gray.500">{label}:</GridItem>
    <GridItem fontWeight="500">{value ?? "--"}</GridItem>
  </Grid>
);

const ExposureRefsCell = (row: any) => {
  const exposureRefs = row.exposureRefs || [];

  if (!exposureRefs.length) {
    return <Text color="gray.400">--</Text>;
  }

  return (
    <Popover placement="left-start">
      <PopoverTrigger>
        <Button size="xs" variant="outline" colorScheme="blue">
          View ({exposureRefs.length})
        </Button>
      </PopoverTrigger>

      <PopoverContent maxW="480px" borderRadius="xl" boxShadow="xl" fontSize={'sm'}>
        <PopoverArrow />
        <PopoverBody p={4}>
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
                  justify="space-between"
                  align="center"
                  mb={3}
                >
                  <Text fontWeight="600" >
                    Exposure #{index + 1}
                  </Text>
                  <Badge colorScheme="purple" variant="subtle">
                    {ref.exposureRefNumber}
                  </Badge>
                </Stack>

                {/* Details */}
                <Stack spacing={2}>
                  <LabelValue
                    label="Outstanding Amount"
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
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ExposureRefsCell;
