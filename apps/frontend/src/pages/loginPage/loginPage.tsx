import { Button, Box, Image, Input, Text, Stack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import BostonImage from "../../assets/images/loginPageMedia/boston-pru.png"
import AppleLogo from "../../assets/images/loginPageMedia/applelogo.png"
import c4cLogo from '../../images/logos/c4cLogo.png';
import cityOfBostonLogo from '../../images/logos/cityOfBostonLogo.png';



// Using className specifications to track hiearchy !
export default function LoginPage() {
    return (
        <Box
            display="flex"
            width="100vw"
            height="100vh"
            overflow="hidden"
        >
            <Box
                className='user-side'
                bg="#FFFFFF"
                width="50%"
                display='flex'
                flexDirection="column"
                alignItems='center'
                justifyContent='flex-start'
                marginTop="12rem"
            >
                <Box 
                className='logos'
                 display="flex"
                 alignItems='center'
                  >
                    <img
                    src={cityOfBostonLogo}
                    style={{ marginTop: '12px', paddingRight: '15px' }}
                    />
                    <div
                    style={{
                        borderLeft: '1px solid rgba(0, 0, 0, 1)',
                        height: '55px',
                        paddingRight: '15px',
                    }}
                    />
                    <img src={c4cLogo} />
                </Box>
                <Box
                className="loginCTA"
                width='321px'
                height='29px'
                marginTop='4rem'
                >
                    <Text
                    fontStyle="Montserrat"
                    fontSize="24px"
                    lineHeight="29.26px"
                    fontWeight="600"
                    >Welcome Back Volunteer!</Text>
                    <Text
                    fontStyle="Montserrat"
                    fontSize="14px"
                    lineHeight="17.07px"
                    fontWeight="300"
                    >Continue adopting today!</Text>
                        <Box 
                        className='primaryLoginOption'
                        width='305px'
                        >
                            <Stack spacing='1rem'> {/* Adjust the spacing value as needed */}
                            <Box>
                                <Text mb={2} fontSize="sm" fontWeight="normal">Email Address</Text> {/* Adjust mb value as needed */}
                                <Input
                                width="305px"
                                height="33px"
                                bg="#D9D9D9"
                                borderRadius="10px"
                                borderColor="#D9D9D9"
                                _hover={{ borderColor: 'gray.300' }}
                                _focus={{ borderColor: 'gray.500', boxShadow: '0 0 0 1px gray.500' }}
                                />
                            </Box>
                            <Box>
                                <Text mb={2} fontSize="sm" fontWeight="normal">Password</Text> {/* Adjust mb value as needed */}
                                <Input
                                width="305px"
                                height="33px"
                                bg="#D9D9D9"
                                type="password"
                                borderRadius="10px"
                                borderColor="#D9D9D9"
                                _hover={{ borderColor: 'gray.300' }}
                                _focus={{ borderColor: 'gray.500', boxShadow: '0 0 0 1px gray.500' }}
                                />
                            </Box>
                            <Button
                                as={Link}
                                to="/volunteer"
                                bg="#D9D9D9"
                                borderRadius="10px"
                                borderColor="#D9D9D9"
                                fontWeight="300"
                                fontSize="14px"
                                fontStyle="Montserrat"
                                lineHeight="17.07px"
                                marginTop="2rem"
                                display="block"
                                width="100%"
                                textAlign="center"
                                _hover={{ textDecoration: 'none' }} // Removes underline on hover
                                textDecoration="none" // Removes underline
                                color="current" // Ensures the button text uses the current font color
                                >
                                Sign in
                                </Button>
                            </Stack>
                        </Box>
                        <Box className="orOptions" display="flex" alignItems="center"margin="1rem">
                            <Box flex={1} height="1px" bg="black" mr={4} />
                            <Text mt={6} mx={4}>or</Text> {/* mx is shorthand for margin on the x-axis (left and right) */}
                            <Box flex={1} height="1px" bg="black" ml={4} mr={12}/>
                            </Box>
                            { /* */}

                </Box>
                <Box 
                className="big-tech-login"
                display="flex"
                flexDirection="column"
                marginTop="20rem"
                >
                <Button
                                bg="#D9D9D9"
                                borderRadius="10px"
                                borderColor="#D9D9D9"
                                fontWeight='300'
                                fontSize='14px'
                                fontStyle='Montserrat'
                                lineHeight='17.07px'
                                marginTop="2rem"
                                width="300px"
                            >
                                Continue with Apple
                            </Button>
                            <Button
                                bg="#D9D9D9"
                                borderRadius="10px"
                                borderColor="#D9D9D9"
                                fontWeight='300'
                                fontSize='14px'
                                fontStyle='Montserrat'
                                lineHeight='17.07px'
                                marginTop="2rem"
                            >
                                Continue with Facebook
                            </Button>
                            <Button
                                bg="#D9D9D9"
                                borderRadius="10px"
                                borderColor="#D9D9D9"
                                fontWeight='300'
                                fontSize='14px'
                                fontStyle='Montserrat'
                                lineHeight='17.07px'
                                marginTop="2rem"
                            >
                                Continue with Google
                            </Button>
                </Box>
            </Box>
            <Box
                className='media-side'
                width="50%"
            >
                <Image
                    src={BostonImage}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                />
            </Box>
        </Box>
    );
}
