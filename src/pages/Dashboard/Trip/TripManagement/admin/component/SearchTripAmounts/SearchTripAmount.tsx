import { observer } from "mobx-react-lite";
import FormModel from "../../../../../../../config/component/common/FormModel/FormModel";
import store from "../../../../../../../store/store";
import CustomInput from "../../../../../../../config/component/CustomInput/CustomInput";
import { useState, useEffect } from "react";
import useDebounce from "../../../../../../../config/component/customHooks/useDebounce";
import { Box, Flex, Text, Divider, Spinner, Center } from "@chakra-ui/react";
import { getStatusType } from "../../../../../../../config/constant/statusCode";
import { formatCurrency } from "../../../../../../../config/constant/function";

const SearchTripAmount = observer(() => {
  const {
    tripStore: { getIndividualTripAmount },
    auth: { openNotification },
  } = store;
  const [searchValue, setSearchValue] = useState("");
  const [tripData, setTripData] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearchValue = useDebounce(searchValue, 1000);
  const {
    tripStore: { searchModel, setOpenSearchTrip },
  } = store;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    setTripData([]);
    if (debouncedSearchValue) {
      setLoading(true);
      getIndividualTripAmount({ tripTitle: debouncedSearchValue })
        .then((dt: any) => {
          if (dt.length > 0) {
            setTripData(dt);
          }
        })
        .catch((err) => {
          openNotification({
            title: "Failed to Retrieve Trip Amount",
            message: err?.data?.message,
            type: getStatusType(err.status),
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [
    debouncedSearchValue,
    openNotification,
    getIndividualTripAmount,
    setTripData,
  ]);

  return (
    <FormModel
      title="Search Trips Amount"
      open={searchModel.open}
      close={() => {
        setSearchValue("");
        setTripData([]);
        setOpenSearchTrip({ open: false });
      }}
    >
      <Box m={5}>
        {/* Input Field */}
        <CustomInput
          name="searchTrip"
          type="text"
          value={searchValue}
          onChange={handleChange}
          label="Trip Name"
          required={true}
        />

        {/* Loader or Trip Data Display */}
        {loading ? (
          <Center mt={4}>
            <Spinner size="lg" color="blue.500" />
          </Center>
        ) : tripData.length > 0 ? (
          <Box mt={4}>
            {tripData.map((item: any, index: number) => (
              <Box key={index} mb={4}>
                <Flex
                  justify="space-between"
                  align="center"
                  p={3}
                  bg="gray.50"
                  borderRadius="md"
                >
                  {/* Trip Title */}
                  <Text fontWeight="bold" fontSize="lg" color="gray.700">
                    {item.title}
                  </Text>

                  {/* Trip Amount */}
                  <Text fontSize="lg" color="blue.600">
                    {formatCurrency(item.amount)}
                  </Text>
                </Flex>
                {/* Divider between each trip */}
                {index < tripData.length - 1 && <Divider my={2} />}
              </Box>
            ))}
          </Box>
        ) : (
          <Text mt={4} fontSize="xl" color="gray.500" textAlign="center">
            No trip data available.
          </Text>
        )}
      </Box>
    </FormModel>
  );
});

export default SearchTripAmount;