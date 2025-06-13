import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { FC } from "react";

interface ShowDataProps {
  label: string;
  value: string | string[] | any; // Accept both single string and array of strings
  type?: "single" | "multi"; // Optional type prop
  textTransform?: any;
}

const ShowData: FC<ShowDataProps> = ({
  label,
  value,
  type = "single",
  textTransform = "capitalize",
}) => {
  const labelColor = useColorModeValue("gray", "gray.400");
  const textColor = useColorModeValue("black", "gray.200");
  return (
    <Box>
      <Text color={labelColor} fontSize={"sm"}>
        {label}
      </Text>
      {type === "single" ? (
        <Text
          fontWeight={"semibold"}
          color={textColor}
          textTransform={textTransform}
        >
          {value || "Na"}
        </Text>
      ) : (
        Array.isArray(value) &&
        value.map((item, index) => (
          <Text
            key={index}
            textTransform={"capitalize"}
            fontWeight={"semibold"}
          >
            {item || "Na"}
          </Text>
        ))
      )}
    </Box>
  );
};

export default ShowData;
