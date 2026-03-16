import { PANDADOC_FIELD_MAP, TargetTable } from './panda-field-map';

// massive dictionary of pandaDoc keys and backend field
// {
//   'pandaDocKey': 'backendField',
//   'name': 'firstName',
//   'email': 'email',
//   'phone': 'phone',
//   'address': 'address',
//   'city': 'city',
//   'state': 'state',
//   'zip': 'zip',
// }

export function PANDADOC_MAPPER(pandaDoc: Record<string, unknown>) {
  const buckets: Record<TargetTable, Record<string, unknown>> = {
    application: {},
    applicant: {},
    learnerInfo: {},
    volunteerInfo: {},
  };

  for (const item of PANDADOC_FIELD_MAP) {
    const { pandaDocKey, backendField, transform, defaultValue } = item;
    let value = null;
    value = pandaDoc[pandaDocKey];
    if (value) {
      if (transform) {
        value = transform(value);
      } else value = defaultValue;
    }
    buckets[item.targetTable][backendField] = value;
  }
}
