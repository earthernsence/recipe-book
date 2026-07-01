<script lang="ts">
  import { Utensils } from "@lucide/svelte";

  import type { Difficulty } from "$lib/types";

  const { difficulty }: { difficulty: Difficulty } = $props();

  const difficultyLevel = {
    easy: 1,
    intermediate: 2,
    hard: 3
  }[difficulty];
</script>

<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border border-border">
  <div class="inline-flex gap-0.5">
    {#each { length: difficultyLevel }}
      <Utensils size={12} />
    {/each}
  </div>
  {difficulty}
</span>
