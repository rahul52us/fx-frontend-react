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

const DataComparison = ({ original, updated, depth = 0 }:any) => {
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
  const {auth:{user}}=store;
  const currentUserId =  user.userId;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await approvalStore.getEditedData(currentUserId);
  };

  const handleRowClick = (item: any) => {
    setSelectedItem(item);
    onOpen();
  };

  const handleAction = async (actionType: "approved" | "rejected") => {
    if (!selectedItem) return;
    // Constructing payload exactly as per CURL requirement
    const payload = {
      userId: currentUserId,
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
  const DataTable = ({ data }: { data: any[] }) => {
    if (!data || data.length === 0) return <Box p={4} textAlign="center" color="gray.500">No data available</Box>;

    return (
      <Table variant="simple" size="sm">
        <Thead bg="gray.50">
          <Tr>
            <Th>Register</Th>
            <Th>Party Name</Th>
            <Th>Amount</Th>
            <Th>Exposure</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, idx) => {
            const display = item.data.updated || item.data.original;
            return (
              <Tr key={idx} _hover={{ bg: "gray.50", cursor: "pointer" }} onClick={() => handleRowClick(item)}>
                <Td textTransform={'capitalize'}>{item?.register}</Td>
                <Td fontWeight="medium">{display.partyName}</Td>
                <Td>{Number(display.amount).toLocaleString()} {display.currency}</Td>
                <Td><Tag size="sm">{display.exposureType}</Tag></Td>
                <Td><Button size="xs" colorScheme="teal" variant="outline">View</Button></Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    );
  };

  return (
    <Box p={6} bg="white" borderRadius="lg" shadow="sm">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Data Approvals</Text>
      
      {approvalStore.loading ? (
        <Box display="flex" justifyContent="center" py={10}><Spinner /></Box>
      ) : (
        <Tabs onChange={(index) => setTabIndex(index)} colorScheme="teal">
          <TabList>
            <Tab>Pending <Badge ml={2} colorScheme="orange" borderRadius="full">{approvalStore.approvalData.pendingCount}</Badge></Tab>
            <Tab>Approved <Badge ml={2} colorScheme="green" borderRadius="full">{approvalStore.approvalData.approvedCount}</Badge></Tab>
            <Tab>Rejected <Badge ml={2} colorScheme="red" borderRadius="full">{approvalStore.approvalData.rejectedCount}</Badge></Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0} pt={4}>
              <DataTable data={approvalStore.approvalData.pending} />
            </TabPanel>
            <TabPanel p={0} pt={4}>
              <DataTable data={approvalStore.approvalData.approved} />
            </TabPanel>
            <TabPanel p={0} pt={4}>
              <DataTable data={approvalStore.approvalData.rejected} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}

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