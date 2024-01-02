<script lang="ts">
	import { createLabel } from "$lib";

	const { root } = createLabel();
</script>

<div class="flex flex-col gap-1">
	<label for="name" {...root} use:root>Name</label>
	<input id="name" type="text" />
</div>
