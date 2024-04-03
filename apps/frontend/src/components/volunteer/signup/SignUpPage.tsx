import {
  Box,
  Input,
  Text,
  HStack,
  VStack,
  Button,
  IconButton,
} from '@chakra-ui/react';
import { Checkbox } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface InputField {
  label: string;
  placeholder?: string;
}

interface CheckboxField {
  label: string;
}

interface InputFieldGroup {
  fields: InputField[];
  type?: 'single' | 'double'; // 'single' for single column, 'double' for double column row
  height: string;
  width: string;
}

const checkboxesMap: CheckboxField[] = [
  {
    label: 'I have reviewed the General Safety Guidelines',
  },
  {
    label: 'I have read and agree to the Terms of Use and Privacy Policy',
  },
  {
    label: 'I have read and agree to the Release of Liability',
  },
];

const inputFieldsMap: InputFieldGroup[] = [
  {
    fields: [{ label: 'First Name' }, { label: 'Last Name' }],
    type: 'double',
    height: '40px',
    width: '373px',
  },
  {
    fields: [{ label: 'Email Address' }],
    type: 'single',
    height: '40px',
    width: '810px',
  },
  {
    fields: [{ label: 'Phone Number' }],
    type: 'single',
    height: '40px',
    width: '810px',
  },
  {
    fields: [{ label: 'Zip Code' }],
    type: 'single',
    height: '40px',
    width: '369px',
  },
  {
    fields: [{ label: 'Age' }],
    type: 'single',
    height: '40px',
    width: '107px',
  },
];

function InputFields() {
  return (
    <VStack spacing={0} marginBottom={'20px'}>
      {inputFieldsMap.map((group, i) => (
        <VStack key={i} width="100%" spacing={0} align="flex-start">
          {group.type === 'double' ? (
            <HStack width="100%" justifyContent="space-between">
              {group.fields.map((field, j) => (
                <VStack key={j} width={group.width}>
                  <Text
                    className="label"
                    alignSelf="flex-start"
                    fontSize="18px"
                    fontWeight={600}
                    marginBottom={0}
                  >
                    {field.label}
                  </Text>
                  <Input
                    variant="filled"
                    height={group.height}
                    placeholder={field.placeholder || 'example'}
                    width="100%"
                  />
                </VStack>
              ))}
            </HStack>
          ) : (
            <VStack width={group.width} align="flex-start">
              <Text
                className="label"
                fontSize="18px"
                fontWeight={600}
                alignSelf="flex-start"
                marginBottom={0}
                marginTop="30px"
              >
                {group.fields[0].label}
              </Text>
              <Input
                variant="filled"
                height={group.height}
                placeholder={group.fields[0].placeholder || 'example'}
                width="100%"
              />
            </VStack>
          )}
        </VStack>
      ))}
    </VStack>
  );
}

function CheckboxFields() {
  return (
    <VStack marginTop={'20px'}>
      {checkboxesMap.map((field, i) => (
        <HStack key={i} width="100%" height="100%" marginTop={'20px'}>
          <Text textDecoration="underline" fontSize="18px" fontWeight={600}>
            {field.label}
          </Text>
          <Checkbox
            sx={{
              color: '#808080', // Grey color for the checkbox when not checked
              '&.Mui-checked': {
                color: '#808080', // Grey color for the checkbox when checked
              },
              '& .MuiSvgIcon-root': {
                fontSize: 30,
              },
            }}
          />
        </HStack>
      ))}
    </VStack>
  );
}

interface Props {
  setShowSignUp: (value: boolean) => void;
}

export default function SignUpPage({ setShowSignUp }: Props) {
  const closeSignUp = () => {
    setShowSignUp(false);
  };

  return (
    <Box
      className="outermost-box"
      position="absolute"
      top="10%"
      left="10%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="#D9D9D9"
      width="80%"
      height="220%"
      zIndex={'200'}
    >
      <IconButton
        aria-label="close"
        size="small"
        position="absolute"
        top="10px"
        right="10px"
        onClick={closeSignUp}
      >
        <CloseIcon />
      </IconButton>
      <Box
        className="inner-box"
        bg="#FFFDFD"
        height="90%"
        width="90%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-evenly"
        paddingTop={'30px'}
      >
        <Box
          className="header-box"
          height="5%"
          width="90%"
          borderBottom="2px solid #000000"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Text
            fontFamily="Montserrat"
            fontSize="30px"
            fontWeight={600}
            paddingTop={'50px'}
            paddingBottom={'30px'}
          >
            Welcome, Volunteer!
          </Text>
        </Box>
        <Box className="input-fields-main" width="90%" mt="20px">
          <InputFields />
        </Box>
        <Box
          className="check-boxes-main"
          width="90%"
          height="40%"
          borderTop="2px solid #000000"
          borderBottom="2px solid #000000"
          marginBottom={'90px'}
        >
          <CheckboxFields />
        </Box>
        <Button size="large" marginBottom="7%" fontSize="20px">
          Submit
        </Button>
      </Box>
    </Box>
  );
}
