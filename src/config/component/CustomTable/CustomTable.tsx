import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { BiDownload, BiPlus, BiUpload } from "react-icons/bi";
import { FaEdit, FaEye } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdInformationCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { litePrimaryColor, primaryColor } from "../../../globalColors";
import {
  formatTableDate,
  isTableDateColumn,
} from "../../constant/dateUtils";
import Pagination from "../pagination/Pagination";
import TableLoader from "./TableLoader";

/* -------------------- Types -------------------- */

interface Column {
  headerName?: string;
  key?: string;
  type?: string;
  function?: any;
  props?: any;
  metaData?: {
    component?: (row: RowData) => JSX.Element;
    function?: (row: RowData) => void;
  };
}

interface RowData {
  [key: string]: any;
}

interface CustomTableProps {
  title?: string;
  columns: Column[];
  data: RowData[];
  serial?: any;
  loading: boolean;
  actions?: any;
  variant?: string;
  tableProps?: any;
}

/* -------------------- Action Cell -------------------- */

const TableActions = ({ actions, column, row }: any) => {
  const iconColor = useColorModeValue("gray.600", "gray.300");
  const deleteColor = useColorModeValue("red.500", "red.300");

  return (
    <Td textAlign="center" whiteSpace="nowrap" {...column?.props?.row}>
      <Flex justify="center" gap={1}>
        {actions?.actionBtn?.editKey?.showEditButton && (
          <IconButton
            aria-label="edit"
            icon={<FaEdit />}
            size="sm"
            variant="ghost"
            color={iconColor}
            _hover={{ bg: litePrimaryColor }}
            onClick={() => actions.actionBtn.editKey.function(row)}
          />
        )}
        {actions?.actionBtn?.viewKey?.showViewButton && (
          <IconButton
            aria-label="view"
            icon={<FaEye />}
            size="sm"
            variant="ghost"
            color={iconColor}
            _hover={{ bg: litePrimaryColor }}
            onClick={() => actions.actionBtn.viewKey.function(row)}
          />
        )}
        {actions?.actionBtn?.deleteKey?.showDeleteButton && (
          <IconButton
            aria-label="delete"
            icon={<MdDelete />}
            size="sm"
            variant="ghost"
            color={deleteColor}
            _hover={{ bg: "red.50" }}
            onClick={() => actions.actionBtn.deleteKey.function(row)}
          />
        )}
      </Flex>
    </Td>
  );
};

/* -------------------- Cell Renderer -------------------- */

const GenerateRows = ({ column, row, action }: any) => {
  if (isTableDateColumn(column)) {
    return <Td whiteSpace="nowrap">{formatTableDate(row[column.key])}</Td>;
  }

  switch (column.type) {
    case "tooltip":
      return (
        <Td maxW="200px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          <Tooltip label={row[column.key]}>
            <span>{row[column.key]?.substring(0, 20) || "--"}</span>
          </Tooltip>
        </Td>
      );

    case "array":
      return (
        <Td textAlign="center" whiteSpace="nowrap">
          <Tooltip label={JSON.stringify(row[column.key])}>
            <IconButton
              aria-label="info"
              icon={<IoMdInformationCircle />}
              size="sm"
              variant="ghost"
            />
          </Tooltip>
        </Td>
      );

    case "component":
      return <Td whiteSpace="nowrap">{column.metaData?.component?.(row)}</Td>;

    case "table-actions":
      return <TableActions actions={action} column={column} row={row} />;

    default:
      return (
        <Td
          maxW="220px"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {row[column.key] !== undefined && row[column.key] !== null ? row[column.key] : "--"}
        </Td>
      );
  }
};

/* -------------------- Main Table -------------------- */

