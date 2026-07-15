/**
 * Checks whether an environment variable value is a defined, non-empty string.
 *
 * @param value The environment variable value to check.
 * @returns `true` if the value is a defined, non-empty string; `false` otherwise.
 *
 * Also tells TypeScript that provided `value` is a `string` if the function returns true.
 */
export function isNonEmptyEnv(value: string | undefined): value is string {
  if (value === undefined) {
    return false;
  }
  return value.trim() !== '';
}
