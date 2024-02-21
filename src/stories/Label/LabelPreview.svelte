<script lang="ts">
	import { Label } from "$lib/index.js";

	const label = new Label();
</script>

<div class="mx-auto flex w-fit flex-col gap-2 p-4">
	<label {...label.root()} for="email" class="font-medium">Email</label>
	<input
		id="email"
		type="email"
		placeholder="Enter your email"
		class="
			h-10 appearance-none rounded px-3 text-black
			focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-magnum-400
		"
	/>
</div>
