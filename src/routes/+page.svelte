<script lang="ts">
	let { data } = $props();
</script>

<h1>Melt UI Showcase</h1>

<div class="flex gap-4">
	{#each data.routes as route}
		<a href="/playground/{route}" class="btn capitalize">
			{route}
		</a>
	{/each}
</div>
