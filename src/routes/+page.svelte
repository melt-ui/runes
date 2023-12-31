<script lang="ts">
	export let data;
</script>

<div class="flex w-fit flex-col gap-4 p-8">
	{#each data.routes as route}
		<a href="/playground/{route}" class="btn capitalize">
			{route}
		</a>
	{/each}
</div>
