import {
  Box,
  Button,
  FormLabel,
  Select,
  Grid,
  GridItem,
  VStack,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { Formik, Field, Form, FieldArray } from "formik";
import * as Yup from "yup";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";
import { observer } from "mobx-react-lite";


const validationSchema = Yup.object().shape({
  effectiveFrom: Yup.string().typeError("effective from date is required"),
  disbursementFrom: Yup.string().typeError("disbursement from is Required"),
  salaryComponents: Yup.array().of(
    Yup.object().shape({
      head: Yup.string().required("title is Required"),
      monthlyValue: Yup.number().typeError("Monthly Value is Required"),
      yearlyValue: Yup.number().typeError("Yearly Value is Required"),
      frequency: Yup.string()
        .oneOf(["Monthly", "Yearly"])
        .typeError("please select the frequency"),
    })
  ),
  benefits: Yup.array().of(
    Yup.object().shape({
      head: Yup.string().required("title is Required"),
      monthlyValue: Yup.number().typeError("Monthly value is Required"),
      yearlyValue: Yup.number().typeError("Yearly value is Required"),
      frequency: Yup.string()
        .oneOf(["Monthly", "Yearly"])
        .typeError("please select the Required"),
    })
  ),
  grossSalary: Yup.object().shape({
    monthly: Yup.number().required("Gross Monthly Salary is Required"),
    yearly: Yup.number().required("Gross Yearly Salary is Required"),
  }),
  ctc: Yup.object().shape({
    monthly: Yup.number().required("CTC Monthly salary is Required"),
    yearly: Yup.number().required("CTC Yearly salary is Required"),
  }),
  inHandSalary: Yup.number().typeError("In HandSalary is Required"),
  remarks: Yup.string(),
});

const getError = (errors: any, errorType: any, type: string, index: number) => {
    const errorTypes = ["head", "monthlyValue", "yearlyValue", "frequency"];
    if (errors[errorType] && errors[errorType][index]) {
      const errorTypeIndex = errorTypes.indexOf(type);
      if (errorTypeIndex !== -1 && errors[errorType][index][errorTypes[errorTypeIndex]]) {
        return errors[errorType][index][errorTypes[errorTypeIndex]];
      }
    }
    return undefined;
  };


const SalaryStructureForm = observer(({initialValues, showError, setShowError, handleSubmit} : any) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const formControlBorderColor = useColorModeValue("teal.300", "teal.600");
  const headingColor = useColorModeValue("teal.500", "teal.200");

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, {resetForm, setSubmitting}) => {
        handleSubmit({values, resetForm, setSubmitting})
      }}
    >
      {({ values, handleChange, setFieldValue, errors, isSubmitting } : any) => {
        return (
          <Form>
            <Box bg={bgColor} p={4} rounded="md" shadow="lg" mx="auto">
              <Heading
                as="h3"
                size="lg"
                mb={6}
                textAlign="center"
                color={headingColor}
              >
                Salary Structure Form
              </Heading>

              <VStack spacing={6} align="stretch">
                {/* Effective Date Fields */}
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={6}
                >
                  <CustomInput
                    label="Effective From"
                    type="date"
                    name="effectiveFrom"
                    onChange={(e: any) => setFieldValue("effectiveFrom", e)}
                    value={values.effectiveFrom}
                    placeholder="Select Effective From"
                  />

                  <CustomInput
                    label="Disbursement From"
                    type="date"
                    name="disbursementFrom"
                    onChange={(e: any) => setFieldValue("disbursementFrom", e)}
                    value={values.disbursementFrom}
                    placeholder="Select Disbursement From"
                    minDate={values.effectiveFrom}
                    disabled={!values.effectiveFrom}
                  />
                </Grid>

                {/* Salary Components Section */}
                <FieldArray name="salaryComponents">
                  {({ push, remove }) => (
                    <Box>
                      <FormLabel fontWeight="bold">Salary Details</FormLabel>
                      {values.salaryComponents.map((item: any, index : number) => (
                        <Grid
                          templateColumns={{
                            base: "1fr",
                            md: "repeat(5, 1fr)",
                          }}
                          gap={4}
                          mb={4}
                          key={index}
                        >
                          <GridItem>
                            <CustomInput
                              name={`salaryComponents.${index}.head`}
                              value={item.head}
                              placeholder="Title"
                              onChange={(e) =>
                                setFieldValue(
                                  `salaryComponents.${index}.head`,
                                  e.target.value
                                )
                              }
                              error={getError(
                                errors,
                                "salaryComponents",
                                "head",
                                index
                              )}
                              showError={showError}
                            />
                          </GridItem>
                          <GridItem>
                            <CustomInput
                              type="number"
                              name={`salaryComponents.${index}.monthlyValue`}
                              value={item.monthlyValue}
                              placeholder="Monthly Value"
                              onChange={(e) =>
                                setFieldValue(
                                  `salaryComponents.${index}.monthlyValue`,
                                  e.target.value
                                )
                              }
                              error={getError(
                                errors,
                                "salaryComponents",
                                "monthlyValue",
                                index
                              )}
                              showError={showError}
                            />
                          </GridItem>
                          <GridItem>
                            <CustomInput
                              type="number"
                              name={`salaryComponents.${index}.yearlyValue`}
                              value={item.yearlyValue}
                              placeholder="Yearly Value"
                              onChange={(e) =>
                                setFieldValue(
                                  `salaryComponents.${index}.yearlyValue`,
                                  e.target.value
                                )
                              }
                              error={getError(
                                errors,
                                "salaryComponents",
                                "yearlyValue",
                                index
                              )}
                              showError={showError}
                            />
                          </GridItem>
                          <GridItem mt={2}>
                            <Field
                              name={`salaryComponents.${index}.frequency`}
                              as={Select}
                              bg="gray.50"
                              borderColor={formControlBorderColor}
                              _focus={{ borderColor: "teal.500" }}
                            >
                              <option value="Monthly">Monthly</option>
                              <option value="Yearly">Yearly</option>
                            </Field>
                          </GridItem>
                          <GridItem mt={2}>
                            <Button
                              onClick={() => remove(index)}
                              colorScheme="red"
                              variant="outline"
                            >
                              Remove
                            </Button>
                          </GridItem>
                        </Grid>
                      ))}
                      <Button
                        mt={2}
                        onClick={() =>
                          push({
                            head: "",
                            monthlyValue: 0,
                            yearlyValue: 0,
                            frequency: "Monthly",
                          })
                        }
                        colorScheme="teal"
                        variant="outline"
                      >
                        Add Salary Details
                      </Button>
                    </Box>
                  )}
                </FieldArray>

                {/* Benefits Section */}
                <FieldArray name="benefits">
                  {({ push, remove }) => (
                    <Box>
                      <FormLabel fontWeight="bold">Benefits</FormLabel>
                      {values.benefits.map((benefit: any, index : number) => (
                        <Grid
                          templateColumns={{
                            base: "1fr",
                            md: "repeat(5, 1fr)",
                          }}
                          gap={4}
                          mb={4}
                          key={index}
                        >
                          <GridItem>
                            <CustomInput
                              placeholder="Title"
                              value={benefit?.head}
                              name={`benefits.${index}.head`}
                              onChange={(e) =>
                                setFieldValue(
                                  `benefits.${index}.head`,
                                  e.target.value
                                )
                              }
                              error={getError(
                                errors,
                                "benefits",
                                "head",
                                index
                              )}
                              showError={showError}
                            />
                          </GridItem>
                          <GridItem>
                            <CustomInput
                              placeholder="Monthly Value"
                              value={benefit?.monthlyValue}
                              name={`benefits.${index}.monthlyValue`}
                              onChange={(e) =>
                                setFieldValue(
                                  `benefits.${index}.monthlyValue`,
                                  e.target.value
                                )
                              }
                              error={getError(
                                errors,
                                "benefits",
                                "monthlyValue",
                                index
                              )}
                              showError={showError}
                            />
                          </GridItem>
                          <GridItem>
                            <CustomInput
                              placeholder="Yearly Value"
                              value={benefit?.yearlyValue}
                              name={`benefits.${index}.yearlyValue`}
                              onChange={(e) =>
                                setFieldValue(
                                  `benefits.${index}.yearlyValue`,
                                  e.target.value
                                )
                              }
                              error={getError(
                                errors,
                                "benefits",
                                "yearlyValue",
                                index
                              )}
                              showError={showError}
                            />
                          </GridItem>
                          <GridItem mt={2}>
                            <Field
                              name={`benefits.${index}.frequency`}
                              as={Select}
                              bg="gray.50"
                              borderColor={formControlBorderColor}
                              _focus={{ borderColor: "teal.500" }}
                            >
                              <option value="Monthly">Monthly</option>
                              <option value="Yearly">Yearly</option>
                            </Field>
                          </GridItem>
                          <GridItem mt={2}>
                            <Button
                              onClick={() => remove(index)}
                              colorScheme="red"
                              variant="outline"
                            >
                              Remove
                            </Button>
                          </GridItem>
                        </Grid>
                      ))}
                      <Button
                        mt={2}
                        onClick={() =>
                          push({
                            head: "",
                            monthlyValue: 0,
                            yearlyValue: 0,
                            frequency: "Monthly",
                          })
                        }
                        colorScheme="teal"
                        variant="outline"
                      >
                        Add Benefit
                      </Button>
                    </Box>
                  )}
                </FieldArray>

                {/* Additional Fields */}
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={4}
                >
                  <CustomInput
                    name="grossSalary.monthly"
                    onChange={handleChange}
                    value={values.grossSalary.monthly}
                    placeholder="Gross Salary - Monthly"
                    label="Gross Salary - Monthly"
                    showError={showError}
                    error={errors.grossSalary?.monthly}
                  />
                  <CustomInput
                    name="grossSalary.yearly"
                    onChange={handleChange}
                    value={values.grossSalary.yearly}
                    placeholder="Gross Salary - Yearly"
                    label="Gross Salary - Yearly"
                    showError={showError}
                    error={errors.grossSalary?.yearly}
                  />
                </Grid>

                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={4}
                >
                  <CustomInput
                    name="ctc.monthly"
                    onChange={handleChange}
                    value={values.ctc.monthly}
                    placeholder="CTC - Monthly"
                    label="CTC - Monthly"
                    error={errors.ctc?.monthly}
                    showError={showError}
                  />
                  <CustomInput
                    name="ctc.yearly"
                    onChange={handleChange}
                    value={values.ctc.yearly}
                    placeholder="CTC - Yearly"
                    label="CTC - Yearly"
                    error={errors.ctc?.yearly}
                    showError={showError}
                  />
                </Grid>

                <CustomInput
                  name="inHandSalary"
                  onChange={handleChange}
                  value={values.inHandSalary}
                  placeholder="In Hand Salary"
                  label="InHand Salary"
                  error={errors.inHandSalary}
                  showError={showError}
                />

                <CustomInput
                  type="textarea"
                  name="remarks"
                  onChange={handleChange}
                  value={values.remarks}
                  placeholder="Remark"
                  label="Remark"
                  error={errors.remarks}
                  showError={showError}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  colorScheme="teal"
                  variant="solid"
                  mt={6}
                  width="full"
                  isLoading={isSubmitting}
                  onClick={() => setShowError(true)}
                >
                  Submit
                </Button>
              </VStack>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
});

export default SalaryStructureForm;
