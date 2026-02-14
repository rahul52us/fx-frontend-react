import {
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Grid,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  Tabs,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import store from "../../../store/store";

const DataComparison = ({ original, updated, depth = 0 }: any) => {
  // Combine keys from both objects to ensure we catch all fields
  const allKeys = Array.from(
    new Set([...Object.keys(original || {}), ...Object.keys(updated || {})])
  );

  return (
    <Box>
      {allKeys.map((key) => {
        // Skip internal keys if necessary
        if (key === "rowId") return null;

        const oldVal = original?.[key];
        const newVal = updated?.[key];

        // Check if value is an Array (e.g., hedgeDeals)
        if (Array.isArray(newVal) || Array.isArray(oldVal)) {
          const arr = newVal || oldVal;
          return (
            <Box key={key} mt={2} mb={4} ml={depth * 4} p={3} bg="gray.50" borderRadius="md" border="1px dashed" borderColor="gray.300">
              <Text fontWeight="bold" fontSize="sm" color="blue.600" mb={2} textTransform="capitalize">
                {key} (List)
              </Text>
              {arr.map((item: any, index: number) => (
                <Box key={index} mb={3} pl={3} borderLeft="2px solid" borderColor="blue.200">
                  <Badge mb={1} colorScheme="blue">Item {index + 1}</Badge>
                  {/* Recursive call for array items */}
                  <DataComparison
                    original={oldVal?.[index] || {}}
                    updated={item}
                    depth={depth + 1}
                  />
                </Box>
              ))}
            </Box>
          );
        }

        // Check if value is a Nested Object (but not null/array)
        if (typeof newVal === "object" && newVal !== null && !Array.isArray(newVal)) {
          return (
            <Box key={key} ml={depth * 4}>
              <Text fontWeight="bold" mt={2}>{key}</Text>
              <DataComparison original={oldVal} updated={newVal} depth={depth + 1} />
            </Box>
          )
        }

        // Standard Primitive Value Comparison
        const isModified = String(oldVal) !== String(newVal);

        return (
          <Grid
            key={key}
            templateColumns="1.5fr 1fr 1fr"
            gap={4}
            py={2}
            borderBottom="1px solid"
            borderColor="gray.100"
            bg={isModified ? "orange.50" : "transparent"}
            ml={depth * 4}
          >
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Text>
            </Box>

            <Box>
              <Text
                fontSize="sm"
                color={isModified ? "red.400" : "gray.600"}
                textDecoration={isModified ? "line-through" : "none"}
              >
                {oldVal ?? <Text as="span" color="gray.300">N/A</Text>}
              </Text>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight={isModified ? "bold" : "normal"} color={isModified ? "green.600" : "gray.800"}>
                {newVal ?? <Text as="span" color="gray.300">N/A</Text>}
              </Text>
            </Box>
          </Grid>
        );
      })}
    </Box>
  );
};

const Approvals = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const approvalStore = store.ApprovalStore;
  const { auth: { viewAsUserId } } = store;
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("pending");
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (viewAsUserId) {
      fetchData();
    }
  }, [page, status, viewAsUserId]);

  const fetchData = async () => {
    try {
      const response: any = await approvalStore.getEditedData({ userId: viewAsUserId, status, page });
      if (response?.status === "success") {
        setData(response.data?.data || []);
        if (response?.totalPages) {
          setTotalPages(response.totalPages);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleRowClick = (item: any) => {
    setSelectedItem(item);
    onOpen();
  };

  const handleAction = async (actionType: "approved" | "rejected") => {
    if (!selectedItem) return;
    // Constructing payload exactly as per CURL requirement
    const payload = {
      userId: viewAsUserId,
      action: actionType,
      data: {
        register: selectedItem.register || "export", // Default to export if missing
        data: [
          {
            original: selectedItem.data.original,
            updated: selectedItem.data.updated,
            rowId: selectedItem.data.original.rowId,
          },
        ],
      },
    };

    try {
      await approvalStore.updateValidation(payload);
      toast({
        title: `Request ${actionType}`,
        status: "success",
        duration: 3000,
      });
      onClose();
      fetchData(); // Refresh data to move item to correct tab
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.toString(),
        status: "error",
      });
    }
  };

  // Reusable Table Component
  const DataTable = ({ data, isLoading }: { data: any[], isLoading: boolean }) => {
    return (
      <Box overflowX="auto" borderRadius="lg" border="1px solid" borderColor="gray.100">
        <Table variant="simple" size="md">
          <Thead bg="gray.50">
            <Tr>
              <Th py={4} color="gray.500" textTransform="uppercase" fontSize="xs" letterSpacing="wider">Register</Th>
              <Th py={4} color="gray.500" textTransform="uppercase" fontSize="xs" letterSpacing="wider">Party Name</Th>
              <Th py={4} color="gray.500" textTransform="uppercase" fontSize="xs" letterSpacing="wider" isNumeric>Amount</Th>
              <Th py={4} color="gray.500" textTransform="uppercase" fontSize="xs" letterSpacing="wider">Exposure</Th>
              <Th py={4} color="gray.500" textTransform="uppercase" fontSize="xs" letterSpacing="wider" textAlign="center">Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={5} textAlign="center" py={12}>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <Spinner size="lg" color="teal.500" thickness="3px" mb={3} />
                    <Text color="gray.500" fontSize="sm" fontWeight="medium">Loading approval requests...</Text>
                  </Box>
                </Td>
              </Tr>
            ) : data.length === 0 ? (
              <Tr>
                <Td colSpan={5} textAlign="center" py={12} color="gray.500">
                  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Text fontSize="lg" fontWeight="bold" color="gray.300">No Data Found</Text>
                    <Text fontSize="sm">There are no verification requests in this category.</Text>
                  </Box>
                </Td>
              </Tr>
            ) : (
              data.map((item, idx) => {
                const display = item.data.updated || item.data.original;
                return (
                  <Tr
                    key={idx}
                    _hover={{ bg: "blue.50", cursor: "pointer", transition: "all 0.2s" }}
                    onClick={() => handleRowClick(item)}
                    transition="all 0.2s"
                  >
                    <Td fontWeight="medium" color="gray.700" textTransform={'capitalize'}>
                      <Badge colorScheme="purple" variant="subtle" px={2} py={0.5} borderRadius="md">
                        {item?.register?.replace(/([A-Z])/g, ' $1').trim()}
                      </Badge>
                    </Td>
                    <Td fontWeight="semibold" color="gray.700">{display.partyName || "N/A"}</Td>
                    <Td fontWeight="bold" color="gray.800" isNumeric>
                      {Number(display.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      <Text as="span" fontSize="xs" color="gray.500" ml={1}>{display.currency}</Text>
                    </Td>
                    <Td>
                      <Tag size="sm" colorScheme={display.exposureType === 'Hedge' ? 'green' : 'blue'} variant="subtle">
                        {display.exposureType || "Unknown"}
                      </Tag>
                    </Td>
                    <Td textAlign="center">
                      <Button size="xs" colorScheme="teal" variant="ghost" rightIcon={<Box as="span">➝</Box>}>
                        View Details
                      </Button>
                    </Td>
                  </Tr>
                );
              })
            )}
          </Tbody>
        </Table>
      </Box>
    );
  };

  const handleTabChange = (index: number) => {
    setTabIndex(index);
    setPage(1);
    const statuses = ["pending", "approved", "rejected"];
    setStatus(statuses[index]);
  };

  return (
    <Box p={6} bg="white" borderRadius="lg" shadow="sm">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Data Approvals</Text>

      <Tabs index={tabIndex} onChange={handleTabChange} variant="unstyled" colorScheme="teal">
        <Box bg="gray.100" p={1} borderRadius="lg" mb={6} width="fit-content">
          <TabList>
            <Tab
              _selected={{ color: "orange.600", bg: "white", shadow: "sm" }}
              fontWeight="bold"
              px={6}
              py={2}
              borderRadius="md"
              color="gray.500"
              transition="all 0.2s"
            >
              Pending
              <Badge ml={2} colorScheme="orange" variant="solid" borderRadius="full" fontSize="0.7em">
                {approvalStore.approvalData.pendingCount}
              </Badge>
            </Tab>
            <Tab
              _selected={{ color: "green.600", bg: "white", shadow: "sm" }}
              fontWeight="bold"
              px={6}
              py={2}
              borderRadius="md"
              color="gray.500"
              transition="all 0.2s"
            >
              Approved
              <Badge ml={2} colorScheme="green" variant="solid" borderRadius="full" fontSize="0.7em">
                {approvalStore.approvalData.approvedCount}
              </Badge>
            </Tab>
            <Tab
              _selected={{ color: "red.600", bg: "white", shadow: "sm" }}
              fontWeight="bold"
              px={6}
              py={2}
              borderRadius="md"
              color="gray.500"
              transition="all 0.2s"
            >
              Rejected
              <Badge ml={2} colorScheme="red" variant="solid" borderRadius="full" fontSize="0.7em">
                {approvalStore.approvalData.rejectedCount}
              </Badge>
            </Tab>
          </TabList>
        </Box>

        <TabPanels>
          <TabPanel p={0} pt={4}>
            <DataTable data={data} isLoading={approvalStore.loading} />
          </TabPanel>
          <TabPanel p={0} pt={4}>
            <DataTable data={data} isLoading={approvalStore.loading} />
          </TabPanel>
          <TabPanel p={0} pt={4}>
            <DataTable data={data} isLoading={approvalStore.loading} />
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* PAGINATION */}
      <Box display="flex" justifyContent="flex-end" alignItems="center" mt={4} gap={2}>
        <Button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          isDisabled={page === 1 || approvalStore.loading}
          size="sm"
          variant="outline"
        >
          Previous
        </Button>
        <Text fontSize="sm" fontWeight="medium">
          Page {page} of {totalPages}
        </Text>
        <Button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          isDisabled={page === totalPages || totalPages === 0 || approvalStore.loading}
          size="sm"
          variant="outline"
        >
          Next
        </Button>
      </Box>

      {/* COMPARISON DRAWER */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xl">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Comparison Details
            <Badge ml={2} colorScheme={tabIndex === 0 ? "orange" : tabIndex === 1 ? "green" : "red"}>
              {tabIndex === 0 ? "PENDING" : tabIndex === 1 ? "APPROVED" : "REJECTED"}
            </Badge>
          </DrawerHeader>

          <DrawerBody bg="gray.50" p={6}>
            {selectedItem && (
              <Box bg="white" p={4} borderRadius="md" shadow="sm">
                <Grid templateColumns="1.5fr 1fr 1fr" gap={4} mb={2} pb={2} borderBottom="2px solid" borderColor="gray.200">
                  <Text fontWeight="bold" color="gray.600">Field</Text>
                  <Text fontWeight="bold" color="gray.600">Original Value</Text>
                  <Text fontWeight="bold" color="gray.600">New Value</Text>
                </Grid>

                <DataComparison
                  original={selectedItem.data.original}
                  updated={selectedItem.data.updated}
                />
              </Box>
            )}
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>

            {/* Show Action Buttons ONLY if inside Pending Tab (Index 0) */}
            {tabIndex === 0 && (
              <>
                <Button
                  colorScheme="red"
                  mr={3}
                  onClick={() => handleAction("rejected")}
                  isLoading={approvalStore.actionLoading}
                >
                  Reject
                </Button>
                <Button
                  colorScheme="green"
                  onClick={() => handleAction("approved")}
                  isLoading={approvalStore.actionLoading}
                >
                  Approve
                </Button>
              </>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default observer(Approvals);