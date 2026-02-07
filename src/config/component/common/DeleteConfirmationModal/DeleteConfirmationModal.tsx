import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Box,
  Icon,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Entry",
  description = "Are you sure? You can't undo this action afterwards.",
  isLoading = false,
}: DeleteConfirmationModalProps) => {
  const cancelRef = useRef<any>();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
      motionPreset="slideInBottom"
    >
      <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(2px)">
        <AlertDialogContent
          borderRadius="xl"
          boxShadow="2xl"
          textAlign="center"
          p={6}
        >
          <Box
            mx="auto"
            mb={4}
            p={3}
            bg="red.50"
            color="red.500"
            borderRadius="full"
            width="fit-content"
          >
            <Icon as={FiAlertTriangle} w={8} h={8} />
          </Box>

          <AlertDialogHeader fontSize="xl" fontWeight="bold" p={0} mb={2}>
            {title}
          </AlertDialogHeader>

          <AlertDialogBody fontSize="md" color="gray.500" p={0} mb={6}>
            {description}
          </AlertDialogBody>

          <AlertDialogFooter p={0} justifyContent="center" gap={3}>
            <Button
              ref={cancelRef}
              onClick={onClose}
              isDisabled={isLoading}
              variant="ghost"
              size="lg"
              fontSize="md"
              flex={1}
              borderRadius="lg"
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={onConfirm}
              isLoading={isLoading}
              size="lg"
              fontSize="md"
              flex={1}
              borderRadius="lg"
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeleteConfirmationModal;
