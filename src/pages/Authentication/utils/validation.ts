import * as Yup from 'yup';

export const LoginValidation = Yup.object().shape({
  username: Yup.string()
    .email('Invalid username format')
    .required('Username is required'),
    password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export const ForgotEmailValidation = Yup.object().shape({
  username: Yup.string()
    .email('Invalid email format')
    .required('Username is required'),
});


export const ResetPasswordValidation = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});
