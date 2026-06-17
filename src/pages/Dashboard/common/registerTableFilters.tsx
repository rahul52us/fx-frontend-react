import {
  Box,
  Button,
  Collapse,
  Flex,
  Input,
  Select,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FiFilter, FiSearch, FiX } from "react-icons/fi";

export type RegisterFilterOption = {
  label: string;
  value: string;
};

export type RegisterFilterField = {
  name: string;
  label: string;
  type?: "date" | "select";
  placeholder?: string;
  options?: RegisterFilterOption[];
};

export type RegisterFilterState = {
  startDate: string;
  endDate: string;
  search: string;
  [key: string]: string;
};

type RegisterFilterPanelProps = {
  fields: RegisterFilterField[];
  filterState: RegisterFilterState;
  hasAppliedFilters: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onApply: () => void;
  onClear: () => void;
};

type FilterTableDataConfig = {
  dateKeys?: string[];
  searchKeys?: string[];
};

export const createFilterState = (fields: RegisterFilterField[]): RegisterFilterState =>
  fields.reduce(
    (acc, field) => {
      acc[field.name] = "";
      return acc;
    },
    {
      startDate: "",
      endDate: "",
      search: "",
    } as RegisterFilterState
  );

export const hasActiveFilters = (filters: RegisterFilterState | null | undefined) =>
  !!filters && Object.values(filters).some((value) => `${value ?? ""}`.trim() !== "");

const normalizeValue = (value: any) => `${value ?? ""}`.trim().toLowerCase();

const parseRowDate = (row: any, dateKeys: string[] = []) => {
  for (const key of dateKeys) {
    const value = row?.[key];
    if (!value) continue;

    const parsedDate = new Date(value);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  return null;
};

export const filterTableData = (
  rows: any[],
  filters: RegisterFilterState | null | undefined,
  config: FilterTableDataConfig = {}
) => {
  if (!hasActiveFilters(filters)) {
    return rows;
  }

  const searchTerm = normalizeValue(filters?.search);
  const activeFieldFilters = Object.entries(filters || {}).filter(
    ([key, value]) =>
      !["startDate", "endDate", "search"].includes(key) &&
      `${value ?? ""}`.trim() !== ""
  );

  const startDate = filters?.startDate ? new Date(filters.startDate) : null;
  const endDate = filters?.endDate ? new Date(filters.endDate) : null;

  if (endDate) {
    endDate.setHours(23, 59, 59, 999);
  }

  return rows.filter((row) => {
    const rowDate = parseRowDate(row, config.dateKeys);

    if (startDate && rowDate && rowDate < startDate) {
      return false;
    }

    if (endDate && rowDate && rowDate > endDate) {
      return false;
    }

    if ((startDate || endDate) && !rowDate) {
      return false;
    }

    const matchesFieldFilters = activeFieldFilters.every(([key, value]) => {
      const rowValue = normalizeValue(row?.[key]);
      return rowValue === normalizeValue(value);
    });

    if (!matchesFieldFilters) {
      return false;
    }

    if (!searchTerm) {
      return true;
    }

    return (config.searchKeys || []).some((key) =>
      normalizeValue(row?.[key]).includes(searchTerm)
    );
  });
};

export const paginateRows = (rows: any[], page: number, rowsPerPage: number) => {
  const startIndex = (page - 1) * rowsPerPage;
  return rows.slice(startIndex, startIndex + rowsPerPage);
};

export const RegisterFilterPanel = ({
  fields,
  filterState,
  hasAppliedFilters,
  onChange,
  onApply,
  onClear,
}: RegisterFilterPanelProps) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <Flex mb={4} justify="flex-end" gap={2}>
        <Button
          leftIcon={<FiFilter />}
          variant={isOpen ? "solid" : "outline"}
          colorScheme="teal"
          onClick={onToggle}
          borderRadius="full"
          size="sm"
        >
          {isOpen ? "Hide Filters" : "Show Filters"}
        </Button>
        {hasAppliedFilters && (
          <Button
            leftIcon={<FiX />}
            variant="ghost"
            colorScheme="red"
            onClick={onClear}
            borderRadius="full"
            size="sm"
          >
            Clear All
          </Button>
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Box
          p={5}
          mb={6}
          bg="white"
          rounded="xl"
          border="1px solid"
          borderColor="gray.100"
          shadow="sm"
        >
          <SimpleGrid columns={[1, 2, 3, 4]} spacing={4}>
            {fields.map((field) => (
              <Box key={field.name}>
                <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.500">
                  {field.label.toUpperCase()}
                </Text>
                {field.type === "select" ? (
                  <Select
                    size="sm"
                    name={field.name}
                    value={filterState[field.name] || ""}
                    onChange={onChange}
                    borderRadius="md"
                    placeholder={field.placeholder || `All ${field.label}`}
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    size="sm"
                    type="date"
                    name={field.name}
                    value={filterState[field.name] || ""}
                    onChange={onChange}
                    borderRadius="md"
                  />
                )}
              </Box>
            ))}
            <Flex align="flex-end">
              <Button
                leftIcon={<FiSearch />}
                colorScheme="teal"
                size="sm"
                w="full"
                onClick={onApply}
                borderRadius="md"
              >
                Apply Filters
              </Button>
            </Flex>
          </SimpleGrid>
        </Box>
      </Collapse>
    </>
  );
};
