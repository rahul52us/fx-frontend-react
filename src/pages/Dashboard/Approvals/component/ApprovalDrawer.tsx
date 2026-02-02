import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  HStack,
  Switch,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  VStack,
  Button,
  Text,
  DrawerFooter,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { ApprovalDrawerProps } from "../interface";
import { FieldComparison } from "./FieldComparison";

export function ApprovalDrawer<T>({
  item,
  sections,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isSubmitting,
  hideActions,
}: ApprovalDrawerProps<T>) {
  const [showOnlyChanges, setShowOnlyChanges] = useState(true);

  // 🔹 Confirmation dialog state
  const [actionType, setActionType] = useState<
    "approve" | "reject" | null
  >(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  if (!item) return null;

  const handleConfirm = () => {
    if (!actionType) return;

    if (actionType === "approve") {
      onApprove(item.rowId);
    } else {
      onReject(item.rowId);
    }

    setActionType(null);
  };

  return (
    <>
      <Drawer isOpen={isOpen} onClose={onClose} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Review Changes</DrawerHeader>

          <DrawerBody>
            <HStack justify="space-between" mb={4}>
              <Text>Show only changes</Text>
              <Switch
                isChecked={showOnlyChanges}
                onChange={(e) =>
                  setShowOnlyChanges(e.target.checked)
                }
              />
            </HStack>

            <Tabs>
              <TabList>
                {sections.map((s) => (
                  <Tab key={s.title}>{s.title}</Tab>
                ))}
              </TabList>

              <TabPanels>
                {sections.map((section) => (
                  <TabPanel key={section.title}>
                    <VStack align="stretch" spacing={4}>
                      {section.fields.map((field) => (
                        <FieldComparison
                          key={String(field.key)}
                          field={field}
                          original={item.original}
                          updated={item.updated}
                          showOnlyChanges={showOnlyChanges}
                        />
                      ))}
                    </VStack>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </DrawerBody>

          <DrawerFooter>
            {!hideActions && (
              <HStack justify="flex-end">
                <Button
                  colorScheme="red"
                  onClick={() => setActionType("reject")}
                  isLoading={isSubmitting}
                >
                  Reject
                </Button>
                <Button
                  colorScheme="green"
                  onClick={() => setActionType("approve")}
                  isLoading={isSubmitting}
                >
                  Approve
                </Button>
              </HStack>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* ================= CONFIRMATION MODAL ================= */}

      <AlertDialog
        isOpen={!!actionType}
        leastDestructiveRef={cancelRef}
        onClose={() => setActionType(null)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
              color={
                actionType === "approve"
                  ? "green.500"
                  : "red.500"
              }
            >
              {actionType === "approve"
                ? "Approve Changes"
                : "Reject Changes"}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to{" "}
              <strong>{actionType}</strong> the changes
              for <strong>{item.original?.poNo ?? "this record"}</strong>?
              {actionType === "reject" &&
                " This action cannot be undone."}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setActionType(null)}
              >
                Cancel
              </Button>
              <Button
                colorScheme={
                  actionType === "approve" ? "green" : "red"
                }
                onClick={handleConfirm}
                ml={3}
                isLoading={isSubmitting}
              >
                {actionType === "approve"
                  ? "Approve"
                  : "Reject"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
