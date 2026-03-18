import {
  PANDADOC_FIELD_MAP,
  TargetTable,
  ValidPayload,
} from './panda-field-map';

export type MappedBuckets = Record<TargetTable, Record<string, unknown>>;

// Some backend fields are fed by multiple PandaDoc keys and need to be
// collected into an array rather than overwritten. For example, each interest-
// area checkbox is its own PandaDoc field, but they all map to the single
// application.interest column. We detect these at startup by finding any
// (targetTable, backendField) pair that appears more than once in the map.
const arrayFields = new Set<string>();
const seen = new Set<string>();
for (const item of PANDADOC_FIELD_MAP) {
  const key = `${item.targetTable}.${item.backendField}`;
  if (seen.has(key)) {
    arrayFields.add(key);
  }
  seen.add(key);
}

function resolveValue(raw: unknown, item: ValidPayload): unknown {
  if (raw == null || raw === '') {
    return item.defaultValue ?? null;
  }
  return item.transform ? item.transform(String(raw)) : raw;
}

export function pandadocMapper(
  pandaDoc: Record<string, unknown>,
): MappedBuckets {
  const buckets: MappedBuckets = {
    application: {},
    applicant: {},
    learnerInfo: {},
    volunteerInfo: {},
  };

  const missing: string[] = [];

  for (const item of PANDADOC_FIELD_MAP) {
    const raw = pandaDoc[item.pandaDocKey];
    const key = `${item.targetTable}.${item.backendField}`;

    if (item.required && (raw == null || raw === '')) {
      missing.push(item.pandaDocKey);
      continue;
    }

    const resolved = resolveValue(raw, item);

    // Array fields get aggregated (e.g. interest checkboxes → interest[]),
    // everything else is a simple assignment.
    if (arrayFields.has(key)) {
      const bucket = buckets[item.targetTable];
      if (!Array.isArray(bucket[item.backendField])) {
        bucket[item.backendField] = [];
      }
      if (resolved != null) {
        (bucket[item.backendField] as unknown[]).push(resolved);
      }
    } else {
      buckets[item.targetTable][item.backendField] = resolved;
    }
  }

  // Collect all missing required fields before throwing so the caller
  // gets a single error listing everything that needs to be fixed.
  if (missing.length > 0) {
    throw new Error(`Missing required PandaDoc fields: ${missing.join(', ')}`);
  }

  return buckets;
}
