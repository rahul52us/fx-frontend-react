import {
  Badge,
  Box,
  Button,
  Spinner,
  Tab,
  Table,
  TabList,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useApprovalApi } from "../../../../../config/component/customHooks/useApprovalApi";
import { ApprovalDrawer } from "../../../Approvals/component/ApprovalDrawer";
import { ApprovalItem } from "../../../Approvals/interface";
import { EXCLUDED_FIELDS, getErrorMessage, labelize } from "../../../Approvals/utils/constant";


// Convert camelCase → Title Case


const buildSectionsFromData = (item?: any) => {
  if (!item?.original) return [];

  const keys = Object.keys(item.original).filter(
    (k) => !EXCLUDED_FIELDS.includes(k)
  );

  const normalFields: any[] = [];
  let hedgeDealField: any | null = null;

  keys.forEach((key) => {
    if (key === "hedgeDeals") {
      hedgeDealField = {
        key,
        label: "Hedge Deals",
        render: (deals: any[]) => (
          <VStack align="stretch" spacing={3}>
            {deals?.length ? (
              deals.map((deal, index) => (
                <Box
                  key={index}
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                  bg="gray.50"
                >
                  <Text fontWeight="bold" mb={1}>
                    Hedge Deal {index + 1}
                  </Text>

                  {Object.entries(deal).map(([k, v]) => (
                    <Text fontSize="sm" key={k}>
                      <strong>{labelize(k)}:</strong>{" "}
                      {v === "" || v === null ? "—" : String(v)}
                    </Text>
                  ))}
                </Box>
              ))
            ) : (
              <Text fontSize="sm">No hedge deals</Text>
            )}
          </VStack>
        ),
      };
    } else {
      normalFields.push({
        key,
        label: labelize(key),
      });
    }
  });

  const sections: any[] = [];

  if (normalFields.length) {
    sections.push({
      title: "Details",
      fields: normalFields,
    });
  }

  if (hedgeDealField) {
    sections.push({
      title: "Hedge Deals",
      fields: [hedgeDealField],
    });
  }

  return sections;
};

/* =========================================================
   3️⃣ TABLE FIELDS (AUTO FROM DATA)
========================================================= */

const TABLE_VISIBLE_FIELDS = [
  "createdAt",
  "poNo",
  "partyName",
  "bank",
  "businessUnit",
  "currency",
  "amount",
];

/* =========================================================
   4️⃣ MAIN COMPONENT
========================================================= */

export default function ExportApprovals() {
  const [selected, setSelected] = useState<ApprovalItem<any> | null>(null);

  type ApprovalStatus = "pending" | "approved" | "rejected";

const [approvalData, setApprovalData] = useState<{
  pending: ApprovalItem<any>[];
  approved: ApprovalItem<any>[];
  rejected: ApprovalItem<any>[];
}>({
  pending: [],
  approved: [],
  rejected: [],
});

const [activeTab, setActiveTab] = useState<ApprovalStatus>("pending");
  // const {
  //   auth: { user  },
  // } = store;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const {
    loading,
    actionLoading,
    getApprovals,
    submitApproval,
  } = useApprovalApi();

  useEffect(() => {
    loadData();
  }, []);

const loadData = async () => {
  const res = await getApprovals({
    // register: "export",
    userId: "379e8658-7450-4ff6-a24d-580bb38393ad",
  });

  setApprovalData({
    pending: res.data.pending || [],
    approved: res.data.approved || [],
    rejected: res.data.rejected || [],
  });
};


  const sections = useMemo(
    () => buildSectionsFromData(selected),
    [selected]
  );

 const handleApproveReject = async (
  action: "approved" | "rejected"
) => {
  if (!selected) return;

  try {
    await submitApproval({
      register: "export",
      userId: "379e8658-7450-4ff6-a24d-580bb38393ad",
      action,
      data: [
        {
          original: selected.original,
          updated: selected.updated,
          rowId: selected.rowId,
        },
      ],
    });

    toast({
      title: `Successfully ${action}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    onClose();
    loadData();

  } catch (error: any) {
    const message = getErrorMessage(error);

    toast({
      title: "Approval Failed",
      description: message,
      status: "error",
      duration: 5000,
      isClosable: true,
    });

    // ❗ DO NOT close drawer
    // ❗ DO NOT reset selected
    console.error("Approval error:", error);
  }
};


  const currentList = approvalData[activeTab];


  if (loading) {
    return (
      <Box textAlign="center" p={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Export Approvals
        {/* <Badge ml={2} colorScheme="yellow">
          {pending.length}
        </Badge> */}
      </Text>

      {/* ================= TABLE ================= */}

      <Tabs
  index={["pending", "approved", "rejected"].indexOf(activeTab)}
  onChange={(i) =>
    setActiveTab(["pending", "approved", "rejected"][i] as any)
  }
  mb={4}
>
  <TabList>
    <Tab>
      Pending
      <Badge ml={2} colorScheme="yellow">
        {approvalData.pending.length}
      </Badge>
    </Tab>
    <Tab>
      Approved
      <Badge ml={2} colorScheme="green">
        {approvalData.approved.length}
      </Badge>
    </Tab>
    <Tab>
      Rejected
      <Badge ml={2} colorScheme="red">
        {approvalData.rejected.length}
      </Badge>
    </Tab>
  </TabList>
</Tabs>


      <Table size="sm" colorScheme="teal" variant={"striped"}>
        <Thead>
          <Tr>
            {TABLE_VISIBLE_FIELDS.map((key) => (
              <Th key={key}>{labelize(key)}</Th>
            ))}
            <Th textAlign="center">Action</Th>
          </Tr>
        </Thead>

        <Tbody>
  {currentList.map((item) => (
    <Tr key={item.rowId}>
      {TABLE_VISIBLE_FIELDS.map((key) => (
        <Td key={key}>{item.original?.[key] ?? "—"}</Td>
      ))}

      <Td textAlign="center">
        <Button
          size="xs"
          colorScheme="teal"
          onClick={() => {
            setSelected(item);
            onOpen();
          }}
        >
          View
        </Button>
      </Td>
    </Tr>
  ))}
</Tbody>

      </Table>

   <ApprovalDrawer
  item={selected}
  isOpen={isOpen}
  onClose={onClose}
  sections={sections}
  isSubmitting={actionLoading}
  hideActions={activeTab !== "pending"}
  onApprove={() => handleApproveReject("approved")}
  onReject={() => handleApproveReject("rejected")}
/>

    </Box>
  );
}
