<script lang="ts">
	import { transport } from "@melt-ui/helpers";
	import { createToggle } from "@melt-ui/toggle";

	let {
		pressed = $bindable(false),
		disabled,
	}: { pressed?: boolean; disabled?: boolean } = $props();

	const toggle = createToggle(
		transport(() => ({
			pressed,
			setPressed: (value: boolean) => (pressed = value),
			disabled,
		})),
	);

	toggle.pressed = false;
</script>

<button {...toggle.root} class="flex items-center">
	{toggle.pressed ? "On" : "Off"}
</button>
