# Melt-UI Runes Experiment

## Introduction
This is an experiment that aims to migrate existing Melt-UI builders to runes.

## New API
The new API relies on classes instead of stores for creating builders.

```svelte
<!-- previously -->
<script>
    const {
        elements: { trigger, content, arrow },
        states: { open }
    } = createTooltip({
        forceVisible: true,
        onOpenChange: ({ curr, next }) => {
            console.log("onOpenChange", curr, next);
            return next;
        }
    });
</script>

<button use:melt={$trigger}>Trigger</button>

{#if $open}
    <div use:melt={$content}>
        <div use:melt={$arrow} />
        <p>Hello world!</p>
    </div>
{/if}
```

```svelte
<!-- now -->
<script>
    const tooltip = new Tooltip({
        forceVisible: true,
        onOpenChange: (next) => {
            const curr = tooltip.open;
            console.log("onOpenChange", curr, next);
            return next;
        }
    });
</script>

<button use:melt={tooltip.trigger}>Trigger</button>

{#if tooltip.open}
    <div use:melt={tooltip.content}>
        <div use:melt={tooltip.open} />
        <p>Hello world!</p>
    </div>
{/if}
```

I hear you saying "Ugh, classes". Let me explain the reasoning behind this choice:
1. They are more performant, especially with runes. No need for getters and setters for every state.
2. Destructuring makes it hard to use multiple builders in the same page because you need to rename multiple variables. This is no longer the case with classes.

## Usage
Try out the new API yourself by cloning this repo.

```bash
git clone https://github.com/abdel-17/melt-ui-runes-experiment
```

You'll find three builders have been migrated to runes.
1. Label
2. Toggle
3. Tooltip

```ts
import { Label, Toggle, Tooltip } from "$lib";
```

You'll also find an example for each builder under the `src/routes/playground` directory.
