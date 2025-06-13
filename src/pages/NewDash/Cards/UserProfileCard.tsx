import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  IconButton,
//   useColorMode,
  useColorModeValue,
  Slide,
  SlideFade,
//   SlideProps,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

interface Product {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  onClick: () => void;
}

interface ProductShowcaseCarouselProps {
  products: Product[];
}

const ProductShowcaseCarousel: React.FC<ProductShowcaseCarouselProps> = ({ products }) => {
  const bg = useColorModeValue('white', 'gray.700');
  const color = useColorModeValue('gray.800', 'white');
  const [currentIdx, setCurrentIdx] = React.useState(0);

  const nextProduct = () => {
    setCurrentIdx((prevIdx) => (prevIdx === products.length - 1 ? 0 : prevIdx + 1));
  };

  const prevProduct = () => {
    setCurrentIdx((prevIdx) => (prevIdx === 0 ? products.length - 1 : prevIdx - 1));
  };

  return (
    <Box bg={bg} p={4} borderRadius="md" shadow="md" position="relative">
      <Heading as="h2" size="lg" mb={4} color={color}>
        Product Showcase
      </Heading>
      <Flex align="center" justify="space-between" mb={4}>
        <IconButton
          aria-label="Previous product"
          icon={<ChevronLeftIcon />}
          onClick={prevProduct}
          size="sm"
          variant="ghost"
          colorScheme="blue"
        />
        <Box flex="1" textAlign="center">
          <SlideFade in offsetY="20px">
            <Box>
              <Slide direction="right" in={true}>
                <Box>
                  <Heading as="h3" size="md" color={color}>
                    {products[currentIdx].title}
                  </Heading>
                  <Text fontSize="sm" color="gray.500" mb={2}>
                    {products[currentIdx].description}
                  </Text>
                  <Button colorScheme="blue" onClick={products[currentIdx].onClick}>
                    View Product
                  </Button>
                </Box>
              </Slide>
            </Box>
          </SlideFade>
        </Box>
        <IconButton
          aria-label="Next product"
          icon={<ChevronRightIcon />}
          onClick={nextProduct}
          size="sm"
          variant="ghost"
          colorScheme="blue"
        />
      </Flex>
      <Box>
        <img
          src={products[currentIdx].imageUrl}
          alt={products[currentIdx].title}
          style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover' }}
        />
      </Box>
    </Box>
  );
};

export default ProductShowcaseCarousel;
