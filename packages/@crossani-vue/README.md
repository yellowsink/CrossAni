## Vue CrossAni

Bringing the awesome CrossAni transition and animation framework to Vue.

## Installation

You don't need to install and import the main crossani package if you dont need
the EASE values available.

- `npm i crossani @crossani/vue`
- `pnpm i crossani @crossani/vue`
- `yarn add crossani @crossani/vue`

## Usage

1. In your component, import `EASE` from crossani and `vCrossani` from @crossani/vue:

```vue
<!-- ts completely optional of course -->
<script setup lang="ts">
import {EASE} from "crossani";
import vCrossani from "@crossani/vue";
</script>
```

2. Create a ref to hold the trigger, and hook up to an element:

```vue
<script setup lang="ts">
import {EASE, Transition} from "crossani";
import vCrossani from "@crossani/vue";
import {ref} from "vue";

const trigger = ref<string | Transition>();
</script>

<template>
  <div v-crossani="trigger" />
</template>
```

3. Add some transitions (see main CrossAni readme)

```vue
<script setup lang="ts">
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

<template>
  <div v-crossani="[transitions, trigger]" />
</template>
```

4. Run your transitions!

```vue

<script setup lang="ts">
import {onMounted} from "vue";

onMounted(() => {
  trigger.value = "default";
})
</script>
```

5. **OPTIONAL!!** Get the current state in a ref

```vue
<script setup lang="ts">
  const current = ref<string | Transition | null>();
</script>

<template>
  <div 
      v-crossani="[transitions, trigger]"
      @animated="v => current = v.detail"
  />

  <template v-if="typeof current !== 'object'">{{ current }}</template>
  <em v-else-if="current === null">Not currently animating</em>
  <em v-else>Custom animation</em>
</template>
```

## A complete example

```vue
<script setup lang="ts">
import {EASE, Transition} from "crossani";
import vCrossani from "@crossani/vue";
import {ref, onMounted} from "vue";

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

const trigger = ref<string | Transition>();
const current = ref<string | Transition | null>();

onMounted(() => {
  trigger.value = "default";
})
</script>

<template>
  <template v-if="typeof current !== 'object'">{{ current }}</template>
  <em v-else-if="current === null">Not currently animating</em>
  <em v-else>Custom animation</em>
  
  <button @click="trigger = 'alternate'">trigger</button>
  <button @click="trigger = 'default'">reset</button>

  <div
      v-crossani="[transitions, trigger]"
      @animated="v => current = v.detail"
  />
</template>
```