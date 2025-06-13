import { useState, useEffect } from "react";
import {
  Box,
  Button,
  useColorModeValue,
  Heading,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { Formik, Form } from "formik";
import debounce from "lodash/debounce";
import store from "../../../../../store/store";
import { getOrganisationCreateValidation } from "../utils/validations";
import OrganisationLinks from "./OrganisationLinks";
import OrganisationInfo from "./OrganisationInfo";
import OrganisationUserPersonalInfo from "./OrganisationUserPersonalInfo";
import { onBoardingTitle } from "../utils/constant";

const CreateOrganisationPersonalDetails = observer(
  ({
    initialValues,
    handleSubmit,
    activeIndex,
    setActiveIndex,
    steps,
    singleCompany,
    isEdit
  }: any) => {
    const [showError, setShowError] = useState(false);
    const [organisationError, setOrganisationError] = useState("");
    const {
      Organisation: { filterOrganisations },
    } = store;

    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
      const debouncedSearch = debounce((value) => {
        filterOrganisations(value)
          .then(() => {
            setOrganisationError("");
          })
          .catch((err : any) => {
            setOrganisationError(err.message);
          });
      }, 1500);

      debouncedSearch(searchValue);

      // Cleanup the debounced function on unmount
      return () => {
        debouncedSearch.cancel();
      };
    }, [searchValue, filterOrganisations]);

    const handleSearchChange = (e: any) => {
      const value = e.target.value;
      setSearchValue(value);
    };

    return (
      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={4}
      >
        <Heading fontSize="xl" mb={4}>
          {onBoardingTitle[activeIndex]}
        </Heading>
        <Divider />
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={getOrganisationCreateValidation(isEdit)}
          onSubmit={(values, { setSubmitting }) => {
            if (!organisationError) {
              handleSubmit({ values: values, setSubmitting: setSubmitting });
            }
          }}
        >
          {({
            handleSubmit,
            handleChange,
            setFieldValue,
            errors,
            values,
            isSubmitting,
          }) => {
            return(
            <Form
              onSubmit={handleSubmit}
              style={{
                minHeight: "95%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box display={activeIndex === 0 ? undefined : "none"}>
                <OrganisationUserPersonalInfo
                  values={values}
                  organisationError={organisationError}
                  handleSearchChange={handleSearchChange}
                  errors={errors}
                  handleChange={handleChange}
                  showError={showError}
                  isEdit={isEdit}
                />
              </Box>
              <Box display={activeIndex === 1 ? undefined : "none"}>
                <OrganisationInfo
                  values={values}
                  errors={errors}
                  handleChange={handleChange}
                  showError={showError}
                  organisationError={organisationError}
                  handleSearchChange={handleSearchChange}
                  setFieldValue={setFieldValue}
                  singleCompany={singleCompany}
                  isEdit={isEdit}
                />
              </Box>
              <Box display={activeIndex === 2 ? undefined : "none"}>
                <OrganisationLinks
                  values={values}
                  errors={errors}
                  handleChange={handleChange}
                  showError={showError}
                  setFieldValue={setFieldValue}
                />
              </Box>
              <Box></Box>
              <Flex justifyContent="end" columnGap={4} mb={1}>
                <Button
                  disabled
                  bg={"blue.400"}
                  color={"white"}
                  w={120}
                  _hover={{
                    bg: "blue.500",
                  }}
                  display={activeIndex === 0 ? "none" : undefined}
                  isLoading={isSubmitting}
                  onClick={() => {
                    setActiveIndex(activeIndex - 1);
                    setShowError(true);
                  }}
                >
                  Back
                </Button>
                <Button
                  disabled
                  type="submit"
                  bg={"blue.400"}
                  color={"white"}
                  w={120}
                  _hover={{
                    bg: "blue.500",
                  }}
                  display={activeIndex === steps.length - 1 ? undefined : "none"}
                  isLoading={isSubmitting}
                  onClick={() => {
                    setShowError(true);
                  }}
                >
                  Submit
                </Button>
                <Button
                  disabled
                  bg={"blue.400"}
                  w={120}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  display={
                    activeIndex === steps.length - 1 ? "none" : undefined
                  }
                  onClick={() => {
                    setShowError(true);
                    setActiveIndex(activeIndex + 1);
                  }}
                >
                  Next
                </Button>
              </Flex>
            </Form>
          )}}
        </Formik>
      </Box>
    );
  }
);

export default CreateOrganisationPersonalDetails;