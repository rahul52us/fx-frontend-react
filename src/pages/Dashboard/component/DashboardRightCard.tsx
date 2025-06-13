import { Grid, CircularProgress, Box, Image, Text, Flex } from "@chakra-ui/react";

const DashboardRightCard = () => {
  return (
    <div>
      <Grid
        borderWidth="1px"
        borderRadius="lg"
        p={2}
        boxShadow="lg"
        cursor="pointer"
        transition="transform 0.2s, box-shadow 0.2s"
        templateColumns={"1.5fr 2fr 1fr"}
        gap={2}
      >
        <Box>
          <Image
            h={14}
            w={16}
            rounded={10}
            src="https://cdn.dribbble.com/users/1085845/screenshots/2818863/media/7ae3410d8c64a7dac4412bf3b6230dd0.gif"
          />
        </Box>

        <Box>
          <Text fontSize="xl" fontWeight="bold">
            Title
          </Text>
          <Text>Description</Text>
        </Box>
        <Flex justifyContent={"center"} alignItems={"center"}  >
          <CircularProgress value={60} />
        </Flex>
      </Grid>
    </div>
  );
};

export default DashboardRightCard;
