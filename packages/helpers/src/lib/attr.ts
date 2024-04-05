import type { PortalTarget } from "./use-portal.js";

/**
 * A helper for attributes that should be removed
 * if the value is `false`.
 */
export function booleanAttr(bool: boolean): true | undefined {
	return bool ? true : undefined;
}

export function portalAttr(portal: PortalTarget | null): "" | undefined {
	return portal !== null ? "" : undefined;
}
