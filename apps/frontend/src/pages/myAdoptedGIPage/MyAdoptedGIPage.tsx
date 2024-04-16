import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Navbar from '../Navbar';
import { CSSProperties } from 'react';
import AdoptedGIBlock from './AdoptedGIBlock';
import BioswaleImage from './BioswaleImage.png';

const containerStyles: CSSProperties = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: '6%',
  paddingTop: '4%',
};

const titleStyles: CSSProperties = {
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '30px',
  fontWeight: '600',
};

const rowStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  width: '92%',
  justifyContent: 'space-between',
  marginTop: '2%',
};

const bioswaleTitleStyles: CSSProperties = {
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '25px',
  fontWeight: '600',
};

const blueLineStyle: CSSProperties = {
  width: '100%',
  height: '3px',
  backgroundColor: '#288BE4',
  marginTop: '1.5%',
};

const dummyData = [
  {
    img: BioswaleImage,
    featureType: 'Feature Type',
    featureAddress: 'Feature Address',
    featureYearBuilt: 'Year Built',
    lastMaintenanceDate: 'Last Maintenance Date',
  },
  {
    img: BioswaleImage,
    featureType: 'Feature Type',
    featureAddress: 'Feature Address',
    featureYearBuilt: 'Year Built',
    lastMaintenanceDate: 'Last Maintenance Date',
  },
];

function RenderFormControls() {
  return (
    <div style={rowStyles}>
      <FormControl variant="filled" sx={{ width: '20%' }} size="small">
        <InputLabel
          id="filter-one-select"
          sx={{ fontFamily: 'Montserrat, sans-serif', color: 'black' }}
        >
          Filter 1
        </InputLabel>
        <Select
          labelId="filter-one-select"
          label="Filter 1"
          sx={{ borderRadius: '7px' }}
          disableUnderline
        >
          <MenuItem>Test</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="filled" sx={{ width: '20%' }} size="small">
        <InputLabel
          id="filter-two-select"
          sx={{ fontFamily: 'Montserrat, sans-serif', color: 'black' }}
        >
          Filter 2
        </InputLabel>
        <Select
          labelId="filter-two-select"
          label="Filter 2"
          sx={{ borderRadius: '7px' }}
          disableUnderline
        >
          <MenuItem>Test</MenuItem>
        </Select>
      </FormControl>
      <TextField
        id="filled-search"
        label="Search for a site"
        type="search"
        sx={{ width: '50%' }}
        variant="filled"
        size="small"
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        InputLabelProps={{
          style: { fontFamily: 'Montserrat, sans-serif', color: 'black' },
        }}
      />
    </div>
  );
}

export default function MyAdoptedGIPage() {
  return (
    <div>
      <Navbar />
      <div style={containerStyles}>
        <div style={titleStyles}>My Adopted Green Infrastructure</div>
        <RenderFormControls />
      </div>
      <div
        style={{
          width: '65%',
          position: 'absolute',
          right: '7.5%',
          marginTop: '3%',
        }}
      >
        <div style={bioswaleTitleStyles}>Bioswale 1</div>
        <div className="blueLine" style={blueLineStyle} />
        {dummyData.map((props, index) => (
          <AdoptedGIBlock
            key={index}
            img={props.img}
            featureType={props.featureType}
            featureAddress={props.featureAddress}
            featureYearBuilt={props.featureYearBuilt}
            lastMaintenanceDate={props.lastMaintenanceDate}
          />
        ))}
      </div>
    </div>
  );
}
