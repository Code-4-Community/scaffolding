import { Image } from '@chakra-ui/react';
import {
  Button,
  Box,
} from '@mui/material';
import GreenCheck from '../../components/volunteer/signup/greencheck.png';

const SuccessPage = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      textAlign="center"
    >
      <Box width="80%">
        <Image src={GreenCheck} alt="Green Check" />
        <h1
          style={{
            fontFamily: 'Montserrat',
            fontSize: '40px',
            fontWeight: '700',
            lineHeight: '48x',
          }}
        >
          Welcome to Green Infrastructure Boston!
        </h1>
        <p
          style={{
            fontFamily: 'Lora',
            fontSize: '20px',
            fontWeight: '400',
            lineHeight: '25x',
            color: '#58585B',
          }}
        >
          You've successfully registered as a volunteer
        </p>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#0072C4',
            color: 'white',
            width: '100%',
            padding: '10px 0',
            fontFamily: 'Montserrat',
            fontSize: '20px',
            fontWeight: '600',
            lineHeight: '24x',
            textTransform: 'none',
            marginTop: '20px',
          }}
          onClick={() => {
            window.location.href = '/volunteer';
          }}
        >
          Volunteer Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default SuccessPage;
