import * as Yup from "yup";
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const addressValidation = Yup.object().shape({
    address: Yup.string()
      .min(3, "Address must be at least 3 characters")
      .max(120, "Address must not exceed 120 characters")
      .required("Address is required"),
    country: Yup.string().required("please select the country"),
    state: Yup.string().required("please select the state"),
    city: Yup.string().required("please select the city"),
    pinCode: Yup.string().required("please enter the pinCode"),
  });

  export const getOrganisationCreateValidation = (isEdit: boolean) => {
    const commonFields = {
      first_name: Yup.string()
        .min(2, "First Name must be at least 2 characters")
        .max(60, "First Name cannot exceed 60 characters")
        .required("First Name is required")
        .trim(),
      last_name: Yup.string()
        .min(2, "Last Name must be at least 2 characters")
        .max(60, "Last Name cannot exceed 60 characters")
        .required("Last Name is required")
        .trim(),
      code: Yup.string()
        .min(2, "Code must be at least 2 characters")
        .max(60, "Code cannot exceed 60 characters")
        .required("Code is required")
        .trim(),
      username: Yup.string()
        .min(2, "Username must be at least 2 characters")
        .max(60, "Username cannot exceed 60 characters")
        .required("Username is required")
        .trim(),
      mobileNo: Yup.string()
        .required("Mobile Number is required")
        .matches(phoneRegExp, "Mobile Number is not valid"),
      workNo: Yup.string()
        .matches(phoneRegExp, "Work Number is not valid"),
      logo: Yup.mixed().required("Logo is required"),
      addressInfo: Yup.array()
        .min(1, "At least one address is required")
        .of(addressValidation),
      facebookLink: Yup.string().url("Please enter a valid Facebook URL"),
      instagramLink: Yup.string().url("Please enter a valid Instagram URL"),
      githubLink: Yup.string().url("Please enter a valid GitHub URL"),
      linkedInLink: Yup.string().url("Please enter a valid LinkedIn URL"),
      twitterLink: Yup.string().url("Please enter a valid Twitter URL"),
      telegramLink: Yup.string().url("Please enter a valid Telegram URL"),
      otherLinks: Yup.array().of(
        Yup.string().url("Invalid URL format").required("Other link is required")
      ),
      bio: Yup.string()
        .min(5, "Bio must be at least 5 characters")
        .trim()
        .required("Bio is required"),
      company_name: Yup.string()
        .min(2, "Organisation Name must be at least 2 characters")
        .max(250, "Organisation Name cannot exceed 250 characters")
        .required("Organisation Name is required"),
      companyCode: Yup.string()
        .min(2, "Company Code must be at least 2 characters")
        .trim()
        .required("Company Code is required"),
    };

    const editSpecificFields = {
      password: Yup.string()
        .required("Password is required")
        .matches(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
          "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, and one number"
        ),
    };

    // If in edit mode, add password validation
    const validationSchema = !isEdit
      ? Yup.object().shape({ ...commonFields, ...editSpecificFields })
      : Yup.object().shape(commonFields);

    return validationSchema;
  };

