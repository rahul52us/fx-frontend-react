// ModeOfConversion.tsx
import { Box, FormControl, FormLabel, HStack, Switch } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import store from "../../../../../store/store";
import {
  createEmptySpotRow,
  getBankMarginFromForm,
} from "./utils/spotHelpers";

const EMPTY_FORWARD_ROW = {
  hedgeDealRefNo: "",
  outstandingAmount: "",
  utilizationAmount: "",
  hedgeRate: "",
  forwardPremium: "",
  cashTomSpot: "",
  deliveryDateFrom: "",
  deliveryDateTo: "",
  netSettlementRate: "0.0000",
};

const ModeOfConversion = () => {
  const { values, setValues }: any = useFormikContext();
  const { auth: { banksData } } = store;

  const handleSpotToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      const bankMargin = getBankMarginFromForm(values.bank, banksData);
      setValues(
        {
          ...values,
          isSpotEnabled: true,
          spotList:
            values.spotList?.length > 0
              ? values.spotList
              : [createEmptySpotRow(bankMargin)],
        },
        false
      );
      return;
    }

    setValues(
      {
        ...values,
        isSpotEnabled: false,
        spotList: [],
      },
      false
    );
  };

  const handleForwardToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setValues(
        {
          ...values,
          isForwardEnabled: true,
          forwardList:
            values.forwardList?.length > 0
              ? values.forwardList
              : [{ ...EMPTY_FORWARD_ROW }],
        },
        false
      );
      return;
    }

    setValues(
      {
        ...values,
        isForwardEnabled: false,
        forwardList: [],
      },
      false
    );
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
