import {
  PANDADOC_FIELD_MAP,
  TargetTable,
  ValidPayload,
} from './panda-field-map';

export type MappedBuckets = Record<TargetTable, Record<string, unknown>>;

const pairKey = (item: Pick<ValidPayload, 'targetTable' | 'backendField'>) =>
  `${item.targetTable}.${item.backendField}`;

// Aggregation is explicit: map items must opt in with `aggregate: 'array'`.
// If duplicate mappings exist without explicit aggregation, fail fast to avoid
// silently changing output schema from scalar to array.
const arrayFields = new Set<string>();
const pairStats = new Map<string, { count: number; allArray: boolean }>();
for (const item of PANDADOC_FIELD_MAP) {
  const key = pairKey(item);
  const stats = pairStats.get(key) ?? { count: 0, allArray: true };
  stats.count += 1;
  stats.allArray = stats.allArray && item.aggregate === 'array';
  pairStats.set(key, stats);

  if (item.aggregate === 'array') {
    arrayFields.add(key);
  }
}

for (const [key, stats] of pairStats) {
  if (stats.count > 1 && !stats.allArray) {
    throw new Error(
      `Invalid PandaDoc field map for ${key}: duplicate mappings must set aggregate: 'array'`,
    );
  }
}

function isEmptyRawValue(raw: unknown): boolean {
  if (raw == null || raw === '') return true;

  if (typeof raw === 'object') {
    if (Array.isArray(raw)) return raw.length === 0;

    const record = raw as Record<string, unknown>;
    // PandaDoc collect_file fields arrive as objects like { name, url }.
    // Treat missing/empty names as no file provided.
    if ('name' in record || 'url' in record) {
      return typeof record['name'] !== 'string' || record['name'].trim() === '';
    }

    return Object.keys(record).length === 0;
  }

  return false;
}

function normalizeRawValue(raw: unknown): unknown {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const record = raw as Record<string, unknown>;
    if (typeof record['name'] === 'string' && record['name'].trim() !== '') {
      return record['name'];
    }
  }
  return raw;
}

function resolveValue(raw: unknown, item: ValidPayload): unknown {
  if (isEmptyRawValue(raw)) {
    return item.defaultValue ?? null;
  }

  const normalized = normalizeRawValue(raw);
  return item.transform ? item.transform(String(normalized)) : normalized;
}

export function pandadocMapper(
  pandaDoc: Record<string, unknown>,
): MappedBuckets {
  const buckets: MappedBuckets = {
    application: {},
    candidateInfo: {},
    learnerInfo: {},
    volunteerInfo: {},
  };

  const missing: string[] = [];

  for (const item of PANDADOC_FIELD_MAP) {
    const raw = pandaDoc[item.pandaDocKey];
    const key = pairKey(item);

    if (item.required && isEmptyRawValue(raw)) {
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

  // If the user selected a school via `Volunteer_Affiliation` but did not
  // provide an explicit `Volunteer_ Affiliation_Other` entry, store the raw name in
  // `learnerInfo.otherSchool`. This keeps the enum-backed `school` safe
  // while preserving the free-text source value.
  if (
    (buckets.learnerInfo['otherSchool'] == null ||
      buckets.learnerInfo['otherSchool'] === '') &&
    pandaDoc['Volunteer_Affiliation']
  ) {
    buckets.learnerInfo['otherSchool'] = pandaDoc['Volunteer_Affiliation'];
  }

  return buckets;
}
