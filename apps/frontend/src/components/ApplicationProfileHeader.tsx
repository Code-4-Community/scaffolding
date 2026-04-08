import React from 'react';

interface ApplicationProfileHeaderProps {
  firstName: string;
  lastName: string;
  pronouns?: string;
  discipline?: string;
  experienceType?: string;
  email?: string;
  phone?: string;
  over18: boolean;
}

const ApplicationProfileHeader: React.FC<ApplicationProfileHeaderProps> = ({
  firstName,
  lastName,
  pronouns,
  discipline,
  experienceType,
  email,
  phone,
  over18,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-blue-700 text-white p-6 flex items-center gap-6">
        <div className="w-24 h-24 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-14 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold capitalize">
          {firstName} {lastName}
        </h1>
      </div>

      {/* Info Section */}
      <div className="bg-white p-6 border border-gray-200 rounded-md space-y-3">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <span className="font-semibold">Pronouns:</span> {pronouns ?? 'N/A'}
          <span className="font-semibold">Discipline:</span>{' '}
          {discipline ?? 'N/A'}
          <span className="font-semibold">Type of Experience:</span>{' '}
          {experienceType ?? 'N/A'}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <span className="font-semibold">Email:</span> {email ?? 'N/A'}
          <span className="font-semibold">Phone:</span> {phone ?? 'N/A'}
          <span className="font-semibold">Over 18?</span>
          <span
            className={`inline-block px-3 py-1 text-sm rounded-full font-semibold text-white ${
              over18 ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {over18 ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ApplicationProfileHeader;
