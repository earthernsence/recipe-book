<script lang="ts">
  import { marked } from "marked";

  import type { Step } from "$lib/server/db/schema";

  const { steps }: { steps: Array<Step> } = $props();
</script>

<ol class="flex flex-col gap-6">
  {#each steps as step (step.id)}
    <li class="flex flex-row gap-4">
      <span
        class="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm shrink-0 mt-0.5"
      >
        {step.orderIndex + 1}
      </span>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      <span class="leading-relaxed prose prose-sm">{@html marked(step.content)}</span>
    </li>
  {/each}
</ol>
