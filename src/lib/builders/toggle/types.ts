import type { MutableRefOr, RefOr } from "$lib/internal/helpers";

export type ToggleProps = {
	pressed?: MutableRefOr<boolean>;

	disabled?: RefOr<boolean>;
};
