<script lang="ts">
	import { Label } from "$lib/index.js";

	const label = new Label();
</script>

<div class="flex flex-col gap-1">
	<label for="name" {...label.root}>Name</label>
	<input id="name" type="text" />
</div>
