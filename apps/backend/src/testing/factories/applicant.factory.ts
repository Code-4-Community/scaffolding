import merge from 'lodash/merge';

import { Applicant } from '../../candidate-info/candidate-info.entity';

export const defaultApplicant: Applicant = {
  email: 'jane.doe@northeastern.edu',
  appId: 1,
};

export const applicantFactory = (
  applicant: Partial<Applicant> = {},
): Applicant => merge({}, defaultApplicant, applicant);

export default applicantFactory;
