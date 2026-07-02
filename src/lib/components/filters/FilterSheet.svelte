<script lang="ts">
  import { SlidersHorizontal } from "@lucide/svelte";

  import { Button } from "$lib/components/ui/button";
  import * as Sheet from "$lib/components/ui/sheet";
  import type { Tag } from "$lib/server/db/schema";
  import { type FilterState, RecipeFilter } from "$lib/utils/utils_filtering";
  import FilterControls from "./FilterControls.svelte";

  let {
    filters,
    allTags,
    cuisineOptions,
    authenticated = false,
    onchange
  }: {
    filters: FilterState;
    allTags: Array<Tag>;
    cuisineOptions: { cuisines: Array<[string, number]>; noneCount: number };
    authenticated?: boolean;
    onchange: (next: FilterState) => void;
  } = $props();

  let open = $state(false);
  const count = $derived(RecipeFilter.activeFilterCount(filters));
</script>

<div class="lg:hidden">
  <Button variant="outline" onclick={() => (open = true)} class="gap-2 min-h-11">
    <SlidersHorizontal size={16} />
    Filters
    {#if count > 0}
      <span
        class="flex items-center justify-center size-5 rounded-full bg-primary text-primary-foreground text-xs font-semibold"
      >
        {count}
      </span>
    {/if}
  </Button>

  <Sheet.Root bind:open>
    <Sheet.Content side="bottom" class="max-h-[80vh] flex flex-col rounded-t-2xl">
      <Sheet.Header class="shrink-0 pb-4">
        <Sheet.Title class="font-serif text-xl">Filters</Sheet.Title>
      </Sheet.Header>
      <div class="overflow-y-auto flex-1 safe-area-bottom px-4">
        <FilterControls
          {filters}
          {allTags}
          {cuisineOptions}
          {authenticated}
          onchange={next => {
            onchange(next);
            open = false;
          }}
        />
      </div>
    </Sheet.Content>
  </Sheet.Root>
</div>
