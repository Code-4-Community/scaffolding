import { Box, Heading, Text } from '@chakra-ui/react';

const STUDENT_REQUIREMENTS_PLACEHOLDER = 'PLACEHOLDER INFO HERE';
const INSTRUCTOR_CONTACT_INFO_PLACEHOLDER = 'PLACEHOLDER INFO HERE';

export const RequirementsFrame: React.FC = () => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} bg="white">
      <Heading as="h2" size="md" mb={4}>
        Course Requirements
      </Heading>

      <Box mb={4}>
        <Text display="block" fontSize="sm" fontWeight="medium" mb={2}>
          If this is for a course, please describe:
        </Text>
        <Box
          borderColor="black"
          borderWidth="1px"
          borderRadius="md"
          height="100px"
          p={3}
          overflow="auto"
        >
          <Text fontSize="sm">{STUDENT_REQUIREMENTS_PLACEHOLDER}</Text>
        </Box>
      </Box>

      <Box>
        <Text display="block" fontSize="sm" fontWeight="medium" mb={2}>
          Instructor Contact Info
        </Text>
        <Box
          borderColor="black"
          borderWidth="1px"
          borderRadius="md"
          height="100px"
          p={3}
          overflow="auto"
        >
          <Text fontSize="sm">{INSTRUCTOR_CONTACT_INFO_PLACEHOLDER}</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default RequirementsFrame;
