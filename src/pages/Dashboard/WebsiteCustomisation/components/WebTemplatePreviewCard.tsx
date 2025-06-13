import {
  Card,
  Divider,
  Flex,
  Grid,
  Heading,
  Image,
  Tag,
  Text,
  Box,
  Icon,
  Center,
  Badge,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { web } from "../../../../config/constant/routes";

interface WebTemplatePreviewCardProps {
  item: {
    name?: string;
    webType?: string;
    is_active: boolean;
    webInfo?: {
      sections?: any;
    };
  };
}

const WebTemplatePreviewCard = observer(
  ({ item }: WebTemplatePreviewCardProps) => {
    const navigate = useNavigate();
    const hasSections =
      item?.webInfo?.sections && Object.keys(item.webInfo.sections).length > 0;
    return (
      <Card
        p={6}
        borderRadius="lg"
        boxShadow="lg"
        _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
        transition="all 0.3s"
        onClick={() =>
          navigate(`${web.websiteCustomisation.index}/${item.name}`)
        }
        cursor="pointer"
      >
        <Flex justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Heading size="md">{item?.name || "Template Name"}</Heading>
            <Text fontSize="sm" color="gray.500">
              {item?.webType || "Type not available"}
            </Text>
          </Box>

          {/* Status Indicator */}
          <Badge
            colorScheme={item?.is_active ? "green" : "orange"}
            borderRadius="full"
            px={3}
            py={1}
            fontSize="0.8em"
          >
            {item?.is_active ? "Active" : "Pending"}
          </Badge>
        </Flex>

        <Divider />

        {/* Favicon Image or Placeholder */}
        <Center mt={4} mb={5}>
          {item?.webInfo?.sections?.metaData?.faviconUrl ? (
            <Image
              src={item.webInfo.sections.metaData.faviconUrl}
              alt="Favicon"
              boxSize="70px"
              objectFit="cover"
              borderRadius="full"
              border="2px solid"
              borderColor="gray.300"
              boxShadow="md"
              p={1}
            />
          ) : (
            <Box
              boxSize="70px"
              bg="gray.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="full"
              border="2px solid"
              borderColor="gray.300"
              boxShadow="md"
            >
              <Icon as={FiImage} boxSize="28px" color="gray.400" />
            </Box>
          )}
        </Center>

        <Divider />

        {/* Sections Display */}
        <Box mt={4}>
          <Heading size="sm" mb={2}>
            Sections
          </Heading>
          {hasSections ? (
            <Grid
              gap={3}
              gridTemplateColumns={{
                base: "1fr",
                md: "1fr 1fr",
                xl: "1fr 1fr 1fr",
              }}
            >
              {Object.keys(item?.webInfo?.sections || {}).map(
                (sectionKey: string) => (
                  <Tag
                    key={sectionKey}
                    size="md"
                    variant="solid"
                    colorScheme="blue"
                    textAlign="center"
                  >
                    {sectionKey}
                  </Tag>
                )
              )}
            </Grid>
          ) : (
            <Text fontSize="sm" color="gray.500" textAlign="center" mt={2}>
              No sections found
            </Text>
          )}
        </Box>
      </Card>
    );
  }
);

export default WebTemplatePreviewCard;
