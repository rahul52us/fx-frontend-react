import { AttachmentIcon, DownloadIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Text,
  Tr,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import RestrictedAccess from "../../../../../config/component/common/RestrictedAccess/RestrictedAccess";
import { usePermission } from "../../../../../config/component/customHooks/usePermission";
import { primaryColor } from "../../../../../globalColors";
import store from "../../../../../store/store";

type TableColumn = { headerName: string; key: string };
const PAGE_SIZE = 10;

const flattenRow = (row: Record<string, any>) => {
  const flattened: Record<string, any> = {};
  const visit = (value: any, path: string) => {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      Object.entries(value).forEach(([key, nestedValue]) => visit(nestedValue, path ? `${path} ${key}` : key));
    } else {
      flattened[path] = Array.isArray(value) ? JSON.stringify(value) : value;
    }
  };
  Object.entries(row).forEach(([key, value]) => {
    if (key.toLowerCase() === "rowid" || key.toLowerCase() === "row_id") return;
    visit(value, key);
  });
  return flattened;
};

const formatHeader = (value: string) => {
  const tokens = value.replace(/_/g, " ").split(/\s+/).filter(Boolean).map((token) => token.toUpperCase());
  if (tokens[0] === "DATA") tokens.shift();

  const currencies = new Set(["USD", "EUR", "GBP", "JPY", "CHF", "RUB", "CNY", "AED", "SEK", "SGD", "BRL", "CAD", "KRW", "AUD", "TRY", "IDR", "ZAR", "ARS", "SAR", "MXN"]);
  const currency = tokens[0];
  if (currencies.has(currency) && tokens[1] === "INR") {
    if (tokens[2] === currency && tokens[3] === "INR") {
      tokens.splice(0, 4, `${currency}INR`);
    } else if (tokens[2] === currency && tokens[3] !== "INR") {
      tokens.splice(0, 2);
    } else {
      tokens.splice(0, 2, `${currency}INR`);
    }
  }

  return tokens.map((token) => token === "USDINR" || token.endsWith("INR") ? token : token.charAt(0) + token.slice(1).toLowerCase()).join(" ");
};

const formatCellValue = (value: any) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number" || (typeof value === "string" && /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(value.trim()))) {
    return Number(value).toFixed(4).replace(/\.?0+$/, "");
  }
  return String(value);
};

const getResponseRows = (responseData: any): Record<string, any>[] => {
  let payload = responseData?.data?.data ?? responseData?.data?.rows ?? responseData?.data ?? responseData?.rows ?? responseData?.results;
  if (payload && !Array.isArray(payload) && typeof payload === "object" && payload.data && typeof payload.data === "object") {
    payload = payload.data;
  }
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  // RP view responses can group records under keys such as "0__99", "100__199".
  const groupedEntries = Object.entries(payload).filter(([key, value]) => /^\d+__\d+$/.test(key) && Array.isArray(value));
  if (groupedEntries.length) {
    const groupedValues = groupedEntries.flatMap(([, value]) => value as any[]);
    if (groupedValues.every((value) => value && typeof value === "object" && !Array.isArray(value))) return groupedValues;
    const maxLength = Math.max(...groupedEntries.map(([, value]) => (value as any[]).length));
    return Array.from({ length: maxLength }, (_, index) => {
      const row: Record<string, any> = {};
      groupedEntries.forEach(([key, value]) => { row[key] = (value as any[])[index] ?? ""; });
      return row;
    });
  }

  return [payload as Record<string, any>];
};

