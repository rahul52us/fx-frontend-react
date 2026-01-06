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
import { formatDate } from "../../constant/dateUtils";
import TableLoader from "./TableLoader";
import Pagination from "../pagination/Pagination";

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
  tableProps?: any;
}

/* -------------------- Action Cell -------------------- */

const TableActions = ({ actions, column, row }: any) => {
  const iconColor = useColorModeValue("gray.600", "gray.300");
  const deleteColor = useColorModeValue("red.500", "red.300");

  return (
    <Td textAlign="center" {...column?.props?.row}>
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
  switch (column.type) {
    case "date":
      return <Td>{row[column.key] ? formatDate(row[column.key]) : "--"}</Td>;

    case "tooltip":
      return (
        <Td>
          <Tooltip label={row[column.key]}>
            {row[column.key]?.substring(0, 20) || "--"}
          </Tooltip>
        </Td>
      );

    case "array":
      return (
        <Td textAlign="center">
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
      return <Td>{column.metaData?.component?.(row)}</Td>;

    case "table-actions":
      return <TableActions actions={action} column={column} row={row} />;

    default:
      return <Td>{row[column.key] || "--"}</Td>;
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
    >
      {/* ---------- Header ---------- */}
      <Flex justify="space-between" align="center" mb={4}>
        {title && (
          <Heading fontSize={isMobile ? "md" : "lg"} fontWeight="600">
            {title}
          </Heading>
        )}

        <Flex gap={2}>
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
                    Export Excel
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
            </Menu>
          )}
        </Flex>
      </Flex>

      {/* ---------- Table ---------- */}
      <Box overflow="auto" maxH="65vh">
        <Table size="sm" {...tableProps.table}>
          <Thead
            bgGradient={`linear(to-r, ${primaryColor}, #1A365D)`}
            boxShadow="inset 0 -1px 0 rgba(255,255,255,0.15)"
          >
            <Tr h="56px">
              {serial?.show && (
                <Th
                  color="white"
                  fontSize="xs"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                >
                  S.No.
                </Th>
              )}
              {columns.map((col, i) => (
                <Th
                  key={i}
                  color="white"
                  fontSize="xs"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                >
                  {col.headerName}
                </Th>
              ))}
            </Tr>
          </Thead>

          <TableLoader loader={loading} show={data.length}>
            <Tbody>
              {data.map((row, rowIndex) => (
                <Tr
                  key={rowIndex}
                  _hover={{
                    bg: "gray.50",
                    transition: "0.2s",
                  }}
                >
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
