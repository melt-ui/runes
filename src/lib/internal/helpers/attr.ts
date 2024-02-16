/**
 * A helper for attributes that should be removed
 * if the value is falsy.
 */
export function booleanAttr(bool: boolean | undefined) {
	return bool ? true : undefined;
}
