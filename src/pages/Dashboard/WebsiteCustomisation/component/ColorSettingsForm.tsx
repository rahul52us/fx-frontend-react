import {
  Box,
  Button,
  VStack,
  useToast,
  Heading,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { MdColorLens } from "react-icons/md";
import ColorPickerComponent from "../../../../config/component/ColorPicker/ColorPickerComponent";

interface ColorSettings {
  headingColor: { light: string; dark: string };
  subHeadingColor: { light: string; dark: string };
  button: { light: string; dark: string };
  buttonHover: { light: string; dark: string };
  icon: { light: string; dark: string };
}

const ColorSettingsForm = ({colorSetting, setColorSetting} : any) => {

  const toast = useToast();

  const handleColorChange = (field: keyof ColorSettings) => (color: { light: string; dark: string }) => {
    setColorSetting((prevColors : any) => ({ ...prevColors, [field]: color }));
  };

  const handleSave = () => {
    console.log("Saved Colors:", colorSetting);
    toast({
      title: "Colors Saved",
      description: "Your color settings have been saved successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    // Logic to persist colors (API call, context update, etc.)
  };

  return (
    <Box
      p={6}
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
      mx="auto"
      borderWidth="1px"
      borderColor="gray.200"
      maxW="600px" // Limit the width for better readability
    >
      <Heading as="h3" size="lg" mb={4} textAlign="center">
        Color Settings
      </Heading>
      <Divider mb={6} />
      <VStack spacing={6} align="stretch">
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          {Object.entries(colorSetting).map(([key, value] : any) => (
            <HStack key={key} spacing={2} align="center">
              <ColorPickerComponent
                label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                color={value}
                onChangeComplete={handleColorChange(key as keyof ColorSettings)}
              />
              <Flex
                w="40px"
                h="40px"
                borderRadius="md"
                borderWidth="1px"
                borderColor="gray.300"
                bg={value.light} // Display the selected color
                _hover={{ transform: "scale(1.05)", borderColor: "gray.400" }}
                transition="transform 0.2s, border-color 0.2s"
              >
                <Tooltip label="Current Color" hasArrow placement="top">
                  <IconButton
                    icon={<MdColorLens />}
                    aria-label="Color Swatch"
                    variant="ghost"
                    colorScheme="gray"
                    size="sm"
                    isRound
                    _hover={{ bg: "transparent" }}
                  />
                </Tooltip>
              </Flex>
            </HStack>
          ))}
        </Grid>
      </VStack>
      <Button
        colorScheme="teal"
        mt={8}
        size="lg"
        onClick={handleSave}
        _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
        transition="transform 0.2s, box-shadow 0.2s"
      >
        Save Colors
      </Button>
    </Box>
  );
};

export default ColorSettingsForm;