const CustomTable: React.FC<CustomTableProps> = ({
  title,
  columns,
  data,
  serial,
  loading,
  actions,
  variant="striped",
  tableProps = {},
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Box
      bg="white"
      rounded="2xl"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="0 10px 25px rgba(0,0,0,0.08)"
      p={4}
      w="100%"
      overflow="hidden"
    >
      {/* ---------- Header ---------- */}
      <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={2}>
        {title && (
          <Heading fontSize={isMobile ? "md" : "lg"} fontWeight="600">
            {title}
          </Heading>
        )}

        <Flex gap={2} align="center">
          {actions?.search?.show && !isMobile && (
            <Input
              placeholder={actions.search.placeholder || "Search"}
              value={actions.search.searchValue}
              onChange={actions.search.onSearchChange}
              bg="gray.50"
              borderRadius="full"
              height="40px"
              fontSize="sm"
            />
          )}

          {actions?.resetData?.show && (
            <IconButton
              aria-label="refresh"
              icon={<FiRefreshCw />}
              variant="outline"
              onClick={actions.resetData.function}
            />
          )}

          {actions && (
            <Menu>
              <MenuButton as={Button} variant="outline" borderRadius="full">
                <Icon as={HiDotsVertical} />
              </MenuButton>
            <Portal>

              <MenuList>
                {actions?.actionBtn?.addKey?.showAddButton && (
                  <MenuItem
                    icon={<BiPlus />}
                    onClick={() => actions.actionBtn.addKey.function("add")}
                  >
                    Add
                  </MenuItem>
                )}

                {actions?.exportExcel?.show && (
                  <MenuItem
                    icon={<BiDownload />}
                    onClick={actions.exportExcel.function}
                  >
                    {actions.exportExcel.label || "Export Excel"}
                  </MenuItem>
                )}

                {actions?.downloadExcel?.show && (
                  <MenuItem
                    icon={<BiDownload />}
                    onClick={actions.downloadExcel.function}
                  >
                    {actions.downloadExcel.label || "Download Data"}
                  </MenuItem>
                )}

                {actions?.uploadFile?.show && (
                  <MenuItem as="label" htmlFor="file-upload" icon={<BiUpload />}>
                    Upload Excel
                    <input
                      id="file-upload"
                      type="file"
                      ref={fileInputRef}
                      hidden
                      onChange={actions.uploadFile.function}
                    />
                  </MenuItem>
                )}
              </MenuList>
            </Portal>
            </Menu>
          )}
        </Flex>
      </Flex>

      {/* ---------- Table ---------- */}
      <Box
        w="100%"
        overflowX="auto"
        overflowY="auto"
        maxH="65vh"
      >
        <Table
          size="sm"
          w="100%"
          variant={variant}
          minW="900px"
          tableLayout="fixed"
          {...tableProps.table}
        >
          <Thead bgGradient={`linear(to-r, ${primaryColor}, #1A365D)`} position={'sticky'} top={0} zIndex={1}>
            <Tr h="56px">
              {serial?.show && (
                <Th color="white" fontSize="xs" whiteSpace="nowrap">
                  S.No.
                </Th>
              )}
              {columns.map((col, i) => (
                <Th
                  key={i}
                  color="white"
                  fontSize="xs"
                  whiteSpace="nowrap"
                >
                  {col.headerName}
                </Th>
              ))}
            </Tr>
          </Thead>

          <TableLoader loader={loading} show={data.length}>
            <Tbody>
              {data.map((row, rowIndex) => (
                <Tr key={rowIndex} _hover={{ bg: "gray.50" }}>
                  {serial?.show && <Td>{rowIndex + 1}</Td>}
                  {columns.map((column, colIndex) => (
                    <GenerateRows
                      key={colIndex}
                      column={column}
                      row={row}
                      action={actions}
                    />
                  ))}
                </Tr>
              ))}
            </Tbody>
          </TableLoader>
        </Table>
      </Box>

      {/* ---------- Pagination ---------- */}
      {actions?.pagination?.show && (
        <Flex justify="flex-end" mt={4}>
          <Pagination
            currentPage={actions.pagination.currentPage}
            totalPages={actions.pagination.totalPages}
            onPageChange={actions.pagination.onClick}
          />
        </Flex>
      )}
    </Box>
  );
};

export default CustomTable;
