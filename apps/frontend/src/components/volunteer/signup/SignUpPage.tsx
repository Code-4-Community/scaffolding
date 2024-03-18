import { Box, Text } from '@chakra-ui/react';

export default function SignUpPage() {
    return (
        <Box bg='tomato' w='1104px' h='1025px' top='192px' left='89px' border='1px'>
            <Box className='header-and-line' display='flex' justifyContent='center'>
                <Text fontStyle='Montserrat' fontSize='30px'>Welcome, Volunteer!</Text>
                <button> This will be a line </button>
            </Box>
        </Box>
    )
}