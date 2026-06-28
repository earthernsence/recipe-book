<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import type { Tag } from "$lib/server/db/schema";
  import MealTypeBadge from "./MealTypeBadge.svelte";

  const {
    tags,
    class: className = "",
    mealType
  }: {
    tags: Array<Tag>;
    class?: string;
    mealType: string;
  } = $props();
</script>

<div class="flex flex-row flex-wrap gap-2 {className}">
  <MealTypeBadge {mealType} />
  {#if tags.length > 0}
    {#each tags as tag (tag.id)}
      <Badge variant="outline">{tag.name}</Badge>
    {/each}
  {/if}
</div>
