<script lang="ts">
	import { writable } from "svelte/store";
	import { EASE } from "crossani";
	import crossani, { InType, OutType } from "@crossani/svelte";

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

	let trigger = writable<InType>();
	let current = writable<OutType>();

  function triggerAnimation() {
		$trigger = "step1";
		$trigger = "step2";
		$trigger = "step3";
		$trigger = step4;
	}
</script>

<div style:gap=".25em" style:display="flex">

  <button on:click={triggerAnimation}>trigger</button>
  <button on:click={() => $trigger = "default"}>reset</button>

  {#if typeof $current === "object"}
    <em>Custom animation</em>
  {:else if $current !== undefined}
    {$current}
  {:else}
    <em>Not currently animating</em>
  {/if}

</div>

<div
  use:crossani={[trigger, current, transitions]}

  style:background-color="red"
  style:width="100px"
  style:height="100px"
  style:border="5px solid blue"
  style:margin-top="1rem"
></div>