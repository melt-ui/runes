<div class="flex w-fit flex-col gap-4 p-8">
	{#each ["label", "toggle"] as route}
		<a href="/playground/{route}" class="btn capitalize">
			{route}
		</a>
	{/each}
</div>
