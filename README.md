# Melt UI Runes Experiment

## Introduction

This is an experiment that aims to migrate existing Melt UI builders to runes.

### Credits

Most of the work has been done by [Abdelrahman](https://github.com/abdel-17)!

## New API

The new API relies on classes instead of stores for creating builders.

```svelte
<!-- previously -->
<script>
	export let open;

	const {
		elements: { trigger, content, arrow },
		states,
	} = createTooltip({
		defaultOpen: open,
		onOpenChange: ({ curr, next }) => {
			open = next;
			return next;
		},
	});

	$: states.open.set(open);
</script>

<button use:melt={$trigger}>Trigger</button>

{#if open}
	<div use:melt={$content}>
		<div use:melt={$arrow} />
		<p>Hello world!</p>
	</div>
{/if}
```

```svelte
<!-- now -->
<script>
	let { open } = $props();

	const tooltip = new Tooltip({
		open: {
			get: () => open,
			set: (v) => (open = v),
		},
	});
</script>

<button {...tooltip.trigger()}>Trigger</button>

{#if open}
	<div {...tooltip.content()}>
		<div {...tooltip.arrow()} />
		<p>Hello world!</p>
	</div>
{/if}
```

I hear you saying "Ugh, classes". Let me explain the reasoning behind this choice:

1. They are more performant, especially with runes. No need for getters and setters for every state.
2. Destructuring makes it hard to use multiple builders in the same page because you need to rename multiple variables. This is no longer the case with the new API.

## Usage

Try out the new API yourself by cloning this repo.

```bash
git clone https://github.com/melt-ui/runes-experiment.git
```

You'll find three builders have been migrated to runes.

1. Label
2. Toggle
3. Tooltip

```ts
import { Label, Toggle, Tooltip } from "$lib/index.js";
```

You'll also find an example for each builder under the `src/routes/playground` directory.
