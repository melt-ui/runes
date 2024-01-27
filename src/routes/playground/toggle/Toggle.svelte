<script lang="ts">
	import { Toggle } from "$lib";

	import { box } from "$lib/internal/helpers/box.svelte";
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";

	interface Props extends Omit<HTMLButtonAttributes, "children"> {
		pressed: boolean;
		off: Snippet;
		on: Snippet;
	}

	let { pressed, disabled, class: className = "", off, on, ...props } = $props<Props>();

	const toggle = new Toggle({
		pressed: box(
			() => pressed,
			(v) => (pressed = v),
		),
		disabled: box(() => disabled ?? false),
	});
</script>

<button {...toggle.root} {...props} class="btn {className}">
	{#if pressed}
		{@render on()}
	{:else}
		{@render off()}
	{/if}
</button>
