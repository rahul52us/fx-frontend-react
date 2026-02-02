import { Badge, Card, CardBody, HStack, Text, VStack } from "@chakra-ui/react";
import { FieldConfig, hasChanged } from "../interface";
import { ChevronRightIcon } from "@chakra-ui/icons";

interface FieldComparisonProps<T> {
  field: FieldConfig<T>;
  original: T;
  updated: Partial<T>;
  showOnlyChanges: boolean;
}

export function FieldComparison<T>({
  field,
  original,
  updated,
  showOnlyChanges,
}: FieldComparisonProps<T>) {
  const originalValue = original[field.key];
  const updatedValue = updated[field.key];
  const changed = hasChanged(originalValue, updatedValue);

  if (showOnlyChanges && !changed) return null;

  const renderValue = (value: any) => {
    if (field.render) return field.render(value);
    if (value === null || value === undefined || value === "")
      return "Empty";
    return String(value);
  };

  return (
    <VStack align="stretch" spacing={2}>
      <HStack justify="space-between">
        <Text fontWeight="medium">{field.label}</Text>
        {changed && <Badge colorScheme="yellow">CHANGED</Badge>}
      </HStack>

      <HStack>
        <Card flex={1} bg={changed ? "red.50" : "gray.50"}>
          <CardBody>
            <Text fontSize="xs" color="gray.500">Original</Text>
            {renderValue(originalValue)}
          </CardBody>
        </Card>

        <ChevronRightIcon />

        <Card flex={1} bg={changed ? "green.50" : "gray.50"}>
          <CardBody>
            <Text fontSize="xs" color="gray.500">Updated</Text>
            {renderValue(updatedValue)}
          </CardBody>
        </Card>
      </HStack>
    </VStack>
  );
}
