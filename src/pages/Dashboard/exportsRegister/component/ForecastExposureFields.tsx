// ForecastExposureFields.tsx
import { SimpleGrid } from "@chakra-ui/react";
import CustomInput from "../../../../config/component/CustomInput/CustomInput";

const ForecastExposureFields = ({
  values,
  handleChange,
  touched,
  errors,
  showError,
  currenciesData,
  bussinessUnitsData,
//   setFieldValue,
}: any) => {
  return (
    <SimpleGrid columns={[1, null, 2]} spacing={8}>
      <CustomInput
        label="Business Unit"
        name="businessUnit"
        type="select"
        options={bussinessUnitsData}
        value={values.businessUnit}
        onChange={(option) =>
          handleChange({
            target: { name: "businessUnit", value: option },
          })
        }
        error={touched.businessUnit && errors.businessUnit}
        showError={showError}
        required
      />

      <CustomInput
        label="Currency"
        name="currency"
        type="select"
        options={currenciesData}
        value={values.currency}
        onChange={(option) =>
          handleChange({
            target: { name: "currency", value: option },
          })
        }
        error={touched.currency && errors.currency}
        showError={showError}
        required
      />

      <CustomInput
        label="Amount"
        name="amount"
        type="number"
        value={values.amount}
        onChange={handleChange}
        error={touched.amount && errors.amount}
        showError={showError}
        required
      />

      <CustomInput
        label="Due Date"
        name="dueDate"
        type="date"
        value={values.dueDate}
        onChange={handleChange}
        error={touched.dueDate && errors.dueDate}
        showError={showError}
        required
      />
    </SimpleGrid>
  );
};

export default ForecastExposureFields;
