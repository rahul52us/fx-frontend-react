import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Grid,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

interface ProgressCardProps {
  title: string;
  description: string;
  progress: number;
  linkText: string;
  linkUrl: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  description,
  progress,
  linkText,
  linkUrl,
}) => {
  const cardBg = useColorModeValue(
    "linear(to-r, gray.200, white)",
    "linear(to-r, gray.800, gray.600)"
  );
  const textColor = useColorModeValue("gray.800", "white");
  const linkColor = useColorModeValue("telegram.500", "telegram.400");

  return (
    <Box p={4} rounded={12} borderWidth={1} shadow={"md"} bgGradient={cardBg}>
      <Grid templateColumns={"3fr 1fr"} gap={4} alignItems={"center"}>
        <Box>
          <Text fontSize={"lg"} fontWeight={"bold"} color={textColor}>
            {title}
          </Text>
          <Text fontSize={"sm"} color={"gray"} my={3}>
            {description}
          </Text>
          <Link fontWeight={500} color={linkColor} href={linkUrl}>
            {linkText}
          </Link>
        </Box>
        <Box>
          <CircularProgress
            value={progress}
            size={"90px"}
            color="telegram.500"
            capIsRound
          >
            <CircularProgressLabel fontWeight={500}>
              {progress}%
            </CircularProgressLabel>
          </CircularProgress>
        </Box>
      </Grid>
    </Box>
  );
};

export default observer(ProgressCard);
