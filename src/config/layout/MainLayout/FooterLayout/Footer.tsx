import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Image,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import {
  FaArrowCircleRight,
  FaEnvelope,
  FaNewspaper,
  FaPhone,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LinkText from "../../../component/LinkText/LinkText";
import SocialMediaLink from "../../../component/SocialMediaLinkContainer/SocialMediaLink";
import { dashboard, main, web } from "../../../constant/routes";
import FooterBottom from "./element/FooterBottom";

const Footer = observer(() => {
  const navigate = useNavigate();
  //   const bgColor = useColorModeValue("gray.800", "gray.900");
  const bgColor = useColorModeValue(
    "linear(to-r, #1a202c, #2d3748)",
    "linear(to-r, #1a202c, #2d3748)"
  );
  const textColor = useColorModeValue("gray.200", "gray.400");
  const headingColor = useColorModeValue("blue.300", "blue.400");
  // const linkHoverColor = useColorModeValue("gray.00", "blue.600");
  //   const btnBgColor = useColorModeValue("blue.500", "blue.700");
  const gradientBg = useColorModeValue(
    "linear(to-r, blue.400, cyan.400)",
    "linear(to-r, blue.600, cyan.600)"
  );

  return (
    <>
      <Box
        pl={{ base: 5, md: 10 }}
        pr={{ base: 5, md: 10 }}
        pt={{ base: 5, md: 12 }}
        // pb={{ base: 5, md: 8 }}
        bgGradient={bgColor}
        color={textColor}
      >
        <Grid
          templateColumns={{
            base: "1fr",
            md: "1fr 1fr",
            xl: "1.5fr 1fr 1fr 1.5fr",
          }}
          gap={10}
          columnGap={16}
        >
          <Box>
            <Flex flexDirection={"column"} align="flex-start">
              <Image
                w={160}
                src="https://themefisher.com/images/logo/logo.svg"
                alt=""
                mixBlendMode={"hard-light"}
                cursor="pointer"
                mb={5}
                onClick={() => navigate(main.home)}
              />
              <Text mt={2} lineHeight="tall">
                We’re always in search of talented and motivated people. Don’t
                be shy, introduce yourself!
              </Text>
            </Flex>
            <Stack align="start" mt={8} spacing={2}>
              <SocialMediaLink />
              <Button
                borderRadius="full"
                bgGradient={gradientBg}
                mt={4}
                color="white"
                rightIcon={<FaArrowCircleRight />}
                _hover={{
                  bgGradient: "linear(to-r, blue.500, cyan.500)",
                  transform: "scale(1.05)",
                  boxShadow: "xl",
                }}
                _active={{
                  transform: "scale(0.95)",
                }}
                _focus={{ boxShadow: "outline" }}
                transition="all 0.3s ease"
                onClick={() => navigate(main.contact)}
              >
                Contact Us
              </Button>
            </Stack>
          </Box>

          <Box>
            <Heading fontSize={"xl"} color={headingColor} mb={4}>
              Useful Links
            </Heading>
            <VStack align="start" spacing={2}>
              <LinkText text="Home" clickEvent={() => navigate(main.home)} />
              <LinkText text="About" clickEvent={() => navigate(main.about)} />
              <LinkText
                text="Profile"
                clickEvent={() => navigate(main.profile)}
              />
              <LinkText
                text="Quiz"
                clickEvent={() => navigate(main.quizIndex)}
              />
              <LinkText
                text="Courses"
                clickEvent={() => navigate(main.courses)}
              />
              <LinkText
                text="Testimonials"
                clickEvent={() => navigate(main.testimonial)}
              />
              <LinkText text="Videos" clickEvent={() => navigate(main.video)} />
              <LinkText text="E-commerce" clickEvent={() => navigate(web.ecommerce.products)} />
              <LinkText text="School" clickEvent={() => navigate(web.school)} />
            </VStack>
          </Box>
          <Box>
            <Heading fontSize={"xl"} color={headingColor} mb={4}>
              Our Company
            </Heading>
            <VStack align="start" spacing={2}>
              <LinkText text="About" clickEvent={() => navigate("/about")} />
              <LinkText text="Events" />
              <LinkText
                text="Dashboard"
                clickEvent={() => navigate(dashboard.home)}
              />
              <LinkText text="Blogs" clickEvent={() => navigate(main.blog)} />
              <LinkText
                text="Contact Us"
                clickEvent={() => navigate(main.contact)}
              />
              <LinkText text="Faq" clickEvent={() => navigate(main.faq)} />
              <LinkText text="Privacy Policy" />
            </VStack>
          </Box>

          <Box>
            <Heading fontSize={"xl"} color={headingColor} mb={4}>
              Get in Touch
            </Heading>
            <VStack align="start" spacing={4}>
              <HStack>
                <Icon as={FaPhone} color={headingColor} />
                <LinkText
                  text="+ 9977053447"
                  clickEvent={() => alert("rahul")}
                />
              </HStack>
              <HStack>
                <Icon as={FaEnvelope} color={headingColor} />
                <LinkText
                  text="rahul52us@gmail.com"
                  clickEvent={() => alert("rahlu")}
                />
              </HStack>
              <Box>
                <HStack mb={2}>
                  <Icon as={FaNewspaper} color={headingColor} />
                  <LinkText
                    text="Newsletter"
                    clickEvent={() => alert("rahlu")}
                  />
                </HStack>
                <Text fontSize={"md"} color={textColor}>
                  2000+ students are subscribed around the world. Don’t be shy,
                  introduce yourself!
                </Text>
              </Box>
            </VStack>
          </Box>
        </Grid>
        <FooterBottom />
      </Box>
    </>
  );
});

export default Footer;
