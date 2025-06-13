import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { FieldArray, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import CustomInput from "../../../../../../config/component/CustomInput/CustomInput";
import { mainCourseValidation } from "../../../utils/validation";
import store from "../../../../../../store/store";
import { NotesCategoryFormDto } from "../../../utils/dto";
import moment from "moment";
import {
  AmountTypeData,
  getCategoryError,
  initialCategoriesValues,
  setCategoryInitialValue,
} from "../../../utils/common";
import ShowFileUploadFile from "../../../../../../config/component/common/ShowFileUploadFile/ShowFileUploadFile";
import {
  insertUniqueFile,
  readFileAsBase64,
  removeDataByIndex,
} from "../../../../../../config/constant/function";
import { BiQuestionMark } from "react-icons/bi";
import SubmitFormBtn from "../../../../../../config/component/Button/SubmitFormBtn";

const MainNotesForm = observer(({ formData }: any) => {
  const [thumbnail, setThumbnail] = useState<any>([]);
  const {
    notesStore: { createCategory },
    auth: { openNotification },
  } = store;
  const [showError, setShowError] = useState(false);

  // const getEditorContentAsText = (data: any) => {
  //   const contentState: any = data;
  //   const plainText = contentState.getPlainText("\n");
  //   return plainText;
  // };

  console.log("this is current file")
  return (
    <Formik
      initialValues={setCategoryInitialValue(formData.data)}
      validationSchema={mainCourseValidation}
      onSubmit={async (
        values: NotesCategoryFormDto,
        { setSubmitting, resetForm }
      ) => {
        const buffer = await readFileAsBase64(thumbnail[0]);
        const fileData = {
          buffer: buffer,
          filename: thumbnail[0].name,
          type: thumbnail[0].type,
        };
        createCategory({
          ...values,
          pricingType: values.pricingType.value,
          amountType: values.amountType.value,
          startYear: moment(values.startYear).format("YYYY-MM-DD"),
          endYear: moment(values.endYear).format("YYYY-MM-DD"),
          // details: getEditorContentAsText(editorState.getCurrentContent()),
          thumbnail: fileData,
        })
          .then((data: any) => {
            openNotification({
              title: "Created Successfully",
              message: data?.message,
            });
            resetForm();
          })
          .catch((err) => {
            openNotification({
              title: "Create Failed",
              message: err?.message,
              type: "error",
            });
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      {({ values, handleChange, setFieldValue, errors, isSubmitting }) => {
        console.log(values)
        console.log(errors)
        return(
        <Form>
          <Flex flexDirection="column" justifyContent="space-between" m={-6}>
            <Box
              mt={1}
              p={5}
              overflowY="auto"
              overflowX={"hidden"}
              flex="1"
              minH="85vh"
              maxH={"85vh"}
            >
              <Grid>
                {thumbnail.length === 0 ? (
                  <CustomInput
                    type="file-drag"
                    name="thumbnail"
                    value={thumbnail}
                    isMulti={false}
                    onChange={(e: any) => {
                      insertUniqueFile(setThumbnail, thumbnail, e.target.files);
                    }}
                  />
                ) : (
                  <Box mt={-3} mb={3}>
                    <ShowFileUploadFile
                      files={thumbnail}
                      removeFile={(_: any, index: number) =>
                        setThumbnail(removeDataByIndex(thumbnail, index))
                      }
                    />
                  </Box>
                )}
                <Grid
                  gridTemplateColumns={{ sm: "1fr", md: "1fr 1fr" }}
                  gap={3}
                  mb={2}
                >
                  <CustomInput
                    name="title"
                    placeholder="Enter the Title"
                    label="Title"
                    required={true}
                    value={values.title}
                    onChange={handleChange}
                    error={errors.title}
                    showError={showError}
                  />
                  <CustomInput
                    name={`rating`}
                    type="number"
                    placeholder="Enter the Rating"
                    label="Rating"
                    required={true}
                    value={values.rating}
                    onChange={handleChange}
                    error={errors.rating}
                    showError={showError}
                    rest={{ max: 5, min: 1 }}
                  />
                </Grid>
                <Grid gap={2}>
                  <CustomInput
                    name="description"
                    type="textarea"
                    value={values.description}
                    placeholder="Write Description here"
                    label="Description"
                    required
                    rows={3}
                    onChange={handleChange}
                    showError={showError}
                    error={errors.description}
                  />
                </Grid>
              </Grid>
              <Flex gap={3} alignItems="center" mt={5} mb={5}>
                <Heading fontSize={"2xl"}>CREATE CATEGORIES</Heading>
                <Tooltip
                  placement="top-start"
                  hasArrow
                  label="Create Categories"
                >
                  <IconButton
                    size="sm"
                    icon={<BiQuestionMark size="1.7rem" />}
                    aria-label="section title"
                  />
                </Tooltip>
              </Flex>
              <FieldArray name="categories">
                {({ push, remove }) => (
                  <Box>
                    {values.categories.map((section: any, index: number) => {
                      return (
                        <Box key={index} mb="20px">
                          <Flex mb={5}>
                            {section?.thumbnail === ""? (
                              <CustomInput
                                type="file-drag"
                                name={`categories.${index}.thumbnail`}
                                value={section?.thumbnail}
                                isMulti={false}
                                onChange={(e: any) =>
                                  setFieldValue(
                                    `categories.${index}.thumbnail`,
                                    e.target.files[0]
                                  )
                                }
                              />
                            ) : (
                              <Box mt={-5} width="100%">
                                <ShowFileUploadFile
                                  files={section.thumbnail}
                                  removeFile={() => {
                                    setFieldValue(
                                      `categories.${index}.thumbnail`,
                                      ""
                                    );
                                  }}
                                />
                              </Box>
                            )}
                          </Flex>
                          <Grid
                            templateColumns={{ sm: "1fr", md: "1fr 1fr" }}
                            gap={3}
                          >
                            <CustomInput
                              label="Category"
                              type="text"
                              name={`categories.${index}.title`}
                              value={section.title}
                              onChange={handleChange}
                              placeholder="Enter the Title"
                              showError={showError}
                              error={getCategoryError(errors, "title", index)}
                            />
                            <CustomInput
                              name={`categories.${index}.rating`}
                              type="number"
                              placeholder="Enter the Rating"
                              label="Rating"
                              required={true}
                              value={section.rating}
                              onChange={handleChange}
                              error={getCategoryError(errors, "rating", index)}
                              showError={showError}
                            />
                            <CustomInput
                              name={`categories.${index}.pricingType`}
                              placeholder="Select the Pricing Type"
                              label="Pricing Type"
                              type="select"
                              value={section.pricingType}
                              options={[
                                { value: "free", label: "Free" },
                                { value: "paid", label: "Paid" },
                              ]}
                              required={true}
                              onChange={(e: any) => {
                                setFieldValue(
                                  `categories.${index}.pricingType`,
                                  e
                                );
                              }}
                              error={getCategoryError(
                                errors,
                                "pricingType",
                                index
                              )}
                              showError={showError}
                            />
                            <CustomInput
                              name={`categories.${index}.amountType`}
                              placeholder="Select the Amount Type"
                              label="Amount Type"
                              type="select"
                              value={section.amountType}
                              options={AmountTypeData}
                              required={true}
                              onChange={(e: any) => {
                                setFieldValue(
                                  `categories.${index}.amountType`,
                                  e
                                );
                              }}
                              error={getCategoryError(
                                errors,
                                "amountType",
                                index
                              )}
                              showError={showError}
                            />
                            <CustomInput
                              type="number"
                              name={`categories.${index}.originalPrice`}
                              placeholder="Enter the Original Price"
                              label="Orignal Price"
                              required={true}
                              value={section.originalPrice}
                              onChange={handleChange}
                              error={getCategoryError(
                                errors,
                                "originalPrice",
                                index
                              )}
                              showError={showError}
                            />
                            <CustomInput
                              type="number"
                              name={`categories.${index}.discountPrice`}
                              placeholder="Enter the Discount Price"
                              label="Discount Price"
                              required={true}
                              value={section.discountPrice}
                              onChange={handleChange}
                              error={getCategoryError(
                                errors,
                                "discountPrice",
                                index
                              )}
                              showError={showError}
                            />
                          </Grid>
                          <CustomInput
                            label="Description"
                            type="textarea"
                            name={`categories.${index}.description`}
                            value={section.description}
                            onChange={handleChange}
                            required={true}
                            placeholder="Description"
                            showError={showError}
                            error={getCategoryError(
                              errors,
                              "description",
                              index
                            )}
                          />
                          <Button
                            colorScheme="red"
                            variant="outline"
                            size="sm"
                            mt="10px"
                            onClick={() => remove(index)}
                          >
                            Remove Section
                          </Button>
                        </Box>
                      );
                    })}
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      size="sm"
                      mb="10px"
                      onClick={() => push(initialCategoriesValues(null))}
                    >
                      Add Category
                    </Button>
                  </Box>
                )}
              </FieldArray>
            </Box>
          </Flex>
            <SubmitFormBtn
              loading={isSubmitting}
              type="submit"
              onClick={() => setShowError(true)}
            />
        </Form>
      )}}
    </Formik>
  );
});

export default MainNotesForm;
