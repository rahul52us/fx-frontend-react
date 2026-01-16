import {
    Box,
    Button,
    Flex,
    IconButton,
    SimpleGrid,
    Stack,
    Text,
} from "@chakra-ui/react";
import { FieldArray } from "formik";
import { MdDelete } from "react-icons/md";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";

interface Props {
  values: any;
  setFieldValue: any;
  exposureRefOptions: any[];
  fetchExposureData: (value: string) => any;
}

const ExposureRefSelector = ({
  values,
  setFieldValue,
  exposureRefOptions,
  fetchExposureData,
}: Props) => {
  return (
    <FieldArray name="exposureRefs">
      {({ push, remove }) => (
        <Stack spacing={4}>
          {/* Add Button */}
     

          {/* Exposure Cards */}
          {values.exposureRefs?.map((_: any, index: number) => (
            <Box
              key={index}
              p={4}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              bg="gray.50"
              position="relative"
            >
              <IconButton
                aria-label="remove"
                icon={<MdDelete />}
                size="sm"
                colorScheme="red"
                variant="ghost"
                position="absolute"
                top={2}
                right={2}
                onClick={() => remove(index)}
              />

              <Text fontWeight="600" mb={3}>
                Exposure #{index + 1}
              </Text>

              <SimpleGrid columns={[1, null, 2]} spacing={4}>
                <CustomInput
                  label="Exposure Ref Number"
                  name="exposureRefNumber"
                  type="select"
                  options={exposureRefOptions}
                  value={exposureRefOptions.find(
                    (o) =>
                      o.value === values.exposureRefs[index].exposureRefNumber
                  )}
                  onChange={(selected: any) => {
                    const data = fetchExposureData(selected.value);

                    setFieldValue(
                      `exposureRefs.${index}.exposureRefNumber`,
                      selected.value
                    );
                    setFieldValue(
                      `exposureRefs.${index}.outStandingAmount`,
                      data.outStandingAmount
                    );
                    setFieldValue(
                      `exposureRefs.${index}.rmPolicyRate`,
                      data.rmPolicyRate
                    );
                    setFieldValue(
                      `exposureRefs.${index}.dueDate`,
                      data.dueDate
                    );
                  }}
                />

                <CustomInput
                name="outStandingAmount"
                  label="Outstanding Amount"
                  value={values.exposureRefs[index].outStandingAmount}
                  disabled
                />

                <CustomInput
                name="rmPolicyRate"
                  label="RM Policy Rate"
                  value={values.exposureRefs[index].rmPolicyRate}
                  disabled
                />

                <CustomInput
                name="dueDate"
                  label="Due Date"
                  value={values.exposureRefs[index].dueDate}
                  disabled
                />

                <CustomInput
                  label="Allocated Amount"
                  name="allocatedAmount"
                  type="number"
                  value={values.exposureRefs[index].allocatedAmount}
                  onChange={(e: any) =>
                    setFieldValue(
                      `exposureRefs.${index}.allocatedAmount`,
                      e.target.value
                    )
                  }
                />
              </SimpleGrid>
            </Box>
          ))}

          <Flex justify={'end'}>


               <Button
            size="sm"
            variant="outline"
            colorScheme="blue"
            alignSelf="flex-start"
            onClick={() =>
              push({
                  exposureRefNumber: "",
                outStandingAmount: "",
                rmPolicyRate: "",
                dueDate: "",
                allocatedAmount: "",
            })
        }
        >
            + Add Exposure Ref
          </Button>
              </Flex>
        </Stack>
      )}
    </FieldArray>
  );
};

export default ExposureRefSelector;
