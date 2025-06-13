import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import { FieldArray, Form, Formik } from "formik";
import CustomInput from "../../../../../../../config/component/CustomInput/CustomInput";
import { titles } from "../../utils/constant";
import SubmitFormBtn from "../../../../../../../config/component/Button/SubmitFormBtn";
// import ShowFileUploadFile from "../../../../../../../config/component/common/ShowFileUploadFile/ShowFileUploadFile";
import {
  readFileAsBase64,
  removeDataByIndex,
} from "../../../../../../../config/constant/function";
import { FiCamera, FiTrash } from "react-icons/fi";

const PersonalDetailsForm = ({
  type,
  handleSubmitProfile,
  initialValues,
  validations,
}: any) => {
  const [showError, setShowError] = useState(false);

  const getAddressError = (errors: any, type: string, index: number) => {
    const errorTypes = ["address", "country", "state", "city", "pinCode"];
    if (errors.addressInfo && errors.addressInfo[index]) {
      const errorTypeIndex = errorTypes.indexOf(type);
      if (errorTypeIndex !== -1) {
        return errors.addressInfo[index][errorTypes[errorTypeIndex]];
      }
    }
    return undefined;
  };

  return (
    <Formik
      validationSchema={validations}
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting, resetForm, setErrors }) => {
        handleSubmitProfile({
          values,
          setSubmitting,
          resetForm,
          setErrors,
          setShowError,
        });
      }}
    >
      {({
        values,
        errors,
        setFieldValue,
        handleChange,
        handleSubmit,
        isSubmitting,
      }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <Box p={4} borderRadius="lg" boxShadow="md">
              <Grid>
                <Heading color="#002058" fontSize="xl" mb={4}>
                  Personal Information :-
                </Heading>
                <Divider />

                <Flex direction="column" align="center" p={1}>
                  {values?.pic?.file?.length === 0 ? (
                    <Box textAlign="center">
                      <label htmlFor="pic-upload" style={{ cursor: "pointer" }}>
                        <Box position="relative">
                          <Avatar
                            src={values.pic?.file?.url || values.pic?.url}
                            width="160px"
                            height="160px"
                            cursor="pointer"
                            aria-label={`${values.firstName} ${values.lastName}`}
                            mb={4}
                            borderRadius="full"
                            boxShadow="sm"
                          />
                          <IconButton
                            icon={<FiCamera />}
                            aria-label="Upload Picture"
                            size="sm"
                            title="upload picture"
                            colorScheme="teal"
                            position="absolute"
                            bottom={4}
                            right={2}
                            borderRadius="full"
                            onClick={() => {
                              const input = document.getElementById(
                                "pic-upload"
                              ) as HTMLInputElement;
                              if (input) {
                                input.click();
                              }
                            }}
                          />
                        </Box>
                        <input
                          id="pic-upload"
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={async (e: any) => {
                            const url = await readFileAsBase64(
                              e.target.files[0]
                            );
                            setFieldValue("pic", {
                              ...values.pic,
                              file: e.target.files[0],
                              isEdited: type === "edit" ? true : false,
                              url: url,
                              isAdd : 1
                            });
                          }}
                        />
                      </label>
                    </Box>
                  ) : (
                    <Box position="relative">
                      <Flex
                        justify="center"
                        align="center"
                        direction="column"
                        position="relative"
                      >
                        <Avatar
                          width="160px"
                          height="160px"
                          src={values.pic?.url || values?.pic?.file?.url}
                          aria-label={`${values.firstName} ${values.lastName}`}
                          mb={4}
                          borderRadius="full"
                          boxShadow="sm"
                        />
                        <Box position="absolute" bottom={3} right={0}>
                          <IconButton
                            icon={<FiTrash />}
                            aria-label="Remove Picture"
                            size="sm"
                            title="remove picture"
                            colorScheme="red"
                            borderRadius="full"
                            onClick={() => {
                              setFieldValue("pic", {
                                ...values.pic,
                                file: removeDataByIndex(values.pic, 0),
                                url: undefined,
                                isDeleted: 1,
                                isEdited: type === "edit" ? true : false,
                              });
                            }}
                          />
                        </Box>
                      </Flex>
                    </Box>
                  )}
                </Flex>

                <Grid
                  gridTemplateColumns={{
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                    xl: "1fr 1fr 1fr 1fr",
                  }}
                  columnGap={4}
                  rowGap={2}
                  mb={5}
                >
                  <CustomInput
                    name="title"
                    type="select"
                    placeholder="Enter the Title"
                    label="Title"
                    value={values.title}
                    error={errors.title}
                    showError={showError}
                    options={titles}
                    onChange={(e) => {
                      setFieldValue("title", e);
                      console.log(e);
                    }}
                  />
                  <CustomInput
                    name="firstName"
                    type="text"
                    placeholder="Enter the First Name"
                    label="First Name"
                    value={values.firstName}
                    error={errors.firstName}
                    showError={showError}
                    onChange={handleChange}
                    required
                  />
                  <CustomInput
                    name="lastName"
                    type="text"
                    placeholder="Enter the Last Name"
                    label="Last Name"
                    value={values.lastName}
                    error={errors.lastName}
                    onChange={handleChange}
                    showError={showError}
                    required
                  />
                  <CustomInput
                    name="username"
                    type="text"
                    placeholder="Username"
                    label="UserName"
                    value={values?.username}
                    error={errors.username}
                    onChange={handleChange}
                    showError={showError}
                    required
                    readOnly={type === "edit" ? true : false}
                  />
                  <CustomInput
                    type="text"
                    label="Personal Email"
                    name="personalEmail"
                    placeholder="Enter the Personal Email"
                    value={values.personalEmail}
                    error={errors.personalEmail}
                    showError={showError}
                    onChange={handleChange}
                  />
                  <CustomInput
                    name="code"
                    type="text"
                    placeholder="E-Code"
                    label="E-Code"
                    value={values?.code}
                    error={errors.code}
                    onChange={handleChange}
                    showError={showError}
                    required
                    // readOnly={type === "edit" ? true : false}
                  />
                  <CustomInput
                    type="text"
                    label="Nick Name"
                    name="nickName"
                    placeholder="Enter the Nick name"
                    value={values.nickName}
                    error={errors.nickName}
                    showError={showError}
                    onChange={handleChange}
                  />
                  <CustomInput
                    type="date"
                    label="Dob"
                    name="dob"
                    placeholder="Select Date Of Birth"
                    value={values.dob}
                    error={errors.dob}
                    showError={showError}
                    onChange={(e: any) => {
                      setFieldValue("dob", e);
                    }}
                  />
                  <CustomInput
                    type="text"
                    label="Marital Status"
                    name="maritalStatus"
                    placeholder="Enter the MaritalStatus"
                    value={values.maritalStatus}
                    error={errors.maritalStatus}
                    showError={showError}
                    onChange={handleChange}
                  />
                  <CustomInput
                    type="phone"
                    label="Phone Number"
                    name="mobileNo"
                    placeholder="Mobile No"
                    value={values.mobileNo}
                    error={errors.mobileNo}
                    showError={showError}
                    onChange={(e: any) => {
                      setFieldValue("mobileNo", e);
                    }}
                    required
                  />
                  <CustomInput
                    type="phone"
                    label="Emergency Number"
                    name="emergencyNo"
                    value={values.emergencyNo}
                    error={errors.emergencyNo}
                    placeholder="Emergency No"
                    showError={showError}
                    onChange={(e: any) => {
                      setFieldValue("emergencyNo", e);
                    }}
                  />
                  <CustomInput
                    type="text"
                    label="Blood Group"
                    name="bloodGroup"
                    value={values.bloodGroup}
                    error={errors.bloodGroup}
                    placeholder="BloodGroup"
                    showError={showError}
                    onChange={handleChange}
                  />
                  <CustomInput
                    type="text"
                    label="Aadhar No."
                    name="aadharNo"
                    value={values.aadharNo}
                    error={errors.aadharNo}
                    placeholder="Aadhar No"
                    showError={showError}
                    onChange={handleChange}
                  />
                  <CustomInput
                    type="text"
                    label="Pan No."
                    name="panNo"
                    value={values.panNo}
                    error={errors.panNo}
                    placeholder="Pan No"
                    showError={showError}
                    onChange={handleChange}
                  />
                  <CustomInput
                    type="text"
                    label="PfUan Number"
                    name="pfUanNo"
                    value={values.pfUanNo}
                    error={errors.pfUanNo}
                    placeholder="pfUan No"
                    showError={showError}
                    onChange={handleChange}
                  />
                  <CustomInput
                    type="text"
                    label="Insurance CardNo"
                    name="insuranceCardNo"
                    value={values.insuranceCardNo}
                    error={errors.insuranceCardNo}
                    placeholder="Insurance CardNo"
                    showError={showError}
                    onChange={handleChange}
                  />
                  <CustomInput
                    type="text"
                    label="Reffered By"
                    name="refferedBy"
                    value={values.refferedBy}
                    error={errors.refferedBy}
                    placeholder="Reffered By"
                    showError={showError}
                    onChange={handleChange}
                  />
                  <CustomInput
                    type="text"
                    label="Medical Certificate Details"
                    name="medicalCertificationDetails"
                    value={values.medicalCertificationDetails}
                    error={errors.medicalCertificationDetails}
                    placeholder="Medical Certificate Details"
                    showError={showError}
                    onChange={handleChange}
                  />
                  <CustomInput
                    type="date"
                    label="Wedding Date"
                    name="medicalCertificationDetails"
                    value={values.weddingDate}
                    error={errors.weddingDate}
                    placeholder="Wedding Date"
                    showError={showError}
                    onChange={(e: any) => {
                      setFieldValue("weddingDate", e);
                    }}
                  />
                  <CustomInput
                    name="language"
                    type="select"
                    placeholder="Select the language"
                    label="Language"
                    isMulti={true}
                    value={values?.language}
                    error={errors.language}
                    options={[
                      {
                        value: "english",
                        label: "english",
                      },
                      {
                        value: "hindi",
                        label: "hindi",
                      },
                    ]}
                    onChange={(e) => {
                      setFieldValue("language", e);
                    }}
                    showError={showError}
                    readOnly={type === "edit" ? true : false}
                  />
                </Grid>
                <Grid mb={4}>
                  <CustomInput
                    type="textarea"
                    label="Bio"
                    name="bio"
                    placeholder="Bio"
                    value={values.bio}
                    error={errors.bio}
                    showError={showError}
                    onChange={handleChange}
                  />
                </Grid>
                {type === "create" && (
                  <Grid>
                    <Heading color="#002058" fontSize="xl" mb={4}>
                      Add Credential :-
                    </Heading>
                    <Divider />
                    <Grid
                      gridTemplateColumns={{ md: "1fr 1fr" }}
                      columnGap={5}
                      rowGap={3}
                      mb={5}
                    >
                      <CustomInput
                        name="password"
                        type="password"
                        placeholder="Enter the Password"
                        label="Password"
                        value={values.password}
                        error={errors.password}
                        showError={showError}
                        onChange={handleChange}
                        required
                      />
                      <CustomInput
                        name="confirmPassword"
                        type="password"
                        placeholder="Enter the Password"
                        label="Confirm Password"
                        value={values.confirmPassword}
                        error={errors.confirmPassword}
                        showError={showError}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                  </Grid>
                )}
                <Heading color="#002058" fontSize="xl" mb={4}>
                  Address Information :-
                </Heading>
                <Divider />
                <Grid columnGap={5} rowGap={3} mb={5}>
                  <FieldArray name="addressInfo">
                    {({ push, remove }) => (
                      <Box>
                        {values.addressInfo && values.addressInfo.map((add: any, index: number) => (
                          <div key={index}>
                            <Grid
                              gridTemplateColumns={{ md: "1fr 1fr 1fr" }}
                              gap={2}
                              key={index}
                              mb="20px"
                            >
                              <CustomInput
                                name={`addressInfo.${index}.address`}
                                type="text"
                                placeholder="Address"
                                label="Address"
                                value={add.address}
                                required
                                showError={showError}
                                error={getAddressError(
                                  errors,
                                  "address",
                                  index
                                )}
                                onChange={handleChange}
                              />
                              <CustomInput
                                name={`addressInfo.${index}.country`}
                                type="text"
                                placeholder="Country"
                                label="Country"
                                value={add.country}
                                required
                                showError={showError}
                                error={getAddressError(
                                  errors,
                                  "country",
                                  index
                                )}
                                onChange={handleChange}
                              />
                              <CustomInput
                                name={`addressInfo.${index}.state`}
                                type="text"
                                placeholder="State"
                                label="State"
                                value={add.state}
                                required
                                showError={showError}
                                error={getAddressError(errors, "state", index)}
                                onChange={handleChange}
                              />
                              <CustomInput
                                name={`addressInfo.${index}.city`}
                                type="text"
                                placeholder="City"
                                label="City"
                                value={add.city}
                                required
                                showError={showError}
                                error={getAddressError(errors, "city", index)}
                                onChange={handleChange}
                              />
                              <CustomInput
                                name={`addressInfo.${index}.pinCode`}
                                type="text"
                                placeholder="PinCode"
                                label="PinCode"
                                value={add.pinCode}
                                required
                                showError={showError}
                                error={getAddressError(
                                  errors,
                                  "pinCode",
                                  index
                                )}
                                onChange={handleChange}
                              />
                            </Grid>
                            {values.addressInfo.length > 1 && (
                              <Button
                                colorScheme="red"
                                variant="outline"
                                size="sm"
                                mt="10px"
                                onClick={() => remove(index)}
                              >
                                Remove Section
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          colorScheme="blue"
                          variant="outline"
                          display="block"
                          size="sm"
                          mb="10px"
                          mt={5}
                          onClick={() =>
                            push({
                              address: "",
                              country: "",
                              state: "",
                              city: "",
                              pinCode: "",
                            })
                          }
                        >
                          Add Section
                        </Button>
                      </Box>
                    )}
                  </FieldArray>
                </Grid>
              </Grid>
                <SubmitFormBtn
                  loading={isSubmitting}
                  onClick={() => {
                    setShowError(true);
                  }}
                />
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default PersonalDetailsForm;
