import { CheckIcon, ChevronRightIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  Skeleton,
  Spinner,
  Switch,
  Tab,
  Table,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { BiRefresh } from 'react-icons/bi';

interface HedgeDeal {
  hedgeDealRefNo: string;
  hedgeRate: string;
  deliveryDateFrom: string;
  deliveryDateTo: string;
  hedgeAmount: string;
  outstandingAmount: string;
  balanceAmount: string;
}

interface ExposureData {
  rowId: string;
  exposureType: string;
  poNo: string;
  poDate: string;
  partyName: string;
  bank: string;
  businessUnit: string;
  invoiceNo: string;
  invoiceDate: string;
  blDate: string;
  paymentTerms: string;
  dueDate: string;
  currency: string;
  amount: string;
  budgetRate: string;
  hedgeDeals: HedgeDeal[];
  outstandingAmountForm: string;
  spotOnBmkDate: number;
  premiumOnBmkDate: number;
  bmkRate: number;
  rmPolicyRate: string;
  outstandingAmount: number;
  outstandingAmountInINR: number;
  invoiceRaised: number;
  advancePayment: number;
  advanceRealizationRate: number;
  amountSettled: number;
  settlementRate1: number;
  PlInINR: number;
  advaceAllotment: number;
  advanceRate: number;
  invoiceSettlement: number;
  settlementRate: number;
  inrAmount: number;
  remark: string;
  createdAt: string;
}

interface ApprovalItem {
  original: ExposureData;
  updated: Partial<ExposureData> & { hedgeDeals?: HedgeDeal[] };
  rowId: string;
}

interface ApprovalResponse {
  pending: ApprovalItem[];
  approved: any[];
  rejected: any[];
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalDataCount: number;
}

const Approvals = () => {
  const url = process.env.REACT_APP_FX_BASE_URL;
  const [data, setData] = useState<ApprovalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [showOnlyChanges, setShowOnlyChanges] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isDialogOpen, 
    onOpen: onDialogOpen, 
    onClose: onDialogClose 
  } = useDisclosure();
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching data from:', `${url}/api/getedited/`);
      
      const payload = {
        register: "export",
        userId: "379e8658-7450-4ff6-a24d-580bb38393ad"
      };

      // console.log('Payload:', payload);

      const response = await axios.post(
        `${url}/api/getedited/`,
        payload
      );
      
      // console.log('API Response:', response);
      // console.log('Response data:', response.data);
      // console.log('Pending data:', response.data?.data?.pending);
      
      if (response.data && response.data.data) {
        setData(response.data.data);
        console.log('Data set successfully:', response.data.data);
      } else {
        throw new Error('Invalid response structure');
      }
      
    } catch (error: any) {
      console.error('Error fetching data:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      setError(errorMessage);
      toast({
        title: "Error fetching data",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRowClick = (item: ApprovalItem) => {
    console.log('Row clicked:', item);
    setSelectedItem(item);
    onOpen();
  };

  const handleAction = (type: 'approve' | 'reject') => {
    setActionType(type);
    onDialogOpen();
  };

  const confirmAction = async () => {
    if (!selectedItem) return;
    
    try {
      const payload = {
        rowId: selectedItem.rowId,
        action: actionType,
        userId: "379e8658-7450-4ff6-a24d-580bb38393ad"
      };

      const response = await axios.post(
        `${url}/api/process-approval/`,
        payload
      );

      console.log('response',response)

      toast({
        title: `Item ${actionType === 'approve' ? 'Approved' : 'Rejected'} Successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onDialogClose();
      onClose();
      fetchData(); // Refresh data
    } catch (error: any) {
      console.error('Error processing action:', error.message);
      toast({
        title: "Error processing action",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatCurrency = (value: string | number) => {
    if (value === undefined || value === null) return 'N/A';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return value;
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const FieldComparison = ({ field, label }: { field: keyof ExposureData; label: string }) => {
    if (!selectedItem) return null;
    
    const originalValue = selectedItem.original[field];
    const updatedValue = selectedItem.updated[field];
    
    const hasChanged = originalValue !== updatedValue;
    
    if (showOnlyChanges && !hasChanged) return null;
    
    return (
      <VStack align="stretch" spacing={1} mb={4}>
        <HStack justify="space-between">
          <Text fontWeight="medium">{label}:</Text>
          {hasChanged && (
            <Badge colorScheme="yellow" fontSize="xs">CHANGED</Badge>
          )}
        </HStack>
        <HStack spacing={4}>
          <Card flex={1} variant="outline" bg={hasChanged ? "red.50" : "gray.50"}>
            <CardBody p={3}>
              <Text fontSize="sm" fontWeight="semibold" color="gray.600">Original</Text>
              <Text>{originalValue === '' || originalValue === undefined || originalValue === null ? 'Empty' : String(originalValue)}</Text>
            </CardBody>
          </Card>
          <ChevronRightIcon color="gray.400" />
          <Card flex={1} variant="outline" bg={hasChanged ? "green.50" : "gray.50"}>
            <CardBody p={3}>
              <Text fontSize="sm" fontWeight="semibold" color="gray.600">Updated</Text>
              <Text>{updatedValue === '' || updatedValue === undefined || updatedValue === null ? 'Empty' : String(updatedValue)}</Text>
            </CardBody>
          </Card>
        </HStack>
      </VStack>
    );
  };

  // Debug information
  // useEffect(() => {
  //   if (data) {
  //     console.log('Current data state:', data);
  //     console.log('Pending items count:', data.pending?.length || 0);
  //     console.log('First pending item:', data.pending?.[0]);
  //   }
  // }, [data]);

  return (
    <Box p={5}>
      <VStack align="stretch" spacing={6}>
        {/* Debug Info - Remove in production */}
        <Card bg="yellow.50" display="none"> {/* Hide in production */}
          <CardBody>
            <Text fontWeight="bold">Debug Info:</Text>
            <Text>URL: {url}</Text>
            <Text>Loading: {loading ? 'Yes' : 'No'}</Text>
            <Text>Error: {error || 'None'}</Text>
            <Text>Data: {data ? 'Loaded' : 'Not loaded'}</Text>
            <Text>Pending items: {data?.pending?.length || 0}</Text>
            <Button size="xs" onClick={() => console.log('Data:', data)} mt={2}>
              Log Data
            </Button>
          </CardBody>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Failed to load data</Text>
              <Text fontSize="sm">{error}</Text>
              <Button size="sm" mt={2} onClick={fetchData}>
                Retry
              </Button>
            </Box>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <VStack spacing={4}>
            <Spinner size="xl" />
            <Text>Loading approvals...</Text>
            <Skeleton height="200px" width="100%" />
          </VStack>
        )}

        {/* Summary Cards */}
        {!loading && !error && (
          <HStack spacing={4}>
            <Card flex={1} bg="blue.50">
              <CardBody>
                <Text color="blue.600" fontWeight="bold">Pending</Text>
                <Text fontSize="2xl">{data?.pendingCount || 0}</Text>
              </CardBody>
            </Card>
            <Card flex={1} bg="green.50">
              <CardBody>
                <Text color="green.600" fontWeight="bold">Approved</Text>
                <Text fontSize="2xl">{data?.approvedCount || 0}</Text>
              </CardBody>
            </Card>
            <Card flex={1} bg="red.50">
              <CardBody>
                <Text color="red.600" fontWeight="bold">Rejected</Text>
                <Text fontSize="2xl">{data?.rejectedCount || 0}</Text>
              </CardBody>
            </Card>
            <Card flex={1}>
              <CardBody>
                <Text fontWeight="bold">Total</Text>
                <Text fontSize="2xl">{data?.totalDataCount || 0}</Text>
              </CardBody>
            </Card>
          </HStack>
        )}

        {/* Pending Approvals Table */}
        {!loading && !error && (
          <Card>
            <CardBody>
              <HStack justify="space-between" mb={4}>
                <Text fontSize="xl" fontWeight="bold">Pending Approvals</Text>
                <IconButton aria-label='refresh' colorScheme='blue' size={'sm'} variant={"outline"} onClick={fetchData} isLoading={loading} icon={<BiRefresh />} />
              </HStack>
              
              {(!data?.pending || data.pending.length === 0) ? (
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  No pending approvals found
                </Alert>
              ) : (
                <Box overflowX="auto">
                  <Table variant="simple" size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th>PO No</Th>
                        <Th>Party Name</Th>
                        <Th>Amount</Th>
                        <Th>Currency</Th>
                        <Th>Bank</Th>
                        <Th>Business Unit</Th>
                        <Th>Created At</Th>
                        <Th>Changes</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.pending?.map((item, index) => {
                        console.log(`Rendering item ${index}:`, item);
                        return (
                          <Tr 
                            key={item.rowId}
                            _hover={{ bg: "gray.50", cursor: "pointer" }}
                            onClick={() => handleRowClick(item)}
                          >
                            <Td fontWeight="medium">
                              {item.original?.poNo || 'N/A'}
                            </Td>
                            <Td>{item.original?.partyName || 'N/A'}</Td>
                            <Td>
                              <Text fontWeight="bold">
                                {formatCurrency(item.original?.amount || 0)}
                              </Text>
                              {item.original?.amount !== item.updated?.amount && (
                                <Text fontSize="xs" color="green.600">
                                  → {formatCurrency(item.updated?.amount || '')}
                                </Text>
                              )}
                            </Td>
                            <Td>{item.original?.currency || 'N/A'}</Td>
                            <Td>
                              <Tag size="sm" colorScheme={item.original?.bank !== item.updated?.bank ? "yellow" : "gray"}>
                                <TagLabel>{item.original?.bank || 'N/A'}</TagLabel>
                                {item.original?.bank !== item.updated?.bank && (
                                  <TagLabel ml={1}>→ {item.updated?.bank}</TagLabel>
                                )}
                              </Tag>
                            </Td>
                            <Td>
                              {item.original?.businessUnit || 'N/A'}
                              {item.original?.businessUnit !== item.updated?.businessUnit && (
                                <Text fontSize="xs" color="green.600">
                                  → {item.updated?.businessUnit}
                                </Text>
                              )}
                            </Td>
                            <Td>{item.original?.createdAt || 'N/A'}</Td>
                            <Td>
                              {(() => {
                                const changedFields = Object.keys(item.updated || {}).filter(key => {
                                  const originalVal = item.original?.[key as keyof ExposureData];
                                  const updatedVal = item.updated?.[key as keyof ExposureData];
                                  return originalVal !== updatedVal;
                                }).length;
                                
                                return changedFields > 0 ? (
                                  <Badge colorScheme="yellow">
                                    {changedFields} changes
                                  </Badge>
                                ) : (
                                  <Badge colorScheme="gray">No changes</Badge>
                                );
                              })()}
                            </Td>
                            <Td>
                              <Button 
                                size="xs" 
                                colorScheme="blue" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRowClick(item);
                                }}
                              >
                                Review
                              </Button>
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </CardBody>
          </Card>
        )}
      </VStack>

      {/* Comparison Drawer */}
      <Drawer isOpen={isOpen} onClose={onClose} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <VStack align="stretch" spacing={2}>
              <Text>Review Changes - {selectedItem?.original?.poNo || 'N/A'}</Text>
              <Text fontSize="sm" color="gray.600">
                Party: {selectedItem?.original?.partyName || 'N/A'}
              </Text>
            </VStack>
          </DrawerHeader>

          <DrawerBody>
            {selectedItem ? (
              <VStack align="stretch" spacing={4}>
                {/* Toggle Switch */}
                <HStack justify="space-between" bg="gray.50" p={3} borderRadius="md">
                  <Text fontSize="sm">Show only changed fields</Text>
                  <Switch 
                    isChecked={showOnlyChanges}
                    onChange={(e) => setShowOnlyChanges(e.target.checked)}
                    colorScheme="blue"
                  />
                </HStack>

                <Tabs >
                  <TabList>
                    <Tab>Basic Info</Tab>
                    <Tab>Financial Details</Tab>
                    <Tab>Hedge Deals</Tab>
                    <Tab>All Fields</Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <FieldComparison field="exposureType" label="Exposure Type" />
                      <FieldComparison field="poDate" label="PO Date" />
                      <FieldComparison field="invoiceDate" label="Invoice Date" />
                      <FieldComparison field="blDate" label="BL Date" />
                      <FieldComparison field="dueDate" label="Due Date" />
                      <FieldComparison field="bank" label="Bank" />
                      <FieldComparison field="businessUnit" label="Business Unit" />
                      <FieldComparison field="paymentTerms" label="Payment Terms" />
                      <FieldComparison field="budgetRate" label="Budget Rate" />
                      <FieldComparison field="remark" label="Remark" />
                    </TabPanel>

                    <TabPanel>
                      <FieldComparison field="amount" label="Amount" />
                      <FieldComparison field="currency" label="Currency" />
                      <FieldComparison field="spotOnBmkDate" label="Spot on BMK Date" />
                      <FieldComparison field="premiumOnBmkDate" label="Premium on BMK Date" />
                      <FieldComparison field="bmkRate" label="BMK Rate" />
                      <FieldComparison field="rmPolicyRate" label="RM Policy Rate" />
                      <FieldComparison field="outstandingAmount" label="Outstanding Amount" />
                      <FieldComparison field="outstandingAmountInINR" label="Outstanding Amount (INR)" />
                      <FieldComparison field="inrAmount" label="INR Amount" />
                    </TabPanel>

                    <TabPanel>
                      <VStack align="stretch" spacing={4}>
                        <Text fontWeight="bold" fontSize="lg">Hedge Deals Comparison</Text>
                        <Divider />
                        
                        <Text fontWeight="medium">Original Hedge Deals:</Text>
                        {selectedItem?.original?.hedgeDeals?.map((deal, index) => (
                          <Card key={index} variant="outline" bg="red.50">
                            <CardBody>
                              <VStack align="stretch" spacing={1}>
                                <Text fontWeight="bold">{deal.hedgeDealRefNo}</Text>
                                <Text>Amount: {formatCurrency(deal.hedgeAmount)}</Text>
                                <Text>Rate: {deal.hedgeRate}</Text>
                                <Text>Period: {deal.deliveryDateFrom} to {deal.deliveryDateTo}</Text>
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}

                        <Text fontWeight="medium">Updated Hedge Deals:</Text>
                        {selectedItem?.updated?.hedgeDeals?.map((deal, index) => (
                          <Card key={index} variant="outline" bg="green.50">
                            <CardBody>
                              <VStack align="stretch" spacing={1}>
                                <Text fontWeight="bold">{deal.hedgeDealRefNo}</Text>
                                <Text>Amount: {formatCurrency(deal.hedgeAmount)}</Text>
                                <Text>Rate: {deal.hedgeRate}</Text>
                                <Text>Period: {deal.deliveryDateFrom} to {deal.deliveryDateTo}</Text>
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}
                      </VStack>
                    </TabPanel>

                    <TabPanel>
                      <VStack align="stretch" spacing={3}>
                        {Object.keys(selectedItem?.original || {}).map((key) => {
                          if (key === 'hedgeDeals') return null;
                          return (
                            <FieldComparison 
                              key={key}
                              field={key as keyof ExposureData}
                              label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            />
                          );
                        })}
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>

                {/* Action Buttons */}
                <HStack justify="flex-end" spacing={3} mt={6} pt={4} borderTopWidth="1px">
                  <Button 
                    leftIcon={<CloseIcon />} 
                    colorScheme="red"
                    onClick={() => handleAction('reject')}
                  >
                    Reject
                  </Button>
                  <Button 
                    leftIcon={<CheckIcon />} 
                    colorScheme="green"
                    onClick={() => handleAction('approve')}
                  >
                    Approve
                  </Button>
                </HStack>
              </VStack>
            ) : (
              <Text>No item selected</Text>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Confirmation Dialog */}
      <AlertDialog
        isOpen={isDialogOpen}
        isCentered
        leastDestructiveRef={cancelRef}
        onClose={onDialogClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color={actionType === "approve" ? "green.500" : "red.500"}>
              {actionType === 'approve' ? 'Approve Changes' : 'Reject Changes'}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to {actionType} the changes for{" "}
              <strong>{selectedItem?.original?.poNo || 'N/A'}</strong>?
              {actionType === 'reject' && " This action cannot be undone."}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDialogClose}>
                Cancel
              </Button>
              <Button 
                colorScheme={actionType === 'approve' ? 'green' : 'red'} 
                onClick={confirmAction}
                ml={3}
              >
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Approvals;