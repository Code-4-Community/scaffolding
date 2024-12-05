import { Box } from '@mui/material';
import BostonSummer from '../../assets/images/loginPageMedia/bostonsummer.jpeg';
import cityOfBostonLogoWhite from '../../images/logos/cityOfBostonLogoWhite.png';

const BostonSummerBostonLogo = () => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${BostonSummer})`,
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

export default BostonSummerBostonLogo;