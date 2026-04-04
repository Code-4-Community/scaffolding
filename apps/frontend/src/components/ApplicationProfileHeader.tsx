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

export const ApplicationProfileHeader: React.FC<
  ApplicationProfileHeaderProps
> = ({
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
    <div className="bg-blue-700 text-white p-6 flex items-center gap-6">
      <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
        <span></span>
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-4">{`${firstName} ${lastName}`}</h1>
        <div className="text-white space-y-1 text-sm">
          {pronouns && (
            <div>
              <span className="font-semibold">Pronouns:</span> {pronouns}
            </div>
          )}
          {discipline && (
            <div>
              <span className="font-semibold">Discipline:</span> {discipline}
            </div>
          )}
          {experienceType && (
            <div>
              <span className="font-semibold">Type of Experience:</span>{' '}
              {experienceType}
            </div>
          )}
          {email && (
            <div>
              <span className="font-semibold">Email:</span> {email}
            </div>
          )}
          {phone && (
            <div>
              <span className="font-semibold">Phone:</span> {phone}
            </div>
          )}
          <div>
            <span className="font-semibold">Over 18?</span>{' '}
            <span
              className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${
                over18 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              {over18 ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationProfileHeader;
