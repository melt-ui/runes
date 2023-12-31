import { nanoid } from "nanoid/non-secure";
import type { Prettify } from "../types";

/**
 * A function that generates a random id
 * @returns An id
 */
export function generateId(): string {
	return nanoid(10);
}

export type IdObj<Part extends string> = Prettify<{
	[K in Part]: string;
}>;
