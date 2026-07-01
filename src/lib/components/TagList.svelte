<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import type { Tag } from "$lib/server/db/schema";
  import type { Difficulty, MealType } from "$lib/types";
  import DifficultyBadge from "./DifficultyBadge.svelte";
  import MealTypeBadge from "./MealTypeBadge.svelte";

  const {
    tags,
    class: className = "",
    mealType,
    difficulty
  }: {
    tags: Array<Tag>;
    class?: string;
    mealType: MealType;
    difficulty: Difficulty | null;
  } = $props();
</script>

<div class="flex flex-row flex-wrap gap-2 {className}">
  <MealTypeBadge {mealType} />
  {#if difficulty !== null}
    <DifficultyBadge {difficulty} />
  {/if}
  {#if tags.length > 0}
    {#each tags as tag (tag.id)}
      <Badge variant="outline">{tag.name}</Badge>
    {/each}
  {/if}
</div>
