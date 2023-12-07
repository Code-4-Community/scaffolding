import Navbar from '../Navbar';
import React from 'react';

const tableStyle: React.CSSProperties = {
  backgroundColor: '#D9D9D9',
  border: '0.5px solid black',
  width: '100%',
  margin: '0 auto',
  borderCollapse: 'collapse',
  flexShrink: '0',
};

const cellStyle: React.CSSProperties = {
  fontFamily: 'Lora',
  fontSize: '30px',
  fontStyle: 'italic',
  fontWeight: '400',
  padding: '24px',
  border: '0.5px solid black',
  flexShrink: '0',
  overflow: 'hidden',
  textAlign: 'left',
  verticalAlign: 'top',
  whiteSpace: 'nowrap',
  width: '50%',
};

const lineStyle: React.CSSProperties = {
  borderBottom: '0.5px solid black', // Add a bottom border to create the line
};

export default function AdoptedPage() {
  return (
    <div style={{
      height: "150vh"
    }}>
      <Navbar />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          alignContent: 'center',
          flexShrink: '0',
          justifyContent: 'center',
          margin: '25px 50px',
        }}
      >
        <p
          style={{
            color: 'var(--Text-Primary, #091F2F)',
            fontFamily: 'Montserrat',
            fontSize: '40px',
            fontWeight: '700',
            lineHeight: '0%',
          }}
        >
          RAIN GARDEN
        </p>
        <div
          className="line"
          style={{
            justifyContent: 'center',
            width: '100%',
            border: '6px #091F2F solid',
          }}
        ></div>
        <p
          style={{
            color: '#000',
            fontFamily: 'Montserrat',
            fontSize: '30px',
            fontWeight: '600',
            lineHeight: '0%',
            paddingTop: '24px',
          }}
        >
          Name this feature!
        </p>
        <p
          style={{
            color: 'var(--Text-Second, #288BE4)',
            fontFamily: 'Montserrat',
            fontSize: '30px',
            fontWeight: '700',
            lineHeight: '0%',
            paddingTop: '24px',
          }}
        >
          ABOUT THIS FEATURE:
        </p>

        <table style={tableStyle}>
          <tbody>
            <tr style={lineStyle}>
              <td style={cellStyle}>Feature Type</td>
              <td style={cellStyle}></td>
            </tr>
            <tr style={lineStyle}>
              <td style={cellStyle}>Feature Address</td>
              <td style={cellStyle}></td>
            </tr>
            <tr style={lineStyle}>
              <td style={cellStyle}>Year Built</td>
              <td style={cellStyle}></td>
            </tr>
            <tr style={lineStyle}>
              <td style={cellStyle}>Last Maintenance Date</td>
              <td style={cellStyle}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}