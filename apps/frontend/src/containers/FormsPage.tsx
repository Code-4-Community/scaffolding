import { useRef, useState } from 'react';
import { Box, Button, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { FaDownload, FaUpload } from 'react-icons/fa6';
import NavBar from '@components/NavBar/NavBar';
import { UserType } from '@api/types';
import documentIcon from '../assets/icons/Vector.svg';

const CONFIDENTIALITY_TEMPLATE_URL: string | undefined = undefined;

const FormsPage: React.FC = () => {
  const [isComplete, setIsComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsComplete(true);
    }
  };

  return (
    <div className="flex flex-row h-screen">
      <NavBar logo="BHCHP" userType={UserType.STANDARD} />
      <Box
        id="main-content"
        flex="1"
        display="flex"
        flexDirection="column"
        minW="0"
        minH="0"
        w="1272px"
        maxW="100%"
        h="982px"
        maxH="100vh"
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
        {isComplete !== true ? (
          <Text
            fontFamily="Lato, sans-serif"
            fontSize="20px"
            fontWeight="500"
            color="#000000"
          >
            Please upload the required forms
          </Text>
        ) : null}

        <Box maxW="720px" width="100%">
          <Text fontWeight="700" color="#000000" mb="3">
            {isComplete
              ? 'Confidentiality Form Uploaded'
              : 'Upload Your Confidentiality Form'}
            <Text as="span" color="red.500">
              *
            </Text>
          </Text>

          <Flex
            align="center"
            gap="4"
            px="5"
            py="4"
            borderWidth="1px"
            borderColor="#D9D9D9"
            bg="white"
            mb="4"
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
            >
              Confidentiality Form
            </Text>
            <Text
              fontFamily="Lato, sans-serif"
              fontSize="14px"
              fontWeight="500"
              color="#A3A3A3"
            >
              {isComplete ? 'Complete' : 'Incomplete'}
            </Text>
          </Flex>

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
                opacity: CONFIDENTIALITY_TEMPLATE_URL ? 0.92 : undefined,
              }}
              cursor={CONFIDENTIALITY_TEMPLATE_URL ? 'pointer' : 'not-allowed'}
              opacity={CONFIDENTIALITY_TEMPLATE_URL ? 1 : 0.65}
              onClick={() => {
                if (CONFIDENTIALITY_TEMPLATE_URL) {
                  window.open(
                    CONFIDENTIALITY_TEMPLATE_URL,
                    '_blank',
                    'noopener,noreferrer',
                  );
                }
              }}
            >
              Download Template
              <FaDownload size="16px" color="#000000" aria-hidden />
            </Button>
            <Button
              type="button"
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
              onClick={() => fileInputRef.current?.click()}
            >
              Upload
              <FaUpload size="16px" color="#FFFFFF" aria-hidden />
            </Button>
          </Flex>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            hidden
            onChange={onFileChange}
          />
        </Box>
        <div className="bg-black w-full h-[1px]"></div>
      </Box>
    </div>
  );
};

export default FormsPage;
