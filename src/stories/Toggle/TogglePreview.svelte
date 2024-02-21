<script lang="ts">
	import { Toggle } from "$lib/index.js";

	let { disabled } = $props<{
		disabled: boolean;
	}>();

	let pressed = $state(false);

	const toggle = new Toggle({
		pressed: {
			get: () => pressed,
			set: (value) => {
				pressed = value;
			},
		},
		disabled: () => disabled,
	});
</script>

<div class="mx-auto w-fit p-4">
	<button
		{...toggle.root()}
		class="
			h-10 w-20 rounded-md border border-magnum-400 px-6 font-medium text-magnum-400 transition-colors duration-200
			focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magnum-400
			disabled:!border disabled:!border-neutral-300/15 disabled:!bg-transparent disabled:!text-neutral-300/35
			data-[state='on']:bg-magnum-400 data-[state='on']:text-magnum-950 data-[state='on']:focus-visible:outline-offset-2
		"
	>
		{pressed ? "On" : "Off"}
	</button>
</div>
