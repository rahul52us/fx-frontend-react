import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useQueryParams } from "../../../config/component/customHooks/useQuery";
import store from "../../../store/store";
import React, { useEffect, useState } from "react";
import PageLoader from "../../../config/component/Loader/PageLoader";

// Import your icon components
import { FaBuilding, FaUsers } from "react-icons/fa";
import { CalendarIcon } from "@chakra-ui/icons";
import PersonalInfo from "./component/PersonalInfo";
import CompanyDetails from "./component/CompanyDetails";
import FamilyDetails from "./component/FamilyDetails";
import WorkExperience from "./component/WorkExperience";
import SkillAndAdditionalInfo from "./component/SkillAndAdditionalInfo";
import Qualification from "./component/Qualification";
import BankDetails from "./component/BankDetails";
import Documents from "./component/Documents";
import DashPageHeader from "../../../config/component/common/DashPageHeader/DashPageHeader";
import { dashProfileBreadCrumb } from "../utils/breadcrumb.constant";
import ProfileEditIndex from "./ProfileEditIndex";
import PermissionDeniedPage from "../../../config/component/commonPages/PermissionDeniedPage";

const ProfileIndex = observer(({ userId }: any) => {
  const [selectedTab, setSelectedTab] = useState({
    open: false,
    type: "profile-details",
  });
  const [haveApiCall, setHaveApiCall] = useState(false);

  const { getQueryParam, setQueryParam } = useQueryParams();
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>("personal-details");
  const [userDetails, setUserDetails] = useState<any>(null);
  const { colorMode } = useColorMode();

  const {
    User: { getUsersDetailsById },
    auth: { user, checkPermission },
  } = store;

  useEffect(() => {
    const tab = getQueryParam("tab");
    if (typeof tab === "string" || typeof tab === "number") {
      setCurrentTab(tab.toString());
    }
  }, [getQueryParam]);

  useEffect(() => {
    if (user && !haveApiCall && checkPermission("personalProfile", "view")) {
      setLoading(true);
      getUsersDetailsById(userId || user._id)
        .then((data) => {
          setHaveApiCall(true);
          setUserDetails(data);
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    }
  }, [getUsersDetailsById, user, haveApiCall, userId, checkPermission]);

  const tabMapping: string[] = [
    "personal-details",
    "company-details",
    "family-details",
    "work-experience",
    "skill-and-additional-info",
    "qualifications",
    "documents",
    "bank-details",
  ];

  const currentTabIndex = tabMapping.indexOf(currentTab);

  const handleTabChange = (index: number) => {
    const selectedTab = tabMapping[index];
    setCurrentTab(selectedTab);
    setQueryParam("tab", selectedTab);
  };

  const tabStyles = {
    _selected: {
      color: colorMode === "dark" ? "white" : "teal.500",
      bg: colorMode === "dark" ? "teal.600" : "teal.100",
    },
    px: useBreakpointValue({ base: 2, md: 4 }),
    py: 2,
    borderRadius: "md",
    fontWeight: "bold",
    fontSize: useBreakpointValue({ base: "sm", md: "md" }),
    mb: useBreakpointValue({ base: 2, md: 0 }),
  };

  return (
    <PermissionDeniedPage show={!checkPermission("personalProfile", "view")}>
      <React.Fragment>
        <Box p={3} pt={2}>
          {!userId && (
            <DashPageHeader
              title="Profile"
              breadcrumb={dashProfileBreadCrumb.index}
            />
          )}
          <PageLoader loading={loading}>
            <Tabs
              variant="enclosed"
              isLazy
              index={currentTabIndex >= 0 ? currentTabIndex : 0}
              onChange={handleTabChange}
            >
              <TabList
                borderBottomWidth={2}
                borderColor="teal.300"
                mb={4}
                bg={colorMode === "dark" ? "gray.700" : "white"}
                borderRadius="md"
                boxShadow="lg"
                overflowX="auto"
                display="flex"
                flexDirection={{ base: "column", md: "row" }}
                alignItems="flex-start"
                p={useBreakpointValue({ base: 2, md: 3 })}
              >
                <Tab {...tabStyles}>
                  <CalendarIcon style={{ marginRight: "10px" }} /> Personal Info
                </Tab>
                <Tab {...tabStyles}>
                  <FaBuilding style={{ marginRight: "10px" }} /> Company
                </Tab>
                <Tab {...tabStyles}>
                  <FaUsers style={{ marginRight: "10px" }} /> Family
                </Tab>
                <Tab {...tabStyles}>
                  <FaUsers style={{ marginRight: "10px" }} /> Work Experience
                </Tab>
                <Tab {...tabStyles}>
                  <FaUsers style={{ marginRight: "10px" }} /> Skill & Additional
                  Info
                </Tab>
                <Tab {...tabStyles}>
                  <FaUsers style={{ marginRight: "10px" }} /> Qualification
                </Tab>
                <Tab {...tabStyles}>
                  <FaUsers style={{ marginRight: "10px" }} /> Documents
                </Tab>
                <Tab {...tabStyles}>
                  <FaUsers style={{ marginRight: "10px" }} /> Bank Account
                  Details
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel m={{ base: -5, md: 0 }}>
                  {userDetails?.profileDetails && (
                    <PersonalInfo
                      personalDetails={
                        userDetails?.profileDetails?.length > 0
                          ? userDetails?.profileDetails.map((it: any) => ({
                              ...userDetails,
                              ...it,
                            }))
                          : []
                      }
                      setSelectedTab={setSelectedTab}
                      isEditable={
                        !userId && checkPermission("personalProfile", "edit")
                      }
                    />
                  )}
                </TabPanel>
                <TabPanel m={{ base: -5, md: 0 }}>
                  <CompanyDetails
                    userDetails={userDetails}
                    setSelectedTab={setSelectedTab}
                    isEditable={
                      !userId && checkPermission("personalProfile", "edit")
                    }
                  />
                </TabPanel>
                <TabPanel m={{ base: -5, md: 3 }}>
                  <FamilyDetails
                    relations={
                      userDetails?.familyDetails
                        ? userDetails?.familyDetails[0]?.relations
                        : []
                    }
                    setSelectedTab={setSelectedTab}
                    isEditable={
                      !userId && checkPermission("personalProfile", "edit")
                    }
                  />
                </TabPanel>
                <TabPanel m={{ base: -5, md: 3 }}>
                  <WorkExperience
                    experienceDetails={
                      userDetails?.workExperience
                        ? userDetails?.workExperience[0]?.experienceDetails
                        : []
                    }
                    setSelectedTab={setSelectedTab}
                    isEditable={
                      !userId && checkPermission("personalProfile", "edit")
                    }
                  />
                </TabPanel>
                <TabPanel m={{ base: -5, md: 0 }}>
                  <SkillAndAdditionalInfo
                    userDetails={userDetails}
                    setSelectedTab={setSelectedTab}
                    isEditable={
                      !userId && checkPermission("personalProfile", "edit")
                    }
                  />
                </TabPanel>
                <TabPanel m={{ base: -5, md: 0 }}>
                  <Qualification
                    userDetails={userDetails}
                    setSelectedTab={setSelectedTab}
                    isEditable={
                      !userId && checkPermission("personalProfile", "edit")
                    }
                  />
                </TabPanel>
                <TabPanel m={{ base: -5, md: 0 }}>
                  <Documents
                    userDetails={userDetails}
                    setSelectedTab={setSelectedTab}
                    isEditable={
                      !userId && checkPermission("personalProfile", "edit")
                    }
                  />
                </TabPanel>
                <TabPanel m={{ base: -5, md: 3 }}>
                  <BankDetails
                    bankDetails={
                      userDetails?.bankDetails
                        ? userDetails?.bankDetails[0]
                        : {}
                    }
                    setSelectedTab={setSelectedTab}
                    isEditable={
                      !userId && checkPermission("personalProfile", "edit")
                    }
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </PageLoader>
        </Box>
        <ProfileEditIndex
          setHaveApiCall={setHaveApiCall}
          setSelectedTab={setSelectedTab}
          selectedTab={selectedTab}
          userDetails={userDetails}
        />
      </React.Fragment>
    </PermissionDeniedPage>
  );
});

export default ProfileIndex;