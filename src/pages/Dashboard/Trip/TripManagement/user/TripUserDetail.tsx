import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import TripUserWidget from "../component/TripWidget/TripWidgets";
import TripLayout from "../component/layout/TripLayout";
import { useState } from "react";
import { FaHome, FaPlus } from "react-icons/fa";
import TripChartContainer from "../component/TripChartContainer/TripChartContainer";
import DashPageHeader from "../../../../../config/component/common/DashPageHeader/DashPageHeader";
import { tripBreadCrumb } from "../../../utils/breadcrumb.constant";
import store from "../../../../../store/store";

const TripUserDetail = observer(({ userId, isDrawer }: any) => {
  const {
    auth: { checkPermission },
  } = store;
  const [gridType, setGripType] = useState({ loading: true, type: "grid" });
  const [tripFormData, setTripFormData] = useState({
    open: false,
    type: "add",
    data: null,
  });
  const showIcon = useBreakpointValue({ base: true, md: false });

  return (
    <Box>
      {!isDrawer && <DashPageHeader breadcrumb={tripBreadCrumb.index} />}
      <TripUserWidget userId={userId} />
      <TripChartContainer userId={userId} />
      <Box pb={5}>
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Heading
            display="flex"
            alignItems="center"
            fontSize={{ base: "xl", md: "2xl" }}
            color="teal.600"
          >
            <Icon as={FaHome} boxSize={6} mr={2} />
            Trips
          </Heading>
          {checkPermission("trip", "add") && (
            <Box>
              {showIcon ? (
                <IconButton
                  title="Create Project"
                  onClick={() =>
                    setTripFormData({ open: true, type: "add", data: null })
                  }
                  aria-label="Create Trip"
                  icon={<FaPlus />}
                  colorScheme="teal"
                />
              ) : (
                <Button
                  leftIcon={<FaPlus />}
                  colorScheme="teal"
                  variant="solid"
                  size="lg"
                  _hover={{ bg: "teal.600" }}
                  _active={{ bg: "teal.700" }}
                  _focus={{ boxShadow: "outline" }}
                  onClick={() =>
                    setTripFormData({ open: true, type: "add", data: null })
                  }
                >
                  CREATE TRIP
                </Button>
              )}
            </Box>
          )}
        </Flex>
        <TripLayout
          tripFormData={tripFormData}
          setTripFormData={setTripFormData}
          userId={userId}
          setGripType={setGripType}
          gridType={gridType.type}
          gridLoading={gridType.loading}
        />
      </Box>
    </Box>
  );
});

export default TripUserDetail;
