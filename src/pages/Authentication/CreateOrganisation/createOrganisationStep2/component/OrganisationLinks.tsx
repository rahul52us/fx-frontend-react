import { Box, Button, Flex, Grid, IconButton } from "@chakra-ui/react";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";
import { FaTrash } from "react-icons/fa";

const OrganisationLinks = ({ values, handleChange, errors, showError, setFieldValue }: any) => {

  return (
    <Grid gap={2}>
      <CustomInput
        type="text"
        name="facebookLink"
        label="Facebook Link"
        placeholder="Facebook Link"
        required={true}
        error={errors.facebookLink}
        onChange={handleChange}
        value={values.facebookLink}
        showError={showError}
      />
      <CustomInput
        type="text"
        name="instagramLink"
        label="Instagram Link"
        placeholder="Instagram Link"
        required={true}
        error={errors.instagramLink}
        onChange={handleChange}
        value={values.instagramLink}
        showError={showError}
      />
      <CustomInput
        type="text"
        name="twitterLink"
        label="Twitter Link"
        placeholder="Twitter Link"
        required={true}
        error={errors.twitterLink}
        onChange={handleChange}
        value={values.twitterLink}
        showError={showError}
      />
      <CustomInput
        type="text"
        name="githubLink"
        label="Github Link"
        placeholder="Github Link"
        required={true}
        error={errors.githubLink}
        onChange={handleChange}
        value={values.githubLink}
        showError={showError}
      />
      <CustomInput
        type="text"
        name="telegramLink"
        label="Telegram Link"
        placeholder="Telegram Link"
        required={true}
        error={errors.telegramLink}
        onChange={handleChange}
        value={values.telegramLink}
        showError={showError}
      />
      <CustomInput
        type="text"
        name="linkedInLink"
        label="LinkedIn Link"
        placeholder="LinkedIn Link"
        required={true}
        error={errors.linkedInLink}
        onChange={handleChange}
        value={values.linkedInLink}
        showError={showError}
      />
      {values.otherLinks.map((link: string, index: number) => (
        <Flex alignItems="center" key={index} gridColumn={{ base: "span 2", md: "auto" }}>
          <CustomInput
            type="text"
            name={`otherLinks[${index}]`}
            label={`Other Link ${index + 1}`}
            placeholder={`Other Link ${index + 1}`}
            required={true}
            error={errors.otherLinks && errors.otherLinks[index]}
            onChange={(e) => setFieldValue(`otherLinks[${index}]`, e.target.value)}
            value={link}
            showError={showError}
          />
          <IconButton
            aria-label="Remove Link"
            icon={<FaTrash />}
            colorScheme="red"
            size="sm"
            onClick={() => setFieldValue("otherLinks", values.otherLinks.filter((_ : any, i : number) => i !== index))}
          />
        </Flex>
      ))}
      <Box gridColumn="span 2">
        <Button onClick={() => setFieldValue("otherLinks", [...values.otherLinks, ""])} colorScheme="blue">Add Other Link</Button>
      </Box>
    </Grid>
  );
};

export default OrganisationLinks;
