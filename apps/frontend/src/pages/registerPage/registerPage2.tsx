import { Grid, Box } from '@mui/material';
import { useState } from 'react';
import SuccessPage from './successPage';
import BostonPruBostonLogo from '../../components/images/BostonPruBostonLogo';
import FormPage2 from './formPage2';

export default function RegisterPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <Box sx={{ flexGrow: 1, height: '100vh' }}>
      <Grid container sx={{ height: '100%' }}>
        {/* Left side: Image */}
        <Grid item xs={0} md={6}>
          <BostonPruBostonLogo />
        </Grid>
        {/* Right side: Text and Content */}
        <Grid
          item
          xs={12}
          md={6}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Box textAlign="left" p={4}>
            {!isSubmitted ? (
              <FormPage2 setIsSubmitted={setIsSubmitted} />
            ) : (
              <SuccessPage />
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
