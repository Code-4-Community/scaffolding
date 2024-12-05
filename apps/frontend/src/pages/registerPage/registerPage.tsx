import { Grid, Box } from '@mui/material';
import { useState } from 'react';
import SuccessPage from './successPage';
import FormPage from './formPage';
import BostonWinterBostonLogo from '../../components/images/BostonWinterBostonLogo';
import BostonFallBostonLogo from '../../components/images/BostonFallBostonLogo';
import BostonSpringBostonLogo from '../../components/images/BostonSpringBostonLogo';
import BostonSummerBostonLogo from '../../components/images/BostonSummerBostonLogo';

export default function RegisterPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const getSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) {
      return 'spring';  // March, April, May
    } else if (month >= 5 && month <= 7) {
      return 'summer';  // June, July, August
    } else if (month >= 8 && month <= 10) {
      return 'fall';    // September, October, November
    } else {
      return 'winter';  // December, January, February
    }
  };

  const season = getSeason();

  return (
    <Box sx={{ flexGrow: 1, height: '100vh' }}>
      <Grid container sx={{ height: '100%' }}>
        {/* Left side: Image */}
        <Grid item xs={0} md={7}>
          {/* Render the image based on the season */}
          {season === 'winter' && <BostonWinterBostonLogo />}
          {season === 'fall' && <BostonFallBostonLogo />}
          {season === 'spring' && <BostonSpringBostonLogo />}
          {season === 'summer' && <BostonSummerBostonLogo />}
        </Grid>
        {/* Right side: Text and Content */}
        <Grid
          item
          xs={12}
          md={5}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Box textAlign="left" p={4}>
            {!isSubmitted ? (
              <FormPage setIsSubmitted={setIsSubmitted} />
            ) : (
              <SuccessPage />
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
