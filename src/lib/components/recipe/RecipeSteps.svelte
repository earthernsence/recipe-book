<script lang="ts">
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
      <span class="text-foreground leading-relaxed">{step.content}</span>
    </li>
  {/each}
</ol>
