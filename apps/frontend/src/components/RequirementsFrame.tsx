import { Box, Heading, Textarea, Fieldset, Field } from '@chakra-ui/react';

export const RequirementsFrame: React.FC = () => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} bg="white">
      <Heading as="h2" size="md" mb={4}>
        Course Requirements
      </Heading>

      <Fieldset.Root>
        <Field.Root>
          <Field.Label>If this is for a course, please describe:</Field.Label>
          <Textarea placeholder="Enter course requirements or context here" />
        </Field.Root>

        <Field.Root>
          <Field.Label>Instructor Contact Info</Field.Label>
          <Textarea placeholder="Enter instructor name, email, and phone here" />
        </Field.Root>
      </Fieldset.Root>
    </Box>
  );
};

export default RequirementsFrame;
