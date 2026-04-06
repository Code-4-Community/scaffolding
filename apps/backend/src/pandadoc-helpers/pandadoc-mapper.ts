import {
  PANDADOC_FIELD_MAP,
  TargetTable,
  ValidPayload,
} from './pandadoc-field-map';

/**
 * Module: pandadoc-mapper
 *
 * Map a raw PandaDoc webhook payload (record of field id -> value) into
 * structured backend buckets used by the application. The mapping is driven
 * by the `PANDADOC_FIELD_MAP` declarations imported from
 * `pandadoc-field-map.ts`.
 */

/**
 * Output shape produced by `pandadocMapper`.
 *
 * Each key is one of the backend target tables and the value is an object
 * mapping backend field names to the resolved value for that field.
 */
export type MappedBuckets = Record<TargetTable, Record<string, unknown>>;

/**
 * Helper to create a stable key for a mapping pair used in aggregation
 * bookkeeping: `${targetTable}.${backendField}`.
 */
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

/**
 * Determine whether a raw PandaDoc field value should be treated as empty.
 *
 * - `null`, `undefined`, and the empty string are empty.
 * - Arrays with zero length are empty.
 * - PandaDoc `collect_file` values are objects with `name`/`url` keys;
 *   treat missing or blank `name` as empty.
 */
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

/**
 * Normalize a raw PandaDoc value prior to applying any transform. For
 * `collect_file` objects prefer the `name` property so downstream transforms
 * receive a compact string filename instead of the whole object.
 */
function normalizeRawValue(raw: unknown): unknown {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const record = raw as Record<string, unknown>;
    if (typeof record['name'] === 'string' && record['name'].trim() !== '') {
      return record['name'];
    }
  }
  return raw;
}

/**
 * Normalize native checkbox-style PandaDoc values into a boolean selection
 * indicator. PandaDoc may supply booleans (`true`/`false`) or string values
 * such as "on", "yes", "checked", etc.
 */
function isCheckboxSelected(raw: unknown): boolean {
  if (raw === true) return true;
  if (raw === false) return false;
  if (raw == null) return false;
  if (typeof raw === 'string') {
    const normalized = raw.trim().toLowerCase();
    return (
      normalized === 'yes' ||
      normalized === 'true' ||
      normalized === 'on' ||
      normalized === 'checked'
    );
  }
  return false;
}

/**
 * Resolve a raw PandaDoc value for a mapping entry.
 *
 * - If the raw value is considered empty, return the mapping's
 *   `defaultValue` (when provided) or `null`.
 * - Otherwise normalize the raw value and apply any mapping-specific
 *   `transform` function.
 */
function resolveValue(raw: unknown, item: ValidPayload): unknown {
  if (isEmptyRawValue(raw)) {
    return item.defaultValue ?? null;
  }

  const normalized = normalizeRawValue(raw);
  return item.transform ? item.transform(String(normalized)) : normalized;
}

/**
 * Map a PandaDoc payload into backend buckets according to
 * `PANDADOC_FIELD_MAP`.
 *
 * The mapper aggregates entries for fields marked with `aggregate: 'array'`
 * into arrays. For checkbox-style values aggregation only occurs when the
 * raw value indicates a selection (avoids adding `false`/unselected values).
 *
 * @param pandaDoc - Raw PandaDoc payload (field id -> value)
 * @returns resolved and structured `MappedBuckets` suitable for persistence
 */
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
      // Only aggregate when the raw value indicates a selected checkbox
      // or when the resolved value is a non-empty file/name (objects).
      const shouldInclude =
        // file/collect_file values -> include when resolved (name) is present
        (typeof raw === 'object' &&
          raw != null &&
          !Array.isArray(raw) &&
          !isEmptyRawValue(raw)) ||
        // checkbox-like values -> include only when selected
        isCheckboxSelected(raw);

      if (shouldInclude && resolved != null) {
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
