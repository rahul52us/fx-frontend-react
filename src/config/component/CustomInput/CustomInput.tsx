import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Switch,
  Tag,
  TagCloseButton,
  TagLabel,
  Textarea,
  useColorMode,
  useColorModeValue,
  useTheme,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RiCalendarLine, RiCloseFill, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import Select from "react-select";
import { format, isAfter, isBefore, isValid, parse, startOfDay } from "date-fns";
import { Field } from "formik";
import debounce from "lodash/debounce";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { inputBorderColor, inputBorderColorFocus } from "../../../globalColors";
import store from "../../../store/store";
import AdvancedEditor from "../Editor/Editor";

interface CustomDatePickerInputProps {
  name: string;
  fieldValue: string;
  setFieldValue: (name: string, value: any) => void;
  setFieldTouched: (name: string, isTouched?: boolean) => void;
  minDate?: any;
  maxDate?: any;
  disabled?: boolean;
  placeholder?: string;
  isClear?: boolean;
  style?: any;
  inputBg?: string;
}

const CustomDatePickerInput: React.FC<CustomDatePickerInputProps> = ({
  name,
  fieldValue,
  setFieldValue,
  setFieldTouched,
  minDate,
  maxDate,
  disabled,
  placeholder,
  isClear,
  style,
  inputBg,
}) => {
  const hiddenDateInputRef = useRef<HTMLInputElement>(null);

  // Convert "yyyy-MM-dd" stored format to "dd/MM/yyyy" for display
  const toDisplay = (val: string) => {
    if (!val) return "";
    const parsed = parse(val, "yyyy-MM-dd", new Date());
    return isValid(parsed) ? format(parsed, "dd/MM/yyyy") : val;
  };

  const [displayValue, setDisplayValue] = useState(() => toDisplay(fieldValue));

  useEffect(() => {
    setDisplayValue(toDisplay(fieldValue));
  }, [fieldValue]);

  // Handle manual typing with auto-masking (dd/MM/yyyy)
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/[^\d/]/g, "");

    const digits = input.replace(/\D/g, "");
    if (digits.length > 2 && digits.length <= 4) {
      input = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else if (digits.length > 4) {
      input = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }

    setDisplayValue(input);

    if (input.length === 10) {
      const parsedDate = parse(input, "dd/MM/yyyy", new Date());

      if (isValid(parsedDate)) {
        const dateOnly = startOfDay(parsedDate);

        if (minDate && isBefore(dateOnly, startOfDay(new Date(minDate)))) return;
        if (maxDate && isAfter(dateOnly, startOfDay(new Date(maxDate)))) return;

        setFieldValue(name, format(parsedDate, "yyyy-MM-dd"));
        return;
      }
    }

    if (!input) {
      setFieldValue(name, "");
    }
  };

  // Handle selection from the native calendar popup
  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value; // "yyyy-MM-dd"
    if (selectedDate) {
      setDisplayValue(toDisplay(selectedDate));
      setFieldValue(name, selectedDate);
    }
  };

  // Open the native browser calendar popup
  const openCalendar = () => {
    if (disabled) return;
    if (hiddenDateInputRef.current) {
      if (typeof hiddenDateInputRef.current.showPicker === "function") {
        hiddenDateInputRef.current.showPicker();
      } else {
        hiddenDateInputRef.current.focus();
        hiddenDateInputRef.current.click();
      }
    }
  };

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      {/* 1. Visible Text Input for dd/MM/yyyy typing */}
      <Input
        type="text"
        name={name}
        value={displayValue}
        onChange={handleTextChange}
        onBlur={() => {
          setDisplayValue(toDisplay(fieldValue));
          setFieldTouched(name, true);
        }}
        disabled={disabled}
        placeholder={placeholder || "dd/mm/yyyy"}
        maxLength={10}
        bg={inputBg}
        style={style}
        pr={isClear && fieldValue ? "4.5rem" : "2.5rem"}
        fontSize="sm"
        border={`1px solid ${inputBorderColor}`}
        _focus={{ borderColor: "white" }}
        _focusVisible={{
          outline: "none",
          borderColor: `${inputBorderColorFocus}`,
        }}
        _placeholder={{ fontSize: "12px" }}
      />

      {/* 2. Clear Button */}
      {fieldValue && isClear && (
        <Button
          size="sm"
          colorScheme="red"
          variant="link"
          onClick={() => {
            setDisplayValue("");
            setFieldValue(name, "");
          }}
          style={{
            position: "absolute",
            top: "50%",
            right: "2.2rem",
            transform: "translateY(-50%)",
            zIndex: 2,
            minWidth: "auto",
            padding: "0 4px",
          }}
        >
          <Icon as={RiCloseFill} fontSize="18px" />
        </Button>
      )}

      {/* 3. Calendar Icon button to trigger the picker */}
      <Button
        size="sm"
        variant="ghost"
        onClick={openCalendar}
        disabled={disabled}
        style={{
          position: "absolute",
          top: "50%",
          right: "0.3rem",
          transform: "translateY(-50%)",
          zIndex: 2,
          minWidth: "auto",
          padding: "0 6px",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        _hover={{ bg: "transparent" }}
        _active={{ bg: "transparent" }}
      >
        <Icon as={RiCalendarLine} fontSize="18px" color="gray.500" />
      </Button>

      {/* 4. Hidden Native Date Picker synced to form value */}
      <input
        ref={hiddenDateInputRef}
        type="date"
        tabIndex={-1}
        aria-hidden="true"
        value={fieldValue || ""}
        onChange={handlePickerChange}
        min={minDate ? format(new Date(minDate), "yyyy-MM-dd") : undefined}
        max={maxDate ? format(new Date(maxDate), "yyyy-MM-dd") : undefined}
        disabled={disabled}
        style={{
          position: "absolute",
          bottom: 0,
          right: "0.5rem",
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: "none",
          border: 0,
          padding: 0,
          margin: 0,
        }}
      />
    </div>
  );
};

