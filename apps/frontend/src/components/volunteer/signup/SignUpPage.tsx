import { Box, Input, Text, Stack, HStack, VStack } from '@chakra-ui/react';
import { Checkbox } from '@mui/material';
import { grey } from '@mui/material/colors';

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
    height: string,
    width: string,
}

const checkboxesMap : CheckboxField[] = [
    {
        label: 'I have reviewed the General Safety Guidelines'
    },
    {
        label: 'I have read and agree to the Terms of Use and Privacy Policy'
    },
    {
        label: 'I have read and agree to the Release of Liability'
    }
]

const inputFieldsMap: InputFieldGroup[] = [
    {
        fields: [
            { label: 'First Name' },
            { label: 'Last Name' }
        ],
        type: 'double',
        height: "40px",
        width: "373px",
    },
    {
        fields: [{ label: 'Email Address' }],
        type: 'single',
        height: "40px",
        width: "810px",
    },
    {
        fields: [{ label: 'Phone Number' }],
        type: 'single',
        height: "40px",
        width: "810px",
    },
    {
        fields: [{ label: 'Zip Code' }],
        type: 'single',
        height: "40px",
        width: "369px",
    },
    {
        fields: [{ label: 'Age' }],
        type: 'single',
        height: "40px",
        width: "107px",
    },
    {
        fields: [{ label: 'Which days are you available to volunteer', placeholder: 'Select days' }],
        type: 'single',
        height: "40px",
        width: "454px",
    },
]

function InputFields() {
    return (
        <VStack spacing={4}>
            {inputFieldsMap.map((group, i) => (
                <VStack key={i} width="100%" spacing={1} align="flex-start">
                    {group.type === 'double' ? (
                        <HStack width="100%" justifyContent="space-between">
                            {group.fields.map((field, j) => (
                                <VStack key={j} width={group.width}>
                                    <Text className='label' alignSelf="flex-start" fontSize="18px" fontWeight={600}>{field.label}</Text>
                                    <Input variant='filled' height={group.height} placeholder={field.placeholder || 'example'} width="100%"/>
                                </VStack>
                            ))}
                        </HStack>
                    ) : (
                        <VStack width={group.width} align="flex-start">
                            <Text className='label' fontSize="18px" fontWeight={600} alignSelf="flex-start">{group.fields[0].label}</Text>
                            <Input variant='filled' height={group.height} placeholder={group.fields[0].placeholder || 'example'} width="100%"/>
                        </VStack>
                    )}
                </VStack>
            ))}
        </VStack>
    )
}

function CheckboxFields() {
    return (
        <VStack>
            {checkboxesMap.map((field, i) => (
                <HStack key={i} width="100%" height="100%">
                    <Text textDecoration="underline">{field.label}</Text>
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

export default function SignUpPage() {
    return (
        <Box className='outermost-box' display="flex" alignItems="center" justifyContent="center" bg='#D9D9D9' w='1104px' h='1025px'>
            <Box className='inner-box' bg="#FFFDFD" height="943.08px" width="971px" top="-455.11px" left="1454px" display='flex' flexDirection='column' alignItems='center' justifyContent='space-evenly'>
                <Box className='header-box' height="41.94px" width="809.05px" borderBottom="1px solid #000000" display="flex" justifyContent="center" alignItems="center">
                    <Text fontFamily='Montserrat' fontSize='30px'>Welcome, Volunteer!</Text>
                </Box>
                <Box className='input-fields-main' width="809.05px" mt="20px">
                    <InputFields/>
                </Box>
                <Box className='check-boxes-main' 
                width="809.05px" height="265px" top="155px" left="1536px"
                 borderTop="1px solid #000000" borderBottom="1px solid #000000"
                 display="flex" alignItems='space-evenly'>
                    <CheckboxFields/>
                </Box>
            </Box>
        </Box>
    )
}
