import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  List,
  ListItem,
  ListIcon,
  Box,
  VStack,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";

interface BulkUploadError {
  row: number;
  message: string;
}

interface BulkUploadStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: {
    success: number;
    failures: number;
    errors: BulkUploadError[];
  };
  title?: string;
}

const BulkUploadStatusModal = ({ isOpen, onClose, results, title = "Bulk Upload Results" }: BulkUploadStatusModalProps) => {
  const isSuccess = results.failures === 0 && results.success > 0;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl" shadow="2xl">
        <ModalHeader borderBottomWidth="1px" pb={4}>
          <VStack align="start" spacing={1}>
            <Text fontSize="xl" fontWeight="bold">{title}</Text>
            <Text fontSize="sm" color="gray.500" fontWeight="normal">Review the summary of your excel upload</Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <VStack align="stretch" spacing={6}>
            <Box 
              p={4} 
              borderRadius="xl" 
              bg={isSuccess ? "green.50" : "orange.50"}
              border="1px solid"
              borderColor={isSuccess ? "green.100" : "orange.100"}
            >
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold" color={isSuccess ? "green.700" : "orange.700"}>Upload Summary</Text>
                <List spacing={1}>
                  <ListItem display="flex" alignItems="center">
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    <Text fontWeight="medium">Successfully Uploaded: {results.success}</Text>
                  </ListItem>
                  <ListItem display="flex" alignItems="center">
                    <ListIcon as={results.failures > 0 ? WarningIcon : CheckCircleIcon} color={results.failures > 0 ? "red.500" : "green.500"} />
                    <Text fontWeight="medium" color={results.failures > 0 ? "red.600" : "inherit"}>
                      Failures: {results.failures}
                    </Text>
                  </ListItem>
                </List>
              </VStack>
            </Box>

            {results.errors.length > 0 && (
              <Box>
                <Heading size="xs" textTransform="uppercase" letterSpacing="wider" mb={3} color="gray.500">
                  Detailed Error Log
                </Heading>
                <VStack 
                  align="stretch" 
                  spacing={0} 
                  maxH="250px" 
                  overflowY="auto" 
                  border="1px solid" 
                  borderColor="gray.100" 
                  borderRadius="lg"
                  divider={<Divider />}
                >
                  {results.errors.map((err, index) => (
                    <Box key={index} p={3} _hover={{ bg: "gray.50" }}>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="xs" fontWeight="bold" color="blue.600" px={2} py={0.5} bg="blue.50" borderRadius="full" w="fit-content">
                          ROW {err.row}
                        </Text>
                        <Text fontSize="sm" color="gray.700">{err.message}</Text>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter borderTopWidth="1px" pt={4}>
          <Button 
            variant="ghost" 
            mr={3} 
            onClick={onClose}
            borderRadius="lg"
          >
            Close
          </Button>
          <Button 
            colorScheme={isSuccess ? "green" : "blue"} 
            onClick={onClose}
            borderRadius="lg"
            px={8}
          >
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BulkUploadStatusModal;
