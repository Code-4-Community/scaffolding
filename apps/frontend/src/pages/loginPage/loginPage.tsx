import { Box, Image } from "@chakra-ui/react";
import BostonImage from "../../assets/images/loginPageMedia/boston-pru.png"
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
            </Box>
            <Box
                className='media-side'
                bg="blue"
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
