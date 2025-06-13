import {
  Box,
  Flex,
  Icon,
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { VscGraphLine } from "react-icons/vsc";

export const NewDashboardCard = ({
  icon,
  value,
  label,
  colorScheme,
  bgColor,
}: any) => {
  const iconBg = useColorModeValue(`${colorScheme}.200`, `${colorScheme}.900`);
  const cardBg = useColorModeValue(bgColor.light, bgColor.dark);
  const textColor = useColorModeValue(
    `${colorScheme}.600`,
    `${colorScheme}.100`
  );

  return (
    <Box
      p={5}
      h={'fit-content'}
      rounded="14"
      shadow={"rgba(0, 0, 0, 0.15) 0px 5px 15px 0px"}
      bg={cardBg}
      _hover={{ shadow: "lg" }}
    >
      <IconButton
        aria-label={label}
        isRound
        icon={icon}
        size="lg"
        bg={iconBg}
        color={textColor}
        _hover={{ bg: iconBg, transform: "scale(1.1)" }}
      />
      <Flex justify="space-between" align="center" mt={4}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>
            {value}
          </Text>
          <Text color={textColor}>{label}</Text>
        </Box>
        <Icon boxSize={7} as={VscGraphLine} color={textColor} />
      </Flex>
    </Box>
  );
};

// Adding prop types for better type checking
NewDashboardCard.propTypes = {
  icon: PropTypes.element.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  colorScheme: PropTypes.string,
  bgColor: PropTypes.shape({
    light: PropTypes.string,
    dark: PropTypes.string,
  }),
};

// Providing default values
NewDashboardCard.defaultProps = {
  colorScheme: "purple",
  bgColor: {
    light: "#f0f4f7",
    dark: "#1d1d43",
  },
};
