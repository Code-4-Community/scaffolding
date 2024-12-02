import { Grid, Box } from '@mui/material';
import { useState } from 'react';
import SuccessPage from './successPage';
import FormPage from './formPage';
import BostonWinterBostonLogo from '../../components/images/BostonWinterBostonLogo';

export default function RegisterPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <Box sx={{ flexGrow: 1, height: '100vh' }}>
      <Grid container sx={{ height: '100%' }}>
        {/* Left side: Image */}
        <Grid item xs={0} md={7}>
          <BostonWinterBostonLogo />
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
