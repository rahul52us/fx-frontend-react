import { Box, Button, Divider, Flex, Grid, Heading } from "@chakra-ui/react";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";
import { FieldArray } from "formik";
import ShowFileUploadFile from "../../../../../config/component/common/ShowFileUploadFile/ShowFileUploadFile";
import { removeDataByIndex } from "../../../../../config/constant/function";

const OrganisationInfo = ({
  values,
  handleChange,
  errors,
  showError,
  handleSearchChange,
  organisationError,
  setFieldValue,
  isEdit
}: any) => {
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
    <Grid height="68vh" overflowY="auto">
      <Flex>
					{values?.logo?.length === 0 ? (
					<CustomInput
						type="file-drag"
						name="logo"
						value={values.logo}
						isMulti={true}
						accept="image/*"
						onChange={(e: any) => {
              setFieldValue('logo',e.target.files[0])
              if(isEdit){
                setFieldValue('isLogoEdit',true)
              }
						}}
            required={true}
            showError={showError}
            error={errors.logo}
					/>
					) : (
					<Box mt={-5} width="100%">
						<ShowFileUploadFile
						files={values.logo}
						removeFile={(_: any) => {
							setFieldValue('logo',removeDataByIndex(values.logo, 0))
              if(isEdit){
                if(values?.logo?.name){
                  setFieldValue('deletedLogo',[values?.logo?.name])
                }
              }
						}
						}
            edit={isEdit}
						/>
					</Box>
					)}
				</Flex>
      <Grid gap={2} gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}>
        <CustomInput
          type="text"
          name="company_name"
          label="Organisation Name"
          placeholder="Enter the Organisation Name"
          required={true}
          error={errors.company_name || organisationError}
          onChange={(e: any) => {
            handleSearchChange(e);
            handleChange(e);
          }}
          value={values.company_name}
          showError={showError}
        />
        <CustomInput
          type="text"
          name="companyCode"
          label="Company Code"
          placeholder="Enter the Company Code"
          required={true}
          error={errors.companyCode}
          onChange={handleChange}
          value={values.companyCode}
          showError={showError}
        />
        <CustomInput
          type="phone"
          name="Mobile No"
          label="Mobile No"
          placeholder="Mobile No"
          required={true}
          error={errors.mobileNo}
          onChange={(e) => {
            setFieldValue("mobileNo", e);
          }}
          value={values.mobileNo}
          showError={showError}
        />
        <CustomInput
          type="phone"
          name="Work No"
          label="Work No"
          placeholder="Work No"
          required={true}
          error={errors.workNo}
          onChange={(e) => {
            setFieldValue("workNo", e);
          }}
          value={values.workNo}
          showError={showError}
        />
      </Grid>
      <CustomInput
        type="textarea"
        name="bio"
        label="Bio"
        placeholder="Bio"
        required={true}
        error={errors.bio}
        onChange={handleChange}
        value={values.bio}
        showError={showError}
      />
      <Heading fontSize="xl" mt={5} mb={5}>
        Address Info
      </Heading>
      <Divider />
      <Grid columnGap={5} rowGap={3} mb={5}>
        <FieldArray name="addressInfo">
          {({ push, remove }) => (
            <Box>
              {values.addressInfo.map((add: any, index: number) => (
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
                      error={getAddressError(errors, "address", index)}
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
                      error={getAddressError(errors, "country", index)}
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
                      error={getAddressError(errors, "pinCode", index)}
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
  );
};

export default OrganisationInfo;
