import { Box } from '@mui/material';
import BostonSpring from '../../assets/images/loginPageMedia/bostonspring.jpeg';
import cityOfBostonLogoWhite from '../../images/logos/cityOfBostonLogoWhite.png';

const BostonSpringBostonLogo = () => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${BostonSpring})`,
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

export default BostonSpringBostonLogo;
