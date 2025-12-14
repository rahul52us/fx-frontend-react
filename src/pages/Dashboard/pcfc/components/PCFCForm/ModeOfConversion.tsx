// ModeOfConversion.tsx
import { Box, FormControl, FormLabel, HStack, Switch } from "@chakra-ui/react";
import { useFormikContext } from "formik";

const ModeOfConversion = () => {
  const { values, setFieldValue }: any = useFormikContext();

  // add 1 default row when toggled ON, clear when OFF
  const handleSpotToggle = (e: any) => {
    const isChecked = e.target.checked;
    setFieldValue("isSpotEnabled", isChecked);

    if (isChecked && (!values.spotList || values.spotList.length === 0)) {
      setFieldValue("spotList", [
        {
          amountConverted: "",
          spotBooked: "",
          cashTomSpot: "",
          bankMargin: "",
          netConversionRate: 0,
        },
      ]);
    }

    if (!isChecked) {
      setFieldValue("spotList", []);
    }
  };

  const handleForwardToggle = (e: any) => {
    const isChecked = e.target.checked;
    setFieldValue("isForwardEnabled", isChecked);

    if (isChecked && (!values.forwardList || values.forwardList.length === 0)) {
      setFieldValue("forwardList", [
        {
          hedgeDealRefNo: "",
          outstandingAmount: "",
          utilizationAmount: "",
          hedgeRate: "",
          forwardPremium: "",
          cashTomSpot: "",
          deliveryDateFrom: "",
          deliveryDateTo: "",
          netSettlementRate: 0,
        },
      ]);
    }

    if (!isChecked) {
      setFieldValue("forwardList", []);
    }
  };

  return (
    <Box p={4} bg="gray.50" rounded="2xl" shadow={"base"}>
      <HStack spacing={10}>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="spot-switch" mb="0">
            Spot Conversion
          </FormLabel>
          <Switch
            id="spot-switch"
            colorScheme="blue"
            isChecked={values.isSpotEnabled}
            onChange={handleSpotToggle}
          />
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="forward-switch" mb="0">
            Forward Conversion
          </FormLabel>
          <Switch
            id="forward-switch"
            colorScheme="orange"
            isChecked={values.isForwardEnabled}
            onChange={handleForwardToggle}
          />
        </FormControl>
      </HStack>
    </Box>
  );
};

export default ModeOfConversion;
