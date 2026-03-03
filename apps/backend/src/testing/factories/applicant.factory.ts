import merge from 'lodash/merge';

import { Applicant } from '../../applicants/applicant.entity';

export const defaultApplicant: Applicant = {
  appId: 1,
  firstName: 'Jane',
  lastName: 'Doe',
};

export const applicantFactory = (
  applicant: Partial<Applicant> = {},
): Applicant => merge({}, defaultApplicant, applicant);

export default applicantFactory;
