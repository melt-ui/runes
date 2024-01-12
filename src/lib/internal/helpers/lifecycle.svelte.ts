import { onDestroy } from "svelte";

export type CleanupFunction = () => void;

/**
 * Basically `$effect.root`, but auto cleans up inside Svelte components.
 */
export function autodisposable(fn: () => void | CleanupFunction) {
	let cleanup: CleanupFunction | null = $effect.root(fn);

	function dispose() {
		if (cleanup !== null) {
			cleanup();
			cleanup = null;
		}
	}

	try {
		onDestroy(dispose);
	} catch {
		// Ignore the error. The user is responsible for manually
		// cleaning up builders created outside Svelte components.
	}

	return dispose;
}
