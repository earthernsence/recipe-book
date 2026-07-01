<script lang="ts">
  import { ArrowDown01, ArrowDown10, ArrowDownAZ, ArrowDownZA, Funnel, FunnelX, Star } from "@lucide/svelte";

  import { Badge } from "$lib/components/ui/badge";
  import * as Select from "$lib/components/ui/select";
  import type { Tag } from "$lib/server/db/schema";
  import { type Difficulty, MEAL_TYPES } from "$lib/types";
  import { type FilterState, RecipeFilter, type SortMode } from "$lib/utils/utils_filtering";

  const SORT_OPTIONS: Array<{ value: SortMode; label: string; icon: typeof ArrowDownAZ }> = [
    { value: "alpha-asc", label: "A → Z", icon: ArrowDownAZ },
    { value: "alpha-desc", label: "Z → A", icon: ArrowDownZA },
    { value: "newest", label: "Newest first", icon: ArrowDown01 },
    { value: "oldest", label: "Oldest first", icon: ArrowDown10 }
  ];

  const DIFFICULTY_OPTIONS: Array<{ value: Difficulty; label: string }> = [
    { value: "easy", label: "Easy" },
    { value: "intermediate", label: "Intermediate" },
    { value: "hard", label: "Hard" }
  ];

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
    authenticated: boolean;
    onchange: (next: FilterState) => void;
  } = $props();

  // Lets us change one filter at a time w/o having to write
  // a bunch of functions that do approximately the same thing
  function patch(partial: Partial<FilterState>) {
    onchange({ ...filters, ...partial });
  }

  function toggleTag(id: number) {
    const next = new Set(filters.tagIds);
    next.has(id) ? next.delete(id) : next.add(id);
    patch({ tagIds: next });
  }

  function toggleMealType(value: string) {
    const next = new Set(filters.mealTypes);
    next.has(value) ? next.delete(value) : next.add(value);
    patch({ mealTypes: next });
  }

  function clearAll() {
    onchange({
      search: filters.search,
      tagIds: new Set(),
      cuisine: "",
      favourites: false,
      mealTypes: new Set(),
      difficulty: "",
      sort: "alpha-asc"
    });
  }

  const filterCount = $derived(RecipeFilter.activeFilterCount(filters));
</script>

<div class="flex flex-col gap-6">
  <!-- Sorting options -->

  <div class="flex flex-col gap-2">
    <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sort</span>
    <div class="flex flex-col gap-1">
      {#each SORT_OPTIONS as option (option.value)}
        <button
          type="button"
          onclick={() => patch({ sort: option.value })}
          class="text-left text-sm px-2 py-1.5 rounded-md transition-colors {filters.sort === option.value
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-foreground hover:bg-muted'}"
        >
          <option.icon size={16} />
          {option.label}
        </button>
      {/each}
    </div>
  </div>

  <!-- Favourite toggle -->

  {#if authenticated}
    <div class="flex flex-col gap-2">
      <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Favourites</span>
      <button
        type="button"
        onclick={() => patch({ favourites: !filters.favourites })}
        class="flex items-center gap-2 text-sm px-2 py-1.5 rounded-md transition-colors {filters.favourites
          ? 'bg-accent/20 text-foreground font-medium'
          : 'text-foreground hover:bg-muted'}"
      >
        <Star size={16} class={filters.favourites ? "fill-accent stroke-accent" : "stroke-current"} />
        Favourites only
      </button>
    </div>
  {/if}

  <!-- Meal type selector -->

  <div class="flex flex-col gap-2">
    <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Meal type</span>
    <div class="flex flex-col gap-1">
      {#each MEAL_TYPES as mt (mt.value)}
        <button
          type="button"
          onclick={() => toggleMealType(mt.value)}
          class="text-left text-sm px-2 py-1.5 rounded-md transitionj-colors {filters.mealTypes.has(mt.value)
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-foreground hover:bg-muted'}"
        >
          {mt.label}
        </button>
      {/each}
    </div>
  </div>

  <!-- Difficulty selector -->

  <div class="flex flex-col gap-2">
    <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Difficulty</span>
    <div class="flex flex-col gap-1">
      {#each DIFFICULTY_OPTIONS as option (option.value)}
        <button
          type="button"
          onclick={() => patch({ difficulty: option.value })}
          class="text-left text-sm px-2 py-1.5 rounded-md transition-colors {filters.difficulty === option.value
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-foreground hover:bg-muted'}"
        >
          {option.label}
        </button>
      {/each}
    </div>
  </div>

  <!-- Cuisine -->

  {#if cuisineOptions.cuisines.length > 0 || cuisineOptions.noneCount > 0}
    <div class="flex flex-col gap-2">
      <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cuisine</span>
      <Select.Root
        type="single"
        value={filters.cuisine || "all"}
        onValueChange={v => patch({ cuisine: v === "all" ? "" : v })}
      >
        <Select.Trigger class="w-full min-h-11 text-sm">
          {filters.cuisine === "none" ? "None specified" : filters.cuisine || "All cuisines"}
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="all">All cuisines</Select.Item>
          <Select.Separator />
          {#each cuisineOptions.cuisines as [name, count] (name)}
            <Select.Item value={name}>
              <span class="flex w-full justify-between gap-4">
                {name}
                <span class="text-muted-foreground text-xs">({count})</span>
              </span>
            </Select.Item>
          {/each}
          {#if cuisineOptions.noneCount > 0}
            <Select.Separator />
            <Select.Item value="none">
              <span class="flex w-full justify-between gap-4">
                <span class="italic text-muted-foreground">None specified</span>
                <span class="text-muted-foreground text-xs">({cuisineOptions.noneCount})</span>
              </span>
            </Select.Item>
          {/if}
        </Select.Content>
      </Select.Root>
    </div>
  {/if}

  <!-- Tags -->

  <!-- Clear all -->

  <button
    type="button"
    onclick={clearAll}
    disabled={filterCount === 0}
    class="text-xs text-muted-foreground hover:text-foreground transition-colors text-left mt-2 disabled:opacity-20"
  >
    {#if filterCount === 0}
      <Funnel size={16} /> No filters selected...
    {:else}
      <FunnelX size={16} /> Clear all filters
    {/if}
  </button>
</div>
