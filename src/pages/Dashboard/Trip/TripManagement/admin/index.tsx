import DashPageHeader from "../../../../../config/component/common/DashPageHeader/DashPageHeader";
import { tripBreadCrumb } from "../../../utils/breadcrumb.constant";
import { observer } from "mobx-react-lite";
import TripChartContainer from "../component/TripChartContainer/TripChartContainer";
import TripLayout from "../component/layout/TripLayout";
import { useState } from "react";
import { FaHome, FaPlus } from "react-icons/fa";
import {
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import store from "../../../../../store/store";
import SearchTripAmount from "./component/SearchTripAmounts/SearchTripAmount";
import TripWidgets from "../component/TripWidget/TripWidgets";

const TripAdminDetails = observer(() => {
  const {
    tripStore: { setOpenSearchTrip },
  } = store;
  const [gridType, setGripType] = useState({ loading: true, type: "grid" });
  const [tripFormData, setTripFormData] = useState({
    open: false,
    type: "add",
    data: null,
  });
  const showIcon = useBreakpointValue({ base: true, md: false });

  return (
    <div>
      <DashPageHeader
        breadcrumb={tripBreadCrumb.index}
        selectedMode={gridType.type}
        btnAction={(type: any) => {
          setGripType((prev) => ({ ...prev, loading: true }));
          setTimeout(() => {
            setGripType({ loading: false, type: type });
          }, 1000);
        }}
      />
      <TripWidgets />
      <TripChartContainer />
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
          <Flex columnGap={4}>
            <Button
              colorScheme="teal"
              variant="solid"
              size="lg"
              _hover={{ bg: "teal.600" }}
              _active={{ bg: "teal.700" }}
              _focus={{ boxShadow: "outline" }}
              onClick={() => setOpenSearchTrip({ open: true, data: null })}
            >
              Search Trip Amount
            </Button>
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
          </Flex>
        )}
      </Flex>
      <TripLayout
        tripFormData={tripFormData}
        setTripFormData={setTripFormData}
        gridType={gridType.type}
        gridLoading={gridType.loading}
        setGripType={setGripType}
      />
      <SearchTripAmount />
    </div>
  );
});

export default TripAdminDetails;
