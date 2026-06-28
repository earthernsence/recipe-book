<script lang="ts">
  import { marked } from "marked";

  import type { Step } from "$lib/server/db/schema";
  import StepNumber from "./StepNumber.svelte";

  const { steps }: { steps: Array<Step> } = $props();
</script>

<ol class="flex flex-col gap-6">
  {#each steps as step (step.id)}
    <li class="flex flex-row gap-4">
      <StepNumber number={step.orderIndex + 1} />
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      <span class="leading-relaxed prose prose-sm">{@html marked(step.content)}</span>
    </li>
  {/each}
</ol>
