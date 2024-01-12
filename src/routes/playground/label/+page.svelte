<script lang="ts">
	import { Label, melt } from "$lib";

	const label = new Label();
</script>

<div class="flex flex-col gap-1">
	<label for="name" use:melt={label.root}>Name</label>
	<input id="name" type="text" />
</div>
