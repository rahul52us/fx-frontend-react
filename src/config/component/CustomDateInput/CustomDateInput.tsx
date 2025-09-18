import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";

interface CustomDateInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void; // Formik handleChange
  error?: string | false;
  showError?: boolean;
}

export const CustomDateInput: React.FC<CustomDateInputProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  showError = true,
}) => {
  const formatDate = (val: string) => {
    // remove non-digits
    let digits = val.replace(/\D/g, "");

    // limit to 8 digits
    if (digits.length > 8) digits = digits.slice(0, 8);

    // add slashes
    if (digits.length > 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDate(e.target.value);

    // create a synthetic event so Formik can handle it
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: formatted,
      },
    };

    onChange(syntheticEvent);
  };

  return (
    <FormControl isInvalid={!!error && showError}>
      <FormLabel fontSize={'xs'} htmlFor={name}>{label}</FormLabel>
      <Input
        id={name}
        name={name}
        placeholder="dd/mm/yyyy"
        value={value}
        onChange={handleChange}
        maxLength={10}
      />
      {showError && error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
