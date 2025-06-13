import React, { useState } from "react";
import {
  Box,
  Center,
  Heading,
  VStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Text,
  Flex,
} from "@chakra-ui/react";
import UserProfileCard from "./UserProfileCard";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import CurrentUser from "./CurrentUser/CurrentUser";
import { ApiResponse } from "./utils/constant";
import NormalTable from "../../../../../config/component/Table/NormalTable/NormalTable";
import ProfileCard from "../../../../main/Home/component/ProfileCard/ProfileCard";
import DrawerLoader from "../../../../../config/component/Loader/DrawerLoader";
import DashPageHeader from "../../../../../config/component/common/DashPageHeader/DashPageHeader";
import { projectBreadCrumb } from "../../../utils/breadcrumb.constant";

const UserHierarchy: React.FC<ApiResponse> = ({ data }) => {
  const [showAllSubordinates, setShowAllSubordinates] = useState(false);
  const user = data.userDetails?.[0];
  const manager = user?.managerDetails?.[0];
  const subordinates: any = data.users || [];

  const toggleShowAllSubordinates = () => {
    setShowAllSubordinates(!showAllSubordinates);
  };

  return (
    <DrawerLoader noRecordFoundText={!data}>
      <DashPageHeader title="Project" breadcrumb={projectBreadCrumb.index} />
      <Center p={{ sm: 10, md: 5 }} pt={5}>
        {data && user && (
          <VStack spacing={8} alignItems="center" width="100%">
            {/* User Profile */}
            <Flex justify="center" width="100%">
              <ProfileCard user={user} />
            </Flex>

            {/* Manager Section */}
            <Flex
              rounded="md"
              width="100%"
              justifyContent="center"
              flexDirection="column"
              alignItems="center"
            >
              <Heading as="h3" size="lg" mb={4} textAlign="center">
                My Manager
              </Heading>
              {manager ? (
                <UserProfileCard userData={manager} />
              ) : (
                <Text textAlign="center">No Manager Assigned</Text>
              )}
            </Flex>

            {/* Current User Section */}
            <Flex
              rounded="md"
              width="100%"
              justifyContent="center"
              flexDirection="column"
              alignItems="center"
            >
              <Heading as="h3" size="lg" mb={4} textAlign="center">
                Current User
              </Heading>
              <CurrentUser userData={user} />
            </Flex>

            {/* Subordinates Section */}
            <Box rounded="md" width="100%">
              <Heading as="h3" size="lg" mb={4} textAlign="center">
                My Subordinates
              </Heading>
              {subordinates.length > 0 ? (
                <>
                  <Flex justifyContent="center" wrap={"wrap"} gap={4}>
                    {subordinates
                      .slice(0, showAllSubordinates ? subordinates.length : 5)
                      .map((subordinate: any, index: number) => (
                        <UserProfileCard
                          key={index}
                          userData={subordinate.userDetails}
                          designation={
                            subordinate?.companydetail?.designation[0]?.title
                          }
                        />
                      ))}
                  </Flex>
                  {subordinates.length > 5 && (
                    <Center mt={6}>
                      <Button
                        onClick={toggleShowAllSubordinates}
                        size="md"
                        leftIcon={
                          showAllSubordinates ? <FaAngleUp /> : <FaAngleDown />
                        }
                      >
                        {showAllSubordinates ? "Show Less" : "Show More"}
                      </Button>
                    </Center>
                  )}
                </>
              ) : (
                <Text textAlign="center">No Subordinates Available</Text>
              )}
            </Box>

            {/* Subordinates Modal */}
            <Modal
              isOpen={showAllSubordinates}
              onClose={toggleShowAllSubordinates}
              size="6xl"
            >
              <ModalOverlay />
              <ModalContent>
                <ModalBody>
                  <NormalTable
                    title="All Subordinates"
                    columns={[
                      { headerName: "Name", key: "name" },
                      { headerName: "Code", key: "code" },
                      { headerName: "Username", key: "username" },
                      { headerName: "Department", key: "department" },
                      { headerName: "Designation", key: "designation" },
                    ]}
                    data={
                      subordinates?.length > 0
                        ? subordinates.map((subordinate: any) => {
                            const designation =
                              subordinate.companydetail?.designation[0]?.title;
                            const department =
                              subordinate.companydetail?.department[0]?.title;
                            return {
                              name: subordinate.userDetails?.name,
                              username: subordinate.userDetails?.username,
                              designation: designation,
                              department: department,
                              code: subordinate.userDetails?.code,
                              pic: subordinate.userDetails?.pic,
                            };
                          })
                        : []
                    }
                    loading={false}
                    totalPages={1}
                    currentPage={1}
                    onPageChange={() => {}}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    onClick={toggleShowAllSubordinates}
                  >
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </VStack>
        )}
      </Center>
    </DrawerLoader>
  );
};

export default UserHierarchy;
