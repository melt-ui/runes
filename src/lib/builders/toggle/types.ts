import type { SyncableProp } from "$lib/internal/helpers";

export type ToggleProps = {
	pressed?: SyncableProp<boolean>;
	disabled?: SyncableProp<boolean>;
};
