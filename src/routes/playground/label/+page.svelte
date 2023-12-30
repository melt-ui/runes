<script lang="ts">
	import { Label } from '$lib';

	const label = new Label();
</script>

<label for="name" {...label}>Name</label>
<input id="name" type="text" />
