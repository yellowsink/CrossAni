## Svelte CrossAni

Bringing the awesome CrossAni transition and animation framework to Svelte.

## Installation

You don't need to install and import the main crossani package if you dont need
the EASE values available.

- `npm i crossani @crossani/svelte`
- `pnpm i crossani @crossani/svelte`
- `yarn add crossani @crossani/svelte`

## Usage

1. In your component, import `EASE` from crossani and `crossani` from @crossani/svelte, like so:

You may also import some utility types for stores later.

```html
<!-- ts completely optional of course -->
<script lang="ts">
  import {EASE} from "crossani";
  import crossani from "@crossani/svelte";
  // optional
  import type {InType, OutType} from "@crossani/svelte"
</script>
```

2. Create a store to trigger the animation, and hook up to an element:

```html

<script lang="ts">
  import {writable} from "svelte/store";

  let trigger = writable < InType > (); // for non-ts just omit the <InType>
</script>

<div
  use:crossani={[{}, trigger]}
></div>
```

3. Add some transitions (see main CrossAni readme)

```html

<script lang="ts">
  const transitions = {
    default: {
      state: {},
      reset: true,
      cutOff: true,
      ms: 500,
      easing: EASE.inOut,
    },
    alternate: {
      state: {"margin-top": "2rem"},
      ms: 250,
      easing: EASE.out,
    },
  }
</script>

<div
  use:crossani={[transitions, trigger]}
></div>
```

4. Run your transitions!

```html

<script lang="ts">
  import {onMount} from "svelte";

  onMount(() => {
    $trigger = "default";
  });
</script>
```

5. **OPTIONAL!!** Get the current state in a store

```html

<script lang="ts">
  let current = writable < OutType > ();
</script>

<div
  use:crossani={[{}, trigger, current]}
></div>

{#if typeof $current === "object"}
<em>Custom animation</em>
{:else if $current !== undefined}
{$current}
{:else}
<em>Not currently animating</em>
{/if}
```

## A complete example

```html

<script lang="ts">
  import {writable} from "svelte/store";
  import {EASE} from "crossani";
  import crossani, {InType, OutType} from "@crossani/svelte";

  const transitions = {
    default: {
      state: {},
      reset: true,
      cutOff: true,
      ms: 500,
      easing: EASE.inOut,
    },
    alternate: {
      state: {"margin-top": "2rem"},
      ms: 250,
      easing: EASE.out,
    },
  }

  let trigger = writable < InType > ();
  let current = writable < OutType > ();
</script>

{#if typeof $current === "object"}
  <em>Custom animation</em>
{:else if $current !== undefined}
  {$current}
{:else}
  <em>Not currently animating</em>
{/if}

<button on:click={() => $trigger = "alternate"}>trigger</button>
<button on:click={() => $trigger = "default"}>reset</button>

<div
  use:crossani={[transitions, trigger, current]}
></div>
```