const RpTable = () => {
  const [loading, setLoading] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [page, setPage] = useState(1);
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { canView } = usePermission("rp");
  const isSuperAdmin = store.auth.user?.role === "superadmin";
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const tableHeaderBg = useColorModeValue("teal.500", "gray.700");
  const tableBg = useColorModeValue("white", "gray.800");

  const fetchRpData = useCallback(async (search: string) => {
    const baseUrl = process.env.REACT_APP_FX_BASE_URL;
    const response = await axios.post(`${baseUrl}/rp/view/`, {
      userToken: "abcxyz",
      filters: { isFilter: Boolean(search), search },
    });
    const resultRows = getResponseRows(response.data).map(flattenRow);
    setRows(resultRows);
    setColumns(resultRows.length ? Object.keys(resultRows[0]).map((key) => ({ headerName: key, key })) : []);
    setPage(1);
    return resultRows;
  }, []);

  useEffect(() => {
    if (!canView) return;
    setLoading(true);
    setHasSearched(true);
    fetchRpData("")
      .catch((error: any) => {
        console.error("Failed to load RP data", error);
        toast({
          title: "Could not load RP data",
          description: error?.response?.data?.message || error?.message || "Failed to connect to the server.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => setLoading(false));
  }, [canView, fetchRpData, toast]);

  const handleSearch = async () => {
    const [year, month, day] = searchDate.split("-");
    const search = year && month && day ? `${day}.${month}.${year}` : "";
    setLoading(true);
    setRows([]);
    setColumns([]);
    setHasSearched(true);
    try {
      await fetchRpData(search);
    } catch (error: any) {
      console.error("Failed to fetch RP data", error);
      toast({ title: "Could not load RP data", description: error?.response?.data?.message || error?.message || "Failed to connect to the server.", status: "error", duration: 5000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilter = async () => {
    setSearchDate("");
    setLoading(true);
    setRows([]);
    setColumns([]);
    setHasSearched(true);
    try {
      await fetchRpData("");
    } catch (error: any) {
      console.error("Failed to clear RP filter", error);
      toast({ title: "Could not load RP data", description: error?.response?.data?.message || error?.message || "Failed to connect to the server.", status: "error", duration: 5000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setRows([]);
    setColumns([]);
    setPage(1);

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Could not read the selected file."));
        reader.onerror = () => reject(reader.error || new Error("Could not read the selected file."));
        reader.readAsDataURL(file);
      });
      const base64 = dataUrl.substring(dataUrl.indexOf(",") + 1);
      const baseUrl = process.env.REACT_APP_FX_BASE_URL;
      const response = await axios.post(`${baseUrl}/rp/form/`, { data: base64 });
      if (response.data?.status === "error" || response.data?.status === "failed") {
        throw new Error(response.data?.message || "The server could not process this workbook.");
      }
      toast({
        title: "Upload processed",
        description: response.data?.message || "File uploaded successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error: any) {
      console.error("RP Excel upload failed", error);
      toast({
        title: "Upload failed",
        description: error?.response?.data?.message || error?.message || "Failed to connect to the server.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/excel/RP_Sample.xlsx";
    link.download = "RP_Sample.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!canView) return <RestrictedAccess />;

  return (
    <Box p={4}>
      <Flex align="center" justify="space-between" mb={6}>
        <VStack align="start" spacing={0}>
          <Heading size="lg" color={primaryColor}>Realized Profit (RP)</Heading>
          <Text color="gray.500" fontSize="sm">Manage and upload your realized profit data.</Text>
        </VStack>
        {isSuperAdmin && (
          <Button onClick={handleDownload} leftIcon={<DownloadIcon />} colorScheme="blue" variant="outline" size="sm">
            Download Sample Template
          </Button>
        )}
      </Flex>

      <Flex mb={5} gap={4} align="end" justify="space-between" wrap="wrap">
        <Flex gap={3} align="end" wrap="wrap">
          <Box w={{ base: "100%", sm: "320px" }}>
            <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.600">Filter RP data by date</Text>
            <Input
              type="date"
              value={searchDate}
              onChange={(event) => setSearchDate(event.target.value)}
              aria-label="Filter RP data by date"
            />
          </Box>
          <Button colorScheme="blue" onClick={handleSearch} isLoading={loading}>
            Filter data
          </Button>
          <Button variant="outline" onClick={handleClearFilter} isLoading={loading}>
            Clear filter
          </Button>
        </Flex>
        {isSuperAdmin && (
          <Button
            colorScheme="teal"
            leftIcon={<AttachmentIcon />}
            onClick={() => fileInputRef.current?.click()}
            isLoading={loading}
            loadingText="Uploading..."
          >
            Upload data
          </Button>
        )}
        <input accept=".xlsx" ref={fileInputRef} type="file" onChange={handleFileUpload} style={{ display: "none" }} />
      </Flex>

      {hasSearched && !loading && rows.length === 0 && (
        <Text mt={4} color="gray.500">No RP data found for this filter.</Text>
      )}

      {columns.length > 0 && hasSearched && (
        <Box mt={2} bg={tableBg} rounded="2xl" shadow="xl" overflow="hidden" border="1px solid" borderColor={borderColor}>
          <Flex p={6} borderBottom="1px solid" borderColor={borderColor} justify="space-between" align="center">
            <Heading size="md" color="teal.700">Realized Profit Data</Heading>
            <Text fontSize="sm" color="gray.500">{rows.length} rows</Text>
          </Flex>
          <Box overflow="auto" maxH="80vh" position="relative">
            {loading && <Center position="absolute" inset={0} bg="whiteAlpha.700" zIndex={2}><Spinner size="xl" color="teal.500" /></Center>}
            <Table variant="simple" size="sm">
              <Thead bg={tableHeaderBg} position="sticky" top={0} zIndex={3}>
                <Tr>
                  {columns.map((column, index) => (
                    <Th key={column.key} color="white" py={4} whiteSpace="nowrap" position={index === 0 ? "sticky" : "static"} left={0} zIndex={index === 0 ? 4 : 1} bg={tableHeaderBg} borderRight={index === 0 ? "1px solid" : undefined} borderColor={borderColor}>
                      {formatHeader(column.headerName)}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((row, rowIndex) => (
                  <Tr key={rowIndex} _hover={{ bg: "teal.50" }}>
                    {columns.map((column, columnIndex) => (
                      <Td key={column.key} whiteSpace="nowrap" position={columnIndex === 0 ? "sticky" : "static"} left={0} zIndex={columnIndex === 0 ? 1 : "auto"} bg={columnIndex === 0 ? tableBg : undefined} borderRight={columnIndex === 0 ? "1px solid" : undefined} borderColor={borderColor}>
                        {formatCellValue(row[column.key])}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          {rows.length > PAGE_SIZE && (
            <Flex px={6} py={4} borderTop="1px solid" borderColor={borderColor} justify="space-between" align="center">
              <Text fontSize="sm" color="gray.500">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, rows.length)} of {rows.length}</Text>
              <Flex gap={2} align="center">
                <Button size="sm" variant="outline" onClick={() => setPage((current) => Math.max(1, current - 1))} isDisabled={page === 1}>Previous</Button>
                <Text fontSize="sm">Page {page} of {Math.ceil(rows.length / PAGE_SIZE)}</Text>
                <Button size="sm" variant="outline" onClick={() => setPage((current) => Math.min(Math.ceil(rows.length / PAGE_SIZE), current + 1))} isDisabled={page >= Math.ceil(rows.length / PAGE_SIZE)}>Next</Button>
              </Flex>
            </Flex>
          )}
        </Box>
      )}

      {!hasSearched && (
        <Center minH="320px" bg={tableBg} rounded="2xl" border="1px solid" borderColor={borderColor}>
          <Text color="gray.500">Choose a date and click Filter data, or clear the date to view all RP data.</Text>
        </Center>
      )}
      {hasSearched && loading && columns.length === 0 && (
        <Center minH="320px" bg={tableBg} rounded="2xl" border="1px solid" borderColor={borderColor}>
          <Spinner size="xl" color="teal.500" />
        </Center>
      )}
    </Box>
  );
};

export default RpTable;
