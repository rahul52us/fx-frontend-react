import {
  Box,
  HStack,
  Tabs,
  TabPanels,
  TabPanel,
  useColorMode,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FaqSection from "../../../main/School/component/FaqSection/FaqSection";
import AboutSection from "../../../main/School/component/AboutSection/AboutSection";
import PrincipalSection from "../../../main/School/component/PrincipalSection/PrincipalSection";
import ColorSettingsForm from "./ColorSettingsForm";
import HeroCarousal from "../../../main/School/component/HeroCarousal/HeroCarousal";
import MetadataSettingsForm from "./metaDataSettingsForm";
import { observer } from "mobx-react-lite";
import store from "../../../../store/store";
import { getStatusType } from "../../../../config/constant/statusCode";
import CurriculumSection from "../../../main/School/component/curriculumSection/CurriculumSection";
import TestimonialsSection from "../../../main/School/component/TestimonialSection/TestimonialSection";
import { initialValues } from "../common/constant";
import Contact from "../../../main/School/component/ContactUs/Contact";
import { useParams } from "react-router-dom";
import WebTempSidebar from "./WebTempSidebar";
import MapSection from "../../../main/School/component/MapSection/MapSection";
import TeacherSection from "../../../main/School/component/TeacherSection/TeacherSection";
import TopperSection from "../../../main/School/component/Toppers/TopperSection";

const WebsiteBuilder = observer(() => {
  const { domainName } = useParams();
  const [submitLoading,setSubmitLoading] = useState(false)
  const [webTempId, setWebTempId] = useState<any>(null);
  const [webType, setWebType] = useState("school");
  const {
    WebTemplateStore: { updateWebTemplate, getWebTemplate },
    auth: { openNotification },
  } = store;

  const [webContent, setWebContent] = useState<any>(initialValues);
  const [colorSetting, setColorSetting] = useState(initialColorSettings());
  const { colorMode, toggleColorMode } = useColorMode();
  const [sections, setSections] = useState<any>(getInitialSections());
  const [currentSection, setCurrentSection] = useState<any>(sections[0]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  function initialColorSettings() {
    return {
      headingColor: { light: "#222222", dark: "#E2E8F0" },
      subHeadingColor: { light: "#4A5568", dark: "#A0AEC0" },
      buttonColor: { light: "#3182CE", dark: "#2B6CB0" },
      buttonHoverColor: { light: "#2B6CB0", dark: "#3182CE" },
      buttonTextColor: { light: "#FFFFFF", dark: "#E2E8F0" },
      buttonTextHoverColor: { light: "#FFFFFF", dark: "#E2E8F0" },
      iconColor: { light: "#2D3748", dark: "#A0AEC0" },
      iconHoverColor: { light: "#4A5568", dark: "#CBD5E0" },
      iconTextColor: { light: "#2D3748", dark: "#A0AEC0" },
      iconTextHoverColor: { light: "#4A5568", dark: "#CBD5E0" },
    };
  }

  function getInitialSections() {
    return [
      { label: "MetaData", page: "metaData", key: "metaData1" },
      {
        label: "Hero",
        page: "hero",
        key: "hero1",
        layouts: ["hero1", "hero2"],
      },
      {
        label: "About",
        page: "about",
        key: "about1",
        layouts: ["about1", "about2"],
      },
      {
        label: "Principal",
        page: "principal",
        key: "principal1",
        layouts: ["principal1", "principal2"],
      },
      {
        label: "Teachers",
        page: "teachers",
        key: "teachers1",
        layouts: ["teachers1", "teachers2"],
      },
      {
        label: "Toppers",
        page: "toppers",
        key: "toppers1",
        layouts: ["toppers1", "toppers2"],
      },
      {
        label: "Curriculum",
        page: "curriculum",
        key: "curriculum1",
        layouts: ["curriculum1", "curriculum2"],
      },
      {
        label: "Testimonial",
        page: "testimonial",
        key: "testimonial1",
        layouts: ["testimonial1", "testimonial2"],
      },
      { label: "Faq", page: "faq", key: "faq1", layouts: ["faq1", "faq2"] },
      {
        label: "Contact",
        page: "contact",
        key: "contact1",
        layouts: ["contact1", "contact2"],
      },
      {
        label: "Map",
        page: "map",
        key: "map1",
        layouts: ["map1", "map2"],
      },
    ];
  }
  useEffect(() => {
    getWebTemplate(domainName)
      .then((dt: any) => {
        const orderedSections = dt.data?.sectionsLayout
          .map((preferenceId: any) => {
            const section: any = getInitialSections().find(
              (section: any) => section.page === preferenceId.page
            );
            if (section) {
              return {
                ...preferenceId,
                props: dt?.data?.webInfo?.sections[section.id],
              };
            }
            return undefined;
          })
          .filter((section: any) => section !== undefined);
        setColorSetting({
          ...initialColorSettings(),
          ...dt?.data?.webInfo?.colorSetting,
        });
        setWebTempId(dt?.data?._id);
        setWebType(dt.data?.webType);
        setSections(orderedSections);
        const mergedContent = {
          ...initialValues,
          ...dt.data?.webInfo?.sections,
          metaData: {
            ...initialValues?.metaData,
            ...dt.data?.webInfo?.sections?.metaData,
          },
        };
        setWebContent(mergedContent);
      })
      .catch(() => {
        // openNotification({
        //   title: "GET TEMPLATE SUCCESSFULLY",
        //   message: err.message,
        //   type: "error",
        // });
      })
      .finally(() => {});
  }, [openNotification,domainName, getWebTemplate]);

  const handleKeyPress = (section: string, e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setCurrentSection(section);
    }
  };

  const saveWebTemplate = async () => {
    try {
      setSubmitLoading(true)
      const data = await updateWebTemplate({
        sectionsLayout: sections,
        webInfo: webContent,
        webType: webType,
        colorSetting,
        id: webTempId,
        status: "isApproved",
      });
      openNotification({
        title: "Successfully Created",
        message: `${data.message}`,
        type: "success",
      });
    } catch (err: any) {
      openNotification({
        title: "Error",
        message: err?.data?.message || "An error occurred",
        type: getStatusType(err.status),
      });
    }
    finally {
      setSubmitLoading(false)
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection.page) {
      case "metaData":
        return (
          <Box m={-6} mt={-6}>
            <MetadataSettingsForm
              content={webContent.metaData}
              setContent={(newContent: any) =>
                setWebContent({ ...webContent, metaData: newContent })
              }
            />
          </Box>
        );
      case "about":
        return (
          <Box m={-6} mt={-8} overflow="hidden">
            <AboutSection
              selectedLayout={currentSection}
              webColor={colorSetting}
              isEditable={true}
              content={webContent.about}
              setContent={(newContent: any) =>
                setWebContent({ ...webContent, about: newContent })
              }
            />
          </Box>
        );
      case "faq":
        return (
          <FaqSection
            content={webContent.faq}
            webColor={colorSetting}
            setContent={(newContent: any) =>
              setWebContent({ ...webContent, faq: newContent })
            }
          />
        );
      case "hero":
        return (
          <Box overflowY="auto">
            {" "}
            <HeroCarousal content={webContent.hero} />
          </Box>
        );
      case "principal":
        return (
          <Box m={-6} mt={-8} overflow="hidden">
            <PrincipalSection
              isEditable={true}
              webColor={colorSetting}
              content={webContent.principal}
              setContent={(newContent: any) =>
                setWebContent({ ...webContent, principal: newContent })
              }
            />
          </Box>
        );
      case "teachers":
        return (
          <Box m={-6} mt={-8} overflow="hidden">
            <TeacherSection
              isEditable={true}
              webColor={colorSetting}
              content={webContent.teacher}
              setContent={(newContent: any) =>
                setWebContent({ ...webContent, teacher: newContent })
              }
            />
          </Box>
        );
      case "toppers":
        return (
          <Box m={-6} mt={-2} overflow="hidden">
            <TopperSection
              isEditable={true}
              webColor={colorSetting}
              content={webContent.teacher}
              setContent={(newContent: any) =>
                setWebContent({ ...webContent, teacher: newContent })
              }
            />
          </Box>
        );
      case "curriculum":
        return (
          <CurriculumSection
            isEditable={true}
            webColor={colorSetting}
            content={webContent.curriculum}
            setContent={(newContent: any) =>
              setWebContent({ ...webContent, curriculum: newContent })
            }
          />
        );
      case "testimonial":
        return (
          <Box m={-3} mt={-8}>
          <TestimonialsSection
            isEditable={true}
            webColor={colorSetting}
            content={webContent.testimonial}
            setContent={(newContent: any) =>
              setWebContent({ ...webContent, testimonial: newContent })
            }
          />
          </Box>
        );
      case "contact":
        return (
          <Box m={-8} mt={-10}>
            <Contact
              isEditable={true}
              webColor={colorSetting}
              content={webContent.testimonial}
              setContent={(newContent: any) =>
                setWebContent({ ...webContent, testimonial: newContent })
              }
            />
          </Box>
        );
      case "map":
        return (
          <Box m={-8} mt={-10}>
            <MapSection
              isEditable={true}
              webColor={colorSetting}
              content={webContent.map}
              setContent={(newContent: any) =>
                setWebContent({ ...webContent, map: newContent })
              }
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <HStack
      align="flex-start"
      flexDirection={{ base: "column", md: "row" }}
      p={1}
      spacing={0}
      h={{ base: "100%", md: "87vh" }}
    >
      {/* Sidebar */}
      <WebTempSidebar
        colorMode={colorMode}
        setIsDrawerOpen={() => setIsDrawerOpen(true)}
        toggleColorMode={toggleColorMode}
        currentSection={currentSection}
        sections={sections}
        setSections={setSections}
        setCurrentSection={setCurrentSection}
        handleKeyPress={handleKeyPress}
        initialSections={getInitialSections()}
        saveWebTemplate={saveWebTemplate}
        submitLoading={submitLoading}
      />

      {/* Content Section */}
      <Box
        flex={1}
        p={0}
        overflowY={
          ["hero", "testimonial"].includes(currentSection.page)
            ? "auto"
            : undefined
        }
      >
        <Tabs>
          <TabPanels>
            <TabPanel>{renderCurrentSection()}</TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Drawer for Color Settings */}
      <Drawer
        size="xl"
        isOpen={isDrawerOpen}
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Color Settings</DrawerHeader>
          <DrawerBody>
            <ColorSettingsForm
              colorSetting={colorSetting}
              setColorSetting={setColorSetting}
            />
          </DrawerBody>
          <DrawerFooter>
            <Button colorScheme="blue" onClick={() => setIsDrawerOpen(false)}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </HStack>
  );
});

export default WebsiteBuilder;