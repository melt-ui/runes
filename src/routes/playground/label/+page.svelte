<script lang="ts">
	import { Label } from "$lib/index.js";

	const label = new Label();
</script>

<h1>Label</h1>

<div class="flex flex-col gap-2">
	<label for="name" {...label.root()}>Name</label>
	<input id="name" type="text" />
</div>
