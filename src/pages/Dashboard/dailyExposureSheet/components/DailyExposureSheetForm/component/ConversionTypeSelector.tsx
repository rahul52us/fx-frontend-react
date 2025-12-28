import { Box, FormControl, FormLabel, Grid, Switch } from "@chakra-ui/react";

interface ConversionTypeSelectorProps {
  values: any;
  setFieldValue: (field: string, value: any) => void;
}

const ConversionTypeSelector = ({
  values,
  setFieldValue,
}: ConversionTypeSelectorProps) => {
  return (
    <Box
      p={4}
      bg="gray.50"
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.200"
    >
      <Box fontWeight={700} mb={3}>
        Select Conversion Types
      </Box>

      <Grid gap={6} templateColumns="repeat(3, 1fr)">
        {/* ===================== SPOT ===================== */}
        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">Spot Conversion</FormLabel>
          <Switch
            isChecked={values.isSpotEnabled}
            onChange={(e) => {
              const checked = e.target.checked;
              setFieldValue("isSpotEnabled", checked);
              setFieldValue("spotList", checked ? [{}] : []);
            }}
            colorScheme="blue"
          />
        </FormControl>

        {/* ===================== EEFC EXPORTS ===================== */}
        {values.settlementType === "export" && (
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">EEFC – Exports</FormLabel>
            <Switch
              isChecked={values.isEEFCExportsEnabled}
              onChange={(e) => {
                const checked = e.target.checked;
                setFieldValue("isEEFCExportsEnabled", checked);
                setFieldValue("eefcExportsList", checked ? [{}] : []);
              }}
              colorScheme="green"
            />
          </FormControl>
        )}

        {/* ===================== EEFC IMPORTS ===================== */}
        {values.settlementType === "import" && (
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">EEFC – Imports</FormLabel>
            <Switch
              isChecked={values.isEEFCImportsEnabled}
              onChange={(e) => {
                const checked = e.target.checked;
                setFieldValue("isEEFCImportsEnabled", checked);
                setFieldValue("eefcImportsList", checked ? [{}] : []);
              }}
              colorScheme="teal"
            />
          </FormControl>
        )}

        {/* ===================== PCFC ===================== */}
        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">PCFC Repayment</FormLabel>
          <Switch
            isChecked={values.isPCFCEnabled}
            onChange={(e) => {
              const checked = e.target.checked;
              setFieldValue("isPCFCEnabled", checked);
              setFieldValue("pcfcList", checked ? [{}] : []);
            }}
            colorScheme="orange"
          />
        </FormControl>

        {/* ===================== FORWARD ===================== */}
        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">Forward Contract</FormLabel>
          <Switch
            isChecked={values.isForwardEnabled}
            onChange={(e) => {
              const checked = e.target.checked;
              setFieldValue("isForwardEnabled", checked);
              setFieldValue("forwardList", checked ? [{}] : []);
            }}
            colorScheme="pink"
          />
        </FormControl>
      </Grid>
    </Box>
  );
};

export default ConversionTypeSelector;
