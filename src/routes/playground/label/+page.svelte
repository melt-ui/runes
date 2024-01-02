<script lang="ts">
	import { createLabel } from "$lib";
	import { melt } from "@melt-ui/svelte";

	const { root } = createLabel();
</script>

<div class="flex flex-col gap-1">
	<label for="name" use:melt={root}>Name</label>
	<input id="name" type="text" />
</div>
