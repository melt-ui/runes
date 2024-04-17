/**
 * Create a new subset object by giving keys
 *
 * @category Object
 */
export function pick<O extends object, const T extends keyof O>(obj: O, keys: T[], omitUndefined = false) {
	return keys.reduce((n, k) => {
		if (k in obj) {
			if (!omitUndefined || obj[k] !== undefined) { n[k] = obj[k]; }
		}
		return n;
	}, {} as Pick<O, T>);
}

type KeysWithoutSymbols<T> = Exclude<keyof T, symbol> & string;

export function keys<O extends object>(obj: O) {
	return Object.keys(obj) as (KeysWithoutSymbols<O>)[];
}