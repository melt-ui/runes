<script lang="ts">
	import { createToggle } from "$lib";
	import { derivedRef } from "$lib/internal/helpers";
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";

	interface Props extends Omit<HTMLButtonAttributes, "children"> {
		pressed: boolean;
		off: Snippet;
		on: Snippet;
	}

	let { pressed, disabled, off, on, ...props } = $props<Props>();

	const toggle = createToggle({
		pressed: derivedRef({
			get() {
				return pressed;
			},
			set(value) {
				pressed = value;
			},
		}),
		disabled: derivedRef(() => disabled ?? false),
	});
</script>

<button {...toggle.root} {...props}>
	{#if toggle.pressed}
		{@render on()}
	{:else}
		{@render off()}
	{/if}
</button>
