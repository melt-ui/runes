<script lang="ts">
	import { Toggle } from "$lib";
	import { Derived, MutableDerived } from "$lib/internal/helpers";
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";

	interface Props extends Omit<HTMLButtonAttributes, "children"> {
		pressed: boolean;
		off: Snippet;
		on: Snippet;
	}

	let { pressed, disabled, class: className = "", off, on, ...props } = $props<Props>();

	const toggle = new Toggle({
		pressed: new MutableDerived({
			get() {
				return pressed;
			},
			set(value) {
				pressed = value;
			},
		}),
		disabled: new Derived(() => disabled ?? false),
	});
</script>

<button {...toggle.root} {...props} class="btn {className}">
	{#if pressed}
		{@render on()}
	{:else}
		{@render off()}
	{/if}
</button>
