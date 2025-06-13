import React from 'react';
import { Box, Text, Flex, Tag } from '@chakra-ui/react';

interface TagListProps {
  title: string;
  data: string[];
  emptyText?: string;
  colorScheme?: string;
}

const ShowTagData: React.FC<TagListProps> = ({
  title,
  data,
  emptyText = "NA",
  colorScheme = "telegram",
}) => {
  return (
    <Box>
      <Text p={1} fontSize={"sm"} color={"gray"}>
        {title}
      </Text>
      <Flex flexWrap={"wrap"} gap={2}>
        {data.length > 0 ? (
          data.map((item: string) => (
            <Tag
              textTransform={"capitalize"}
              rounded={"full"}
              key={item}
              colorScheme={colorScheme}
            >
              {item}
            </Tag>
          ))
        ) : (
          <Tag rounded={"full"} colorScheme={colorScheme}>
            {emptyText}
          </Tag>
        )}
      </Flex>
    </Box>
  );
};

export default ShowTagData;
