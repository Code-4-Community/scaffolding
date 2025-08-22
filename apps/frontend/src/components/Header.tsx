import React from 'react';
import Avatar from '@mui/material/Avatar';

interface CustomNameHeaderProps {
  initials?: string;
  name?: string;
}

const CustomNameHeader: React.FC<CustomNameHeaderProps> = ({
  initials = 'CN',
  name = 'Custom Name',
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-4 px-6 py-4">
        {/* MUI Avatar with Initials */}
        <Avatar
          sx={{
            width: 40,
            height: 40,
            backgroundColor: '#D0D0D0',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {initials}
        </Avatar>

        {/* Name */}
        <h1 className="text-2xl font-medium text-gray-900">{name}</h1>
      </div>

      {/* Separator Line */}
      <div className="w-full h-px" style={{ backgroundColor: '#D9D9D9' }}></div>
    </div>
  );
};

export default CustomNameHeader;
