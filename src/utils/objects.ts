/**
 * Deep-merges two objects, without mutating the original objects
 * @param target The base object to merge into
 * @param source The object to merge from
 * @returns The merged object
 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = structuredClone(target);

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (
      sourceValue instanceof Object &&
      !Array.isArray(sourceValue) &&
      targetValue instanceof Object &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else {
      result[key] = sourceValue as any;
    }
  }

  return result;
}
