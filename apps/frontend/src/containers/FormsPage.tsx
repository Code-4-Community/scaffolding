import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  Text,
  chakra,
} from '@chakra-ui/react';
import { FaDownload, FaEye, FaTrashCan, FaUpload } from 'react-icons/fa6';
import NavBar from '@components/NavBar/NavBar';
import { UserType } from '@api/types';
import documentIcon from '../assets/icons/Vector.svg';

// Interface for a form
// contains both a name of the form the user needs to fill out and its template url
// TODO: Use as a prop for the FormsPage component
interface Form {
  name: string;
  templateUrl: string;
}

// TODO: Use as a prop for the FormsPage component
const FORMS: Form[] = [
  // Specify a url to the template for the form
  { name: 'Confidentiality Form', templateUrl: 'https://www.google.com' },
  { name: 'Application Form', templateUrl: '' },
];

// Interface for a form submission and its form URL
interface FormSubmission {
  formUrl: string;
}

// Custom component for the upload file label
// TODO: Figure out a better way to pass on styling to the label
const UploadFileLabel = chakra('label');

const FormsPage: React.FC = () => {
  // State for tracking the submissions by form
  const [submissionsByForm, setSubmissionsByForm] = useState<
    Record<Form['name'], FormSubmission | undefined>
  >({});

  // Handle file change for a form
  // TODO: replace with real uploading of files
  const handleFileChange =
    (formName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file) return;

      // TODO: Replace with the real URL returned from the backend
      const formUrl = 'https://placeholder.backend.url';

      // Update the submissions by form
      setSubmissionsByForm((prev) => ({
        ...prev,
        [formName]: { formUrl },
      }));
      e.target.value = '';
    };

  // Check if there are any incomplete forms
  const hasIncompleteForm = FORMS.some((f) => !submissionsByForm[f.name]);

  return (
    <div className="flex flex-row h-screen">
      <NavBar logo="BHCHP" userType={UserType.STANDARD} />
      <Box
        id="main-content"
        flex="1"
        display="flex"
        flexDirection="column"
        minW="0"
        w="100%"
        maxW="100%"
        minH="100vh"
        overflowY="auto"
        pt="20px"
        pr="30px"
        pb="20px"
        pl="30px"
        gap="25px"
      >
        <Heading fontSize="48px" fontWeight="600">
          Upload a file
        </Heading>
        {hasIncompleteForm ? (
          <Text
            fontFamily="Lato, sans-serif"
            fontSize="20px"
            fontWeight="500"
            color="#000000"
          >
            Please upload the required forms
          </Text>
        ) : null}
        {/* For each form, display the form name, submission status, and upload button */}
        {FORMS.map((form) => {
          // For each form, get the submission and check if it is complete
          const submission = submissionsByForm[form.name];
          // Check if the form is complete
          const isFormComplete = Boolean(submission);
          // Create a unique ID for the file input
          // TODO: Confirm with backend if this is the best way to do this
          const fileInputId = form.name.replace(/\s+/g, '-');

          return (
            <>
              <Flex
                key={form.name}
                direction="column"
                maxW="720px"
                width="100%"
                gap="25px"
              >
                {/* Display the form name and submission status */}
                <Text fontWeight="700" color="#000000">
                  {isFormComplete
                    ? `${form.name} Uploaded`
                    : `Upload Your ${form.name}`}
                  {!isFormComplete ? (
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  ) : null}
                </Text>
                {/* Display form details */}
                <Flex align="flex-start" gap="3" w="100%" maxW="720px">
                  <Flex
                    flex="0 0 calc(100% - 0.75rem - 40px)"
                    align="center"
                    gap="4"
                    px="5"
                    py="4"
                    h="76px"
                    overflow="hidden"
                    borderWidth="1px"
                    borderColor="#D9D9D9"
                    bg="white"
                    minW="0"
                  >
                    <Box
                      flexShrink={0}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      w="44px"
                      h="44px"
                      bg="rgba(0, 140, 167, 0.15)"
                    >
                      <Image
                        src={documentIcon}
                        alt=""
                        width="24px"
                        height="30px"
                        aria-hidden
                      />
                    </Box>
                    <Text
                      flex="1"
                      fontFamily="Lato, sans-serif"
                      fontSize="16px"
                      fontWeight="600"
                      color="#000000"
                      minW="0"
                      truncate
                      title={form.name}
                    >
                      {form.name}
                    </Text>
                    <Text
                      fontFamily="Lato, sans-serif"
                      fontSize="14px"
                      fontWeight="500"
                      color={isFormComplete ? '#16A34A' : '#A3A3A3'}
                      flexShrink={0}
                    >
                      {isFormComplete ? 'Completed' : 'Incomplete'}
                    </Text>
                  </Flex>
                  {isFormComplete ? (
                    <IconButton
                      type="button"
                      aria-label={`Delete ${form.name}`}
                      variant="ghost"
                      color="gray.500"
                      alignSelf="center"
                      flexShrink={0}
                      onClick={() => {}}
                    >
                      <FaTrashCan size="18px" aria-hidden />
                    </IconButton>
                  ) : null}
                </Flex>

                {/* Depending on if the form is uploaded, display the button to view template and upload OR preview the form */}
                {isFormComplete ? (
                  <Button
                    type="button"
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    w="fit-content"
                    minW="123px"
                    h="34px"
                    pt="5px"
                    pr="15px"
                    pb="5px"
                    pl="15px"
                    gap="15px"
                    borderRadius="30px"
                    fontFamily="Lato, sans-serif"
                    fontSize="14px"
                    fontWeight="600"
                    bg="#B8AF98"
                    color="#000000"
                    _hover={{ opacity: submission ? 0.92 : undefined }}
                    onClick={() => {
                      if (submission?.formUrl) {
                        window.open(
                          submission.formUrl,
                          '_blank',
                          'noopener,noreferrer',
                        );
                      }
                    }}
                  >
                    Preview
                    <FaEye size="16px" color="#000000" aria-hidden />
                  </Button>
                ) : (
                  <Flex gap="4" flexWrap="wrap">
                    <Button
                      type="button"
                      display="inline-flex"
                      alignItems="center"
                      justifyContent="center"
                      minW="123px"
                      w="auto"
                      h="34px"
                      whiteSpace="nowrap"
                      pt="5px"
                      pr="15px"
                      pb="5px"
                      pl="15px"
                      gap="15px"
                      borderRadius="30px"
                      fontFamily="Lato, sans-serif"
                      fontSize="14px"
                      fontWeight="600"
                      bg="#B8AF98"
                      color="#000000"
                      _hover={{
                        opacity: form.templateUrl ? 0.92 : undefined,
                      }}
                      cursor={form.templateUrl ? 'pointer' : 'not-allowed'}
                      opacity={form.templateUrl ? 1 : 0.65}
                      onClick={() => {
                        if (form.templateUrl) {
                          window.open(
                            form.templateUrl,
                            '_blank',
                            'noopener,noreferrer',
                          );
                        }
                      }}
                    >
                      Download Template
                      <FaDownload size="16px" color="#000000" aria-hidden />
                    </Button>
                    {/* Fake Button for uploading a file */}
                    <UploadFileLabel
                      htmlFor={fileInputId}
                      display="inline-flex"
                      alignItems="center"
                      justifyContent="center"
                      w="123px"
                      h="34px"
                      pt="5px"
                      pr="15px"
                      pb="5px"
                      pl="15px"
                      gap="15px"
                      borderRadius="30px"
                      fontFamily="Lato, sans-serif"
                      fontSize="14px"
                      fontWeight="600"
                      bg="#6AB242"
                      color="white"
                      _hover={{ opacity: 0.92 }}
                      cursor="pointer"
                    >
                      Upload
                      <FaUpload size="16px" color="#FFFFFF" aria-hidden />
                    </UploadFileLabel>
                  </Flex>
                )}
                {/* Real input for uploading a file */}
                <input
                  id={fileInputId}
                  type="file"
                  accept=".pdf,application/pdf"
                  hidden
                  onChange={handleFileChange(form.name)}
                />
              </Flex>
              {/* Divider between forms */}
              <div className="bg-[#d9d9d9] w-full h-[1px]" />
            </>
          );
        })}
      </Box>
    </div>
  );
};

export default FormsPage;
