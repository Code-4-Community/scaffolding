import React from 'react';
import { CSSProperties } from 'react';
import generateFeatureAddress from '../../assets/images/adoptedGIIcons/FeatureAddress';
import generateFeatureType from '../../assets/images/adoptedGIIcons/FeatureType';
import generateFeatureYearBuilt from '../../assets/images/adoptedGIIcons/FeatureYearBuilt';
import generateMaintenanceDate from '../../assets/images/adoptedGIIcons/MaintenanceDate';
const textStyles: CSSProperties = {
  fontFamily: 'Lora',
  fontSize: '14px',
  paddingLeft: '10%',
};

const boxStyle: CSSProperties = {
  backgroundColor: '#EDEDED',
  width: '100%',
  height: '350px',
  marginTop: '3%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingTop: '5%',
  paddingBottom: '5%',
  marginBottom: '5%',
};

const imageStyle: CSSProperties = {
  backgroundColor: '#EDEDED',
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const featureStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '80%',
  justifyContent: 'space-evenly',
  gap: '4%',
};

interface AdoptedGIBlockProps {
  img: string;
  featureName: string;
  featureType: string;
  featureAddress: string;
  lastMaintenanceDate: string;
}

const AdoptedGIBlock: React.FC<AdoptedGIBlockProps> = ({
  img,
  featureName,
  featureType,
  featureAddress,
  lastMaintenanceDate,
}) => {
  return (
    <div style={boxStyle}>
      <div style={imageStyle}>
        <img style={{ width: '55%', height: '80%' }} src={img} alt="Image" />
      </div>
      <div style={featureStyle}>
        <div>
          {generateMaintenanceDate()}
          <text style={textStyles}>{featureName}</text>
        </div>
        <div>
          {generateFeatureType()}
          <text style={textStyles}>{featureType}</text>
        </div>
        <div>
          {generateFeatureAddress()}
          <text style={textStyles}>{featureAddress}</text>
        </div>
        <div>
          {generateFeatureYearBuilt()}
          <text style={textStyles}>{lastMaintenanceDate}</text>
        </div>
      </div>
    </div>
  );
};

export default AdoptedGIBlock;
