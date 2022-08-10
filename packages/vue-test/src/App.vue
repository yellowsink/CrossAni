<script setup lang="ts">

import {ref} from "vue";
import {EASE, Transition} from "crossani";
import vCrossani from "@crossani/vue";

const transitions = {
  default: {
    reset: true,
    ms: 500,
  },

  step1: {
    state: {
      "background-color": "blue",
      border: "2px dashed red",
    },
    ms: 250,
    easing: EASE.linear,
  },

  step2: {
    state: {
      width: "250px",
      height: "90px",
    },
    ms: 300,
    easing: EASE.in,
  },

  step3: {
    state: {
      transform: "rotate(170deg)",
      "margin-left": "15rem",
    },
    ms: 600,
    easing: EASE.out,
  },
};

const step4 = {
  state: {
    background: "radial-gradient(circle at 110px, red, green)",
    "border-radius": "50%",
    "box-shadow": "0 0 10px black",
    transform: "rotate(170deg) translateX(50px) skewY(40deg)",
  },
  ms: 150,
  easing: EASE.startSteps(2),
};

const trigger = ref<string | Transition>("");
const current = ref<string | Transition | undefined>();

async function triggerAnimation() {
  trigger.value = "step1";
  await Promise.resolve(); // microtask abuse
  trigger.value = "step2";
  await Promise.resolve();
  trigger.value = "step3";
  await Promise.resolve();
  trigger.value = step4;
}

</script>

<template>

  <div style="gap: .25rem; display: flex">

    <button @click="triggerAnimation">trigger</button>
    <button @click="trigger = 'default'">reset</button>

    <template v-if="typeof current !== 'object'">{{ current }}</template>
    <em v-else-if="current === null">Not currently animating</em>
    <em v-else>Custom animation</em>


  </div>

  <div
      v-crossani="[transitions, trigger]"
      @animated="v => current = v.detail"
      :style="{
          backgroundColor: 'red',
          width: '100px',
          height: '100px',
          border: '5px solid blue',
          marginTop: '1rem'
        }"
  />

</template>