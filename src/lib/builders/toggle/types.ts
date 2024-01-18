import type { SyncableProp } from "$lib/internal/types";

export type ToggleProps = {
	pressed?: SyncableProp<boolean>;
	disabled?: SyncableProp<boolean>;
};
