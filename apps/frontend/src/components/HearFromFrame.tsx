import { Box, Button, Flex, Heading, SimpleGrid } from '@chakra-ui/react';

const HEARD_ABOUT_OPTIONS = [
  'Online Search',
  'BHCHP Website',
  // 'School',
  // 'Staff Member',
  // 'Other',
] as const;

// TODO: Add options from shared source, currently hardcoded
export const HearFromFrame: React.FC<{ sources?: string[] }> = ({
  sources = [...HEARD_ABOUT_OPTIONS],
}) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} bg="white">
      <Flex gap={4} alignItems="center" flexWrap="wrap">
        <Heading as="h2" size="md" flexShrink={0}>
          How did you hear about us?
        </Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={2}>
          {sources.map((source) => (
            <Button
              borderRadius="full"
              px={4}
              py={3}
              minW="auto"
              w="fit-content"
              bg="#008CA7"
              color="white"
              fontFamily="Poppins, sans-serif"
              border="1px solid #013594"
              key={source}
            >
              {source}
            </Button>
          ))}
        </SimpleGrid>
      </Flex>
    </Box>
  );
};

export default HearFromFrame;
