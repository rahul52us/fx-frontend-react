import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Grid,
  GridItem,
  Icon,
  Tooltip,
  Heading,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { FaGlobe, FaTag, FaInfoCircle, FaListUl, FaUser, FaLanguage, FaCogs } from "react-icons/fa";

interface MetadataSettingsFormProps {
  content: {
    name: string;
    title: string;
    description: string;
    keywords: string;
    author?: string;
    viewport?: string;
    language?: string;
    robots?: string;
    themeColor?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImageUrl?: string;
    faviconUrl?: string;
    canonicalUrl?: string;
  };
  setContent: (newMetadata: any) => void;
}

const MetadataSettingsForm: React.FC<MetadataSettingsFormProps> = ({
  content,
  setContent,
}) => {
  return (
    <Flex align="center" justify="center" py={1}>
      <Box
        boxShadow="lg"
        rounded="lg"
        w={{ base: "98vw", md: "95%", lg: "95%" }}
        p={6}
        borderWidth={1}
        borderColor="gray.200"
      >
        <Heading as="h3" size="lg" textAlign="center" mb={6} color="blue.600">
          Metadata Settings
        </Heading>
        <Divider mb={6} />
        <VStack spacing={4} align="stretch">
          <Grid templateColumns={{ base: "1fr", md: "auto 1fr" }} gap={4} alignItems="center">
            {/* Website Name */}
            <GridItem>
              <Tooltip label="The name displayed for the website" fontSize="sm" hasArrow>
                <Icon as={FaGlobe} boxSize={6} color="blue.600" />
              </Tooltip>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel fontWeight="bold">Website Name</FormLabel>
                <Input
                  value={content.name}
                  onChange={(e) => setContent({ ...content, name: e.target.value })}
                  placeholder="e.g., Evergreen Academy"
                  bg="gray.50"
                  focusBorderColor="blue.400"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.600", boxShadow: "0 0 0 1px blue.600" }}
                />
              </FormControl>
            </GridItem>

            {/* Title */}
            <GridItem>
              <Tooltip label="The title displayed on the browser tab" fontSize="sm" hasArrow>
                <Icon as={FaTag} boxSize={6} color="blue.600" />
              </Tooltip>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel fontWeight="bold">Title</FormLabel>
                <Input
                  value={content.title}
                  onChange={(e) => setContent({ ...content, title: e.target.value })}
                  placeholder="e.g., Welcome to Evergreen Academy"
                  bg="gray.50"
                  focusBorderColor="blue.400"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.600", boxShadow: "0 0 0 1px blue.600" }}
                />
              </FormControl>
            </GridItem>

            {/* Description */}
            <GridItem>
              <Tooltip label="A brief description of your website" fontSize="sm" hasArrow>
                <Icon as={FaInfoCircle} boxSize={6} color="blue.600" />
              </Tooltip>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel fontWeight="bold">Description</FormLabel>
                <Textarea
                  value={content.description}
                  onChange={(e) => setContent({ ...content, description: e.target.value })}
                  placeholder="e.g., A place where students thrive through intellectual growth."
                  bg="gray.50"
                  focusBorderColor="blue.400"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.600", boxShadow: "0 0 0 1px blue.600" }}
                  resize="vertical"
                />
              </FormControl>
            </GridItem>

            {/* Keywords */}
            <GridItem>
              <Tooltip label="Keywords to improve search engine ranking" fontSize="sm" hasArrow>
                <Icon as={FaListUl} boxSize={6} color="blue.600" />
              </Tooltip>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel fontWeight="bold">Keywords</FormLabel>
                <Input
                  value={content.keywords}
                  onChange={(e) => setContent({ ...content, keywords: e.target.value })}
                  placeholder="e.g., education, school, academy, learning"
                  bg="gray.50"
                  focusBorderColor="blue.400"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.600", boxShadow: "0 0 0 1px blue.600" }}
                />
              </FormControl>
            </GridItem>

            {/* Author */}
            <GridItem>
              <Tooltip label="The author of the website or content" fontSize="sm" hasArrow>
                <Icon as={FaUser} boxSize={6} color="blue.600" />
              </Tooltip>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel fontWeight="bold">Author</FormLabel>
                <Input
                  value={content.author}
                  onChange={(e) => setContent({ ...content, author: e.target.value })}
                  placeholder="e.g., John Doe"
                  bg="gray.50"
                  focusBorderColor="blue.400"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.600", boxShadow: "0 0 0 1px blue.600" }}
                />
              </FormControl>
            </GridItem>

            {/* Viewport */}
            <GridItem>
              <Tooltip label="Viewport settings for responsive design" fontSize="sm" hasArrow>
                <Icon as={FaCogs} boxSize={6} color="blue.600" />
              </Tooltip>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel fontWeight="bold">Viewport</FormLabel>
                <Input
                  value={content.viewport}
                  onChange={(e) => setContent({ ...content, viewport: e.target.value })}
                  placeholder="e.g., width=device-width, initial-scale=1"
                  bg="gray.50"
                  focusBorderColor="blue.400"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.600", boxShadow: "0 0 0 1px blue.600" }}
                />
              </FormControl>
            </GridItem>

            {/* Language */}
            <GridItem>
              <Tooltip label="Primary language of the website (e.g., en-US)" fontSize="sm" hasArrow>
                <Icon as={FaLanguage} boxSize={6} color="blue.600" />
              </Tooltip>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel fontWeight="bold">Language</FormLabel>
                <Input
                  value={content.language}
                  onChange={(e) => setContent({ ...content, language: e.target.value })}
                  placeholder="e.g., en-US"
                  bg="gray.50"
                  focusBorderColor="blue.400"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.600", boxShadow: "0 0 0 1px blue.600" }}
                />
              </FormControl>
            </GridItem>

            {/* Robots */}
            <GridItem>
              <Tooltip label="Control indexing and crawling by search engines" fontSize="sm" hasArrow>
                <Icon as={FaCogs} boxSize={6} color="blue.600" />
              </Tooltip>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel fontWeight="bold">Robots</FormLabel>
                <Input
                  value={content.robots}
                  onChange={(e) => setContent({ ...content, robots: e.target.value })}
                  placeholder="e.g., index, follow"
                  bg="gray.50"
                  focusBorderColor="blue.400"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.600", boxShadow: "0 0 0 1px blue.600" }}
                />
              </FormControl>
            </GridItem>

            {/* Theme Color */}
            <GridItem>
              <Tooltip label="Theme color for the web application" fontSize="sm" hasArrow>
                <Icon as={FaCogs} boxSize={6} color="blue.600" />
              </Tooltip>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel fontWeight="bold">Theme Color</FormLabel>
                <Input
                  value={content.themeColor}
                  onChange={(e) => setContent({ ...content, themeColor: e.target.value })}
                  placeholder="#FFFFFF"
                  bg="gray.50"
                  focusBorderColor="blue.400"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.600", boxShadow: "0 0 0 1px blue.600" }}
                />
              </FormControl>
            </GridItem>

            {/* OG Title */}
            <GridItem>
              <Tooltip label="Open Graph title for social media" fontSize="sm" hasArrow>
                <Icon as={FaCogs} boxSize={6} color="blue.600" />
              </Tooltip>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel fontWeight="bold">OG Title</FormLabel>
                <Input
                  value={content.ogTitle}
                  onChange={(e) => setContent({ ...content, ogTitle: e.target.value })}
                  placeholder="e.g., Evergreen Academy: Where Learning Thrives"
                  bg="gray.50"
                  focusBorderColor="blue.400"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.600", boxShadow: "0 0 0 1px blue.600" }}
                />
              </FormControl>
            </GridItem>

            {/* OG Description */}
            <GridItem>
              <Tooltip label="Open Graph description for social media" fontSize="sm" hasArrow>
                <Icon as={FaCogs} boxSize={6} color="blue.600" />
              </Tooltip>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel fontWeight="bold">OG Description</FormLabel>
                <Textarea
                  value={content.ogDescription}
                  onChange={(e) => setContent({ ...content, ogDescription: e.target.value })}
                  placeholder="A brief description for social sharing."
                  bg="gray.50"
                  focusBorderColor="blue.400"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.600", boxShadow: "0 0 0 1px blue.600" }}
                  resize="vertical"
                />
              </FormControl>
            </GridItem>

            {/* OG Image URL */}
            <GridItem>
              <Tooltip label="Open Graph image URL for social media" fontSize="sm" hasArrow>
                <Icon as={FaCogs} boxSize={6} color="blue.600" />
              </Tooltip>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel fontWeight="bold">OG Image URL</FormLabel>
                <Input
                  value={content.ogImageUrl}
                  onChange={(e) => setContent({ ...content, ogImageUrl: e.target.value })}
                  placeholder="e.g., https://example.com/image.jpg"
                  bg="gray.50"
                  focusBorderColor="blue.400"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.600", boxShadow: "0 0 0 1px blue.600" }}
                />
              </FormControl>
            </GridItem>

            {/* Favicon URL */}
            <GridItem>
              <Tooltip label="Favicon URL for the website" fontSize="sm" hasArrow>
                <Icon as={FaCogs} boxSize={6} color="blue.600" />
              </Tooltip>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel fontWeight="bold">Favicon URL</FormLabel>
                <Input
                  value={content.faviconUrl}
                  onChange={(e) => setContent({ ...content, faviconUrl: e.target.value })}
                  placeholder="e.g., https://example.com/favicon.ico"
                  bg="gray.50"
                  focusBorderColor="blue.400"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.600", boxShadow: "0 0 0 1px blue.600" }}
                />
              </FormControl>
            </GridItem>

            {/* Canonical URL */}
            <GridItem>
              <Tooltip label="Canonical URL for SEO" fontSize="sm" hasArrow>
                <Icon as={FaCogs} boxSize={6} color="blue.600" />
              </Tooltip>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel fontWeight="bold">Canonical URL</FormLabel>
                <Input
                  value={content.canonicalUrl}
                  onChange={(e) => setContent({ ...content, canonicalUrl: e.target.value })}
                  placeholder="e.g., https://example.com/page"
                  bg="gray.50"
                  focusBorderColor="blue.400"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.600", boxShadow: "0 0 0 1px blue.600" }}
                />
              </FormControl>
            </GridItem>
          </Grid>
        </VStack>
      </Box>
    </Flex>
  );
};

export default MetadataSettingsForm;
