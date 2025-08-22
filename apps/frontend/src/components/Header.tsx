import React from 'react';

interface CustomNameHeaderProps {
  firstName: string;
  lastName: string;
}

// helper function to get initials from first and last name
const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const CustomNameHeader: React.FC<CustomNameHeaderProps> = ({
  firstName,
  lastName,
}) => {
  const initials = getInitials(firstName, lastName);
  const fullName = `${firstName} ${lastName}`;

  return (
    <div className="w-full">
      {/* Header Section - no background, inherits from parent */}
      <div className="flex items-center gap-4 px-6 py-4">
        {/* Custom Avatar with Initials */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#D0D0D0' }}
        >
          <span className="text-white text-sm font-medium">{initials}</span>
        </div>

        {/* Custom Name */}
        <h1 className="text-2xl font-medium text-gray-900">{fullName}</h1>
      </div>

      {/* Separator Line */}
      <div className="w-full h-px" style={{ backgroundColor: '#D9D9D9' }}></div>
    </div>
  );
};

export default CustomNameHeader;
