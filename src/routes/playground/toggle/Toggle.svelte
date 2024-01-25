<script lang="ts">
	import { createToggle } from "$lib";
	import { DerivedRef } from "$lib/internal/helpers";
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";

	interface Props extends Omit<HTMLButtonAttributes, "children"> {
		pressed: boolean;
		off: Snippet;
		on: Snippet;
	}

	let { pressed, disabled, off, on, ...props } = $props<Props>();

	const toggle = createToggle({
		pressed: new DerivedRef({
			get() {
				return pressed;
			},
			set(value) {
				pressed = value;
			},
		}),
		disabled: new DerivedRef({
			get() {
				return disabled ?? false;
			},
			set(value) {
				disabled = value;
			},
		}),
	});
</script>

<button {...toggle.root} {...props}>
	{#if toggle.pressed}
		{@render on()}
	{:else}
		{@render off()}
	{/if}
</button>
