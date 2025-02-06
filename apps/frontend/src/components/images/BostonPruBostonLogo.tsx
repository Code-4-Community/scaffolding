import { Box } from '@mui/material';
import BostonPru from '../../assets/images/loginPageMedia/boston-pru.png';
import cityOfBostonLogoWhite from '../../images/logos/cityOfBostonLogoWhite.png';

const BostonPruBostonLogo = () => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${BostonPru})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%',
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        component="img"
        src={cityOfBostonLogoWhite}
        alt="City of Boston Logo"
        sx={{
          width: '400px',
        }}
      />
    </Box>
  );
};

export default BostonPruBostonLogo;