interface CustomInputProps {
  type?:
    | "editor"
    | "password"
    | "number"
    | "text"
    | "radio"
    | "file"
    | "switch"
    | "textarea"
    | "select"
    | "date"
    | "time"
    | "checkbox"
    | "url"
    | "phone"
    | "dateAndTime"
    | "file-drag"
    | "tags"
    | "real-time-user-search";
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: any;
  maxDate?: any;
  minDate?: any;
  disabledDates?: any;
  name: string;
  isClear?: boolean;
  onChange?: (value: any) => void;
  value?: any;
  w?: string;
  options?: any[];
  isSearchable?: boolean;
  isMulti?: boolean;
  getOptionLabel?: (option: any) => string;
  getOptionValue?: (option: any) => any;
  rows?: number;
  disabled?: boolean;
  showError?: boolean;
  style?: any;
  phone?: string;
  accept?: any;
  onFileDrop?: (files: FileList) => void;
  readOnly?: boolean;
  rest?: any;
  labelcolor?: any;
  isPortal?: any;
}

const CustomInput: React.FC<CustomInputProps> = ({
  type,
  label,
  placeholder,
  error,
  name,
  value,
  onChange,
  required,
  isClear = false,
  options,
  isSearchable,
  isMulti,
  getOptionLabel,
  getOptionValue,
  disabled,
  rows,
  style,
  showError,
  maxDate,
  minDate,
  disabledDates,
  phone,
  onFileDrop,
  accept,
  readOnly,
  labelcolor,
  isPortal,
  ...rest
}) => {
  const isMounted = useRef(false);
  const [inputValue, setInputValue] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const theme = useTheme();
  const [userOptions, setUserOptions] = useState(options || []);

  const { colorMode } = useColorMode();
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const fetchSearchUsers = useCallback(async (query: string) => {
    if (query?.trim() === "") {
      return;
    }
    try {
      const response: any = await store.auth.getCompanyUsers({
        page: 1,
        searchValue: query,
      });
      setUserOptions(
        response.map((it: any) => ({
          label: it.user.username,
          value: it.user._id,
        }))
      );
    } catch (error) {
      // console.error("Error fetching search results:", error);
    }
  }, []);

  const debouncedFetchSearchUserResults = useMemo(
    () => debounce(fetchSearchUsers, 800),
    [fetchSearchUsers]
  );

  useEffect(() => {
    if (isMounted?.current && searchInput?.trim() !== "") {
      debouncedFetchSearchUserResults(searchInput);
    } else {
      isMounted.current = true;
    }
  }, [searchInput, debouncedFetchSearchUserResults]);

  const handleFileDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      const files = event.dataTransfer.files;
      if (onChange) {
        onChange({ target: { name, files } });
      }
    },
    [name, onChange]
  );

  const handleTagAdd = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if ((!e || e.key === "Enter") && inputValue) {
      const newTags = [...(value || []), inputValue];
      onChange && onChange(newTags);
      setInputValue("");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    const newTags = (value || []).filter((tag: string) => tag !== tagToRemove);
    onChange && onChange(newTags);
  };

  const inputBg = useColorModeValue("transparent", "gray.700");

  const renderInputComponent = () => {
    switch (type) {
      case "password":
        return (
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              pr="4.5rem"
              position="relative"
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              name={name}
              isRequired={required}
              disabled={disabled}
              fontSize="sm"
              {...rest}
              _focus={{ borderColor: "white" }}
              border={`1px solid ${inputBorderColor}`}
              _focusVisible={{
                outline: "none",
                borderColor: `${inputBorderColorFocus}`,
              }}
            />
            <InputRightElement
              cursor="pointer"
              onClick={() => {
                if (handleTogglePassword) {
                  handleTogglePassword();
                }
              }}
            >
              {showPassword ? (
                <RiEyeOffLine size={18} />
              ) : (
                <RiEyeLine size={18} />
              )}
            </InputRightElement>
          </InputGroup>
        );
      case "number":
        return (
          <Input
            type="text"
            style={style}
            bg={inputBg}
            value={value}
            _focus={{ borderColor: "white" }}
            border={`1px solid ${inputBorderColor}`}
            _focusVisible={{
              outline: "none",
              borderColor: `${inputBorderColorFocus}`,
            }}
            onKeyDown={(e: any) => {
              const regex = /^[0-9]*$/;
              if (e.key === "Backspace") {
                const newValue = e.target?.value?.slice(0, -1);
                onChange &&
                  onChange({ target: { name, value: newValue || "" } });
              } else if (
                regex.test(e.key) ||
                (e.key === "." && e.target?.value?.indexOf(".") === -1) ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight" ||
                e.key === "Home" ||
                e.key === "End"
              ) {
                const newValue = e.key.startsWith("Arrow")
                  ? e.target.value
                  : e.target.value + e.key;
                onChange && onChange({ target: { name, value: newValue } });
              } else {
                e.preventDefault();
              }
            }}
            name={name}
            placeholder={placeholder}
            disabled={disabled}
            _placeholder={{ fontSize: "12px" }}
            {...rest}
          />
        );
      case "text":
        return (
          <Input
            type="text"
            placeholder={placeholder}
            style={style}
            value={value}
            bg={inputBg}
            onChange={onChange}
            name={name}
            disabled={disabled}
            _placeholder={{ fontSize: "12px" }}
            readOnly={readOnly}
            {...rest}
            _focus={{ borderColor: "white" }}
            border={`1px solid ${inputBorderColor}`}
            _focusVisible={{
              outline: "none",
              borderColor: `${inputBorderColorFocus}`,
            }}
          />
        );
      case "textarea":
        return (
          <Textarea
            style={style}
            rows={rows || 3}
            placeholder={placeholder}
            bg={inputBg}
            value={value}
            onChange={onChange}
            name={name}
            disabled={disabled}
            _placeholder={{ fontSize: "12px" }}
            readOnly={readOnly}
            {...rest}
            _focus={{ borderColor: "white" }}
            border={`1px solid ${inputBorderColor}`}
            _focusVisible={{
              outline: "none",
              borderColor: `${inputBorderColorFocus}`,
            }}
          />
        );
      case "radio":
        return (
          <RadioGroup
            name={name}
            value={value}
            onChange={(val) => onChange && onChange(val)}
          >
            <Flex>
              {options &&
                options.map((opt) => (
                  <Radio
                    key={`${name}-${opt.value}`}
                    value={opt.value}
                    isDisabled={disabled}
                    mr={4}
                  >
                    {opt.label}
                  </Radio>
                ))}
            </Flex>
          </RadioGroup>
        );
      case "switch":
        return (
          <Switch
            style={style}
            name={name}
            onChange={onChange}
            isChecked={value}
            readOnly={readOnly}
            {...rest}
          />
        );
      case "checkbox":
        return (
          <Checkbox
            style={style}
            name={name}
            onChange={onChange}
            isChecked={value}
            readOnly={readOnly}
            {...rest}
          />
        );
      case "select":
        return (
          <Select
            options={options}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            isClearable={isClear ? true : undefined}
            className={`chakra-select ${
              theme ? theme.components.Select.baseStyle : ""
            }`}
            isMulti={isMulti}
            isSearchable={isSearchable}
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            isDisabled={disabled}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused ? "gray.200" : "gray.300",
                backgroundColor: colorMode === "light" ? "white" : "#2D3748",
                fontSize: "14px",
              }),
              option: (styles, { isSelected, isFocused }) => ({
                ...styles,
                backgroundColor:
                  colorMode === "light"
                    ? isSelected
                      ? "#4299e1"
                      : isFocused
                      ? "gray.100"
                      : "white"
                    : isSelected
                    ? "#2b6cb0"
                    : isFocused
                    ? "gray.700"
                    : "#2D3748",
                color: colorMode === "light" ? "black" : "white",
                border: "none",
                padding: "8px 12px",
                ":hover": {
                  backgroundColor:
                    colorMode === "light" ? "#bee3f8" : "#2b6cb0",
                },
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: colorMode === "light" ? "white" : "#2D3748",
                borderColor: colorMode === "light" ? "gray.200" : "#4A5568",
              }),
              multiValue: (styles) => ({
                ...styles,
                backgroundColor: colorMode === "light" ? "#bee3f8" : "#2b6cb0",
                color: colorMode === "light" ? "black" : "white",
              }),
              multiValueLabel: (styles) => ({
                ...styles,
                color: colorMode === "light" ? "blue.400" : "blue.200",
              }),
              singleValue: (styles) => ({
                ...styles,
                color: colorMode === "light" ? "black" : "white",
              }),
              clearIndicator: (styles) => ({
                ...styles,
                color: colorMode === "light" ? "black" : "white",
              }),
              dropdownIndicator: (styles) => ({
                ...styles,
                color: colorMode === "light" ? "black" : "white",
              }),
              indicatorSeparator: (styles) => ({
                ...styles,
                backgroundColor: colorMode === "light" ? "gray.300" : "#4A5568",
              }),
            }}
            components={{
              IndicatorSeparator: null,
              DropdownIndicator: () => (
                <div className="chakra-select__dropdown-indicator" />
              ),
            }}
            menuPosition={isPortal ? "fixed" : undefined}
          />
        );
      case "time":
        return (
          <Input
            readOnly={readOnly}
            style={style}
            bg={inputBg}
            type="time"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            disabled={disabled}
            _placeholder={{ fontSize: "12px" }}
            {...rest}
            _focus={{ borderColor: "white" }}
            border={`1px solid ${inputBorderColor}`}
            _focusVisible={{
              outline: "none",
              borderColor: `${inputBorderColorFocus}`,
            }}
          />
        );
      case "dateAndTime":
        return (
          <Input
            readOnly={readOnly}
            style={style}
            bg={inputBg}
            type="datetime-local"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            disabled={disabled}
            _placeholder={{ fontSize: "12px" }}
            {...rest}
            _focus={{ borderColor: "white" }}
            border={`1px solid ${inputBorderColor}`}
            _focusVisible={{
              outline: "none",
              borderColor: `${inputBorderColorFocus}`,
            }}
          />
        );

      case "date":
        return (
          <Field name={name}>
            {({ field, form }: any) => (
              <CustomDatePickerInput
                name={name}
                fieldValue={field.value || ""}
                setFieldValue={form.setFieldValue}
                setFieldTouched={form.setFieldTouched}
                minDate={minDate}
                maxDate={maxDate}
                disabled={disabled}
                placeholder={placeholder}
                isClear={isClear}
                style={style}
                inputBg={inputBg}
              />
            )}
          </Field>
        );

      case "editor":
        return (
          <AdvancedEditor
            style={style}
            editorState={value}
            setEditorState={onChange}
          />
        );
      case "phone":
        return (
          <PhoneInput
            country={"in"}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            inputStyle={{
              backgroundColor:
                colorMode === "light" ? "transparent" : "transparent",
              borderColor: "gray.400",
            }}
            dropdownStyle={{
              backgroundColor: colorMode === "light" ? "white" : "#2D3748",
              color: colorMode === "light" ? "black" : "gray.300",
            }}
            buttonStyle={{
              backgroundColor:
                colorMode === "light" ? "transparent" : "transparent",
            }}
          />
        );
      case "file":
        return (
          <Input
            readOnly={readOnly}
            style={style}
            type="file"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            disabled={disabled}
            _placeholder={{ fontSize: "12px" }}
            accept={accept}
            {...rest}
            _focus={{ borderColor: "white" }}
            border={`1px solid ${inputBorderColor}`}
            _focusVisible={{
              outline: "none",
              borderColor: `${inputBorderColorFocus}`,
            }}
          />
        );
      case "file-drag":
        return (
          <div
            style={{
              border: "2px dashed #ddd",
              borderRadius: "8px",
              padding: "1rem",
              textAlign: "center",
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
          >
            <p>Drag & drop files here or click to browse</p>
            <input
              type="file"
              name={name}
              multiple={isMulti}
              onChange={onChange}
              style={{ display: "none" }}
              id={`multiple-file-upload-with-draggable-${name}`}
              accept={accept}
            />
            <Button
              colorScheme="blue"
              onClick={() =>
                (
                  document.getElementById(
                    `multiple-file-upload-with-draggable-${name}`
                  ) as unknown as HTMLInputElement
                )?.click()
              }
            >
              Browse
            </Button>
          </div>
        );
      case "url":
        return (
          <Input
            readOnly={readOnly}
            style={style}
            type="url"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            disabled={disabled}
            _placeholder={{ fontSize: "12px" }}
            {...rest}
            _focus={{ borderColor: "white" }}
            border={`1px solid ${inputBorderColor}`}
            _focusVisible={{
              outline: "none",
              borderColor: `${inputBorderColorFocus}`,
            }}
          />
        );
      case "tags":
        return (
          <Box>
            <Input
              style={style}
              bg={inputBg}
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              name={name}
              disabled={disabled}
              _placeholder={{ fontSize: "12px" }}
              {...rest}
              _focus={{ borderColor: "white" }}
              border={`1px solid ${inputBorderColor}`}
              _focusVisible={{
                outline: "none",
                borderColor: `${inputBorderColorFocus}`,
              }}
            />
            <Button
              onClick={() => handleTagAdd()}
              mt={2}
              size="sm"
              colorScheme="blue"
            >
              Add Tag
            </Button>
            <Wrap mt={2}>
              {value &&
                value.map((tag: string, index: number) => (
                  <WrapItem key={index}>
                    <Tag
                      size="md"
                      borderRadius="full"
                      variant="solid"
                      colorScheme="blue"
                    >
                      <TagLabel>{tag}</TagLabel>
                      <TagCloseButton onClick={() => handleTagRemove(tag)} />
                    </Tag>
                  </WrapItem>
                ))}
            </Wrap>
          </Box>
        );
      case "real-time-user-search":
        return (
          <Select
            key={name}
            name={name}
            options={userOptions}
            value={
              isMulti
                ? Array.isArray(value)
                  ? value?.length > 0
                    ? value
                    : null
                  : null
                : userOptions.find((opt: any) => opt?.value === value?.value)
            }
            onChange={(selectedOption: any) => {
              if (isMulti) {
                onChange && onChange(selectedOption.map((opt: any) => opt));
                setSearchInput(selectedOption ? selectedOption.label : "");
              } else {
                onChange && onChange(selectedOption ? selectedOption : "");
              }
            }}
            inputValue={searchInput}
            onInputChange={(input) => setSearchInput(input)}
            placeholder={placeholder}
            isClearable={isClear ? true : undefined}
            isMulti={isMulti}
            isSearchable={isSearchable}
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            isDisabled={disabled}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused ? "gray.200" : "gray.300",
                backgroundColor: colorMode === "light" ? "white" : "#2D3748",
                fontSize: "14px",
              }),
              option: (styles, { isSelected, isFocused }) => ({
                ...styles,
                backgroundColor:
                  colorMode === "light"
                    ? isSelected
                      ? "#4299e1"
                      : isFocused
                      ? "gray.100"
                      : "white"
                    : isSelected
                    ? "#2b6cb0"
                    : isFocused
                    ? "gray.700"
                    : "#2D3748",
                color: colorMode === "light" ? "black" : "white",
                padding: "8px 12px",
                ":hover": {
                  backgroundColor:
                    colorMode === "light" ? "#bee3f8" : "#2b6cb0",
                },
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: colorMode === "light" ? "white" : "#2D3748",
                borderColor: colorMode === "light" ? "gray.200" : "#4A5568",
              }),
              multiValue: (styles) => ({
                ...styles,
                backgroundColor: colorMode === "light" ? "#bee3f8" : "#2b6cb0",
                color: colorMode === "light" ? "black" : "white",
              }),
              multiValueLabel: (styles) => ({
                ...styles,
                color: colorMode === "light" ? "blue.400" : "blue.200",
              }),
              singleValue: (styles) => ({
                ...styles,
                color: colorMode === "light" ? "black" : "white",
              }),
              clearIndicator: (styles) => ({
                ...styles,
                color: colorMode === "light" ? "black" : "white",
              }),
              dropdownIndicator: (styles) => ({
                ...styles,
                color: colorMode === "light" ? "black" : "white",
              }),
              indicatorSeparator: (styles) => ({
                ...styles,
                backgroundColor: colorMode === "light" ? "gray.300" : "#4A5568",
              }),
            }}
            components={{
              IndicatorSeparator: null,
              DropdownIndicator: () => (
                <div className="chakra-select__dropdown-indicator" />
              ),
            }}
            menuPosition={isPortal ? "fixed" : undefined}
          />
        );

      default:
        return (
          <Input
            readOnly={readOnly}
            style={style}
            bg={inputBg}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            disabled={disabled}
            _placeholder={{ fontSize: "12px" }}
            _focus={{ borderColor: "white" }}
            border={`1px solid ${inputBorderColor}`}
            _focusVisible={{
              outline: "none",
              borderColor: `${inputBorderColorFocus}`,
            }}
            {...rest}
          />
        );
    }
  };

  return (
    <FormControl id={name} isInvalid={!!error && showError}>
      <FormLabel color={labelcolor} fontSize={"small"} mt={2}>
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </FormLabel>
      {renderInputComponent()}
      {showError && error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default CustomInput;