import type { RefOr } from "$lib/internal/helpers";

export type ToggleProps = {
	pressed?: RefOr<boolean>;
	disabled?: RefOr<boolean>;
};
