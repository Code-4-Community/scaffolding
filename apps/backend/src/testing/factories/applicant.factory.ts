import merge from 'lodash/merge';

import { Applicant } from '../../applicants/applicant.entity';

export const defaultApplicant: Applicant = {
  appId: 1,
  firstName: 'Jane',
  lastName: 'Doe',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-06-30'),
};

export const applicantFactory = (
  applicant: Partial<Applicant> = {},
): Applicant => merge({}, defaultApplicant, applicant);

export default applicantFactory;
