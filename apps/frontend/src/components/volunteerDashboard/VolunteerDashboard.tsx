import FacebookIcon from '@material-ui/icons/Facebook';
import YouTubeIcon from '@material-ui/icons/YouTube';
import { Box } from '@mui/material';
import generateInstagramIcon from './InstagramIcon';

function VolunteerDashboard() {
  return (
    <div
      className="container"
      style={{ width: '90%', paddingBottom: '7%', paddingTop: '2%' }}
    >
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <div>
          <text
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: '500',
              fontSize: '40px',
            }}
          >
            Welcome,{' '}
          </text>
          <text
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: '700',
              fontSize: '40px',
            }}
          >
            Volunteer
          </text>
        </div>

        <Box display="flex" flexDirection="row" gap={3}>
          <YouTubeIcon fontSize="large" />
          <FacebookIcon fontSize="large" />
          {generateInstagramIcon()}
        </Box>
      </Box>
      <div
        className="description"
        style={{ lineHeight: '.7', paddingBottom: '3%', paddingTop: '3%' }}
      >
        <text
          style={{
            fontFamily: 'Lora',
            fontSize: '20px',
            lineHeight: '0',
          }}
        >
          Welcome to the City's Office of Green Infrastructure Volunteer Program
          dashboard!
          <br /> Find everything you need at the links below.
        </text>
      </div>
      <Box
        sx={{
          height: '40%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          gap: '2%',
          backgroundColor: '#EDEDED',
        }}
      >
        <div
          className="column1"
          style={{
            width: '120%',
            paddingLeft: '2%',
            paddingTop: '2%',
            paddingBottom: '2%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              gap: '4%',
              width: '100%',
            }}
          >
            <Box
              sx={{
                bgcolor: '#D7D7D7',
                height: '50%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '30px',
              }}
            >
              My Adopted Green Infrastructure
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                height: '50%',
                gap: '4%',
              }}
            >
              <Box
                sx={{
                  bgcolor: '#D7D7D7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '30px',
                  width: '100%',
                }}
              >
                Adoption Map
              </Box>
              <Box
                sx={{
                  bgcolor: '#D7D7D7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '30px',
                  width: '100%',
                  padding: '3%',
                }}
              >
                Maintenance Guide
              </Box>
            </Box>
          </Box>
        </div>
        <div
          className="column2"
          style={{ paddingTop: '2%', paddingBottom: '2%', width: '55%' }}
        >
          <Box
            sx={{
              bgcolor: '#D7D7D7',
              height: '100%',
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '30px',
              padding: '8%',
            }}
          >
            Maintenance Visit Checklist
          </Box>
        </div>
        <div
          className="column3"
          style={{
            display: 'flex',
            width: '30%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            height: '70vh',
            paddingRight: '2%',
            paddingTop: '2%',
            paddingBottom: '2%',
            gap: '4%',
          }}
        >
          <Box
            sx={{
              bgcolor: '#D7D7D7',
              height: '30%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '30px',
            }}
          >
            Vid 1
          </Box>
          <Box
            sx={{
              bgcolor: '#D7D7D7',
              height: '30%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '30px',
            }}
          >
            Vid 2
          </Box>
          <Box
            sx={{
              bgcolor: '#D7D7D7',
              height: '40%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '30px',
            }}
          >
            Other
          </Box>
        </div>
      </Box>
    </div>
  );
}
export default VolunteerDashboard;
