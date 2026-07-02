<script lang="ts">
  import Fuse from "fuse.js";
  import { SvelteMap } from "svelte/reactivity";

  import FilterSheet from "$lib/components/filters/FilterSheet.svelte";
  import FilterSidebar from "$lib/components/filters/FilterSidebar.svelte";
  import RecipeCard from "$lib/components/recipe/RecipeCard.svelte";
  import { RecipeFilter } from "$lib/utils/utils_filtering";
  import { quantify } from "$lib/utils/utils_formatting";
  import type { PageProps } from "./$types";

  import { page } from "$app/state";

  const { data }: PageProps = $props();

  // svelte-ignore state_referenced_locally
  const fuse = new Fuse(data.recipes, {
    keys: ["title", "description", "cuisineType", "mealType"],
    threshold: 0.35
  });

  const filters = $derived(RecipeFilter.parseFilters(page.url.searchParams));

  const cuisineOptions = $derived.by(() => {
    const counts = new SvelteMap<string, number>();
    let noneCount = 0;

    for (const recipe of data.recipes) {
      if (!recipe.cuisineType?.trim()) {
        noneCount++;
      } else {
        const key = recipe.cuisineType.trim();
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }

    return {
      cuisines: [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0])),
      noneCount
    };
  });

  const filteredRecipes = $derived.by(() => {
    let results = filters.search.trim() ? fuse.search(filters.search).map(r => r.item) : [...data.recipes];

    if (filters.tagIds.size > 0) results = results.filter(r => r.tags.some(t => filters.tagIds.has(t.id)));
    if (filters.mealTypes.size > 0) results = results.filter(r => filters.mealTypes.has(r.mealType));
    if (filters.difficulty) results = results.filter(r => r.difficulty === filters.difficulty);
    if (filters.cuisine === "none") results = results.filter(r => !r.cuisineType?.trim());
    else if (filters.cuisine)
      results = results.filter(r => r.cuisineType?.trim().toLowerCase() === filters.cuisine.toLowerCase());
    if (filters.favourites) results = results.filter(r => r.favourite);

    // Recipes already come in sorted from the DB in alphabetic-ascending order,
    // this is just for the other sorts if necessary
    switch (filters.sort) {
      case "alpha-desc":
        results.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "newest":
        results.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
        break;
      case "oldest":
        results.sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
        break;
    }

    return results;
  });
</script>

<div class="mx-auto max-w-7xl px-6 pt-24 pb-16">
  <!-- Search & mobile filter trigger -->
  <div class="flex flex-row gap-3 mb-6 items-center">
    <input
      type="text"
      placeholder="Search recipes..."
      value={filters.search}
      oninput={e => RecipeFilter.setFilters({ ...filters, search: (e.target as HTMLInputElement).value })}
      class="flex-1 border rounded-xl py-2 px-4 bg-background min-h-11"
    />
    <FilterSheet
      {filters}
      allTags={data.allTags}
      {cuisineOptions}
      authenticated={!!data.session}
      onchange={RecipeFilter.setFilters}
    />
  </div>

  <!-- Results count -->
  {#if filteredRecipes.length === 0}
    <span class="text-muted-foreground">No recipes found...</span>
  {:else if filteredRecipes.length !== data.recipes.length}
    <span class="text-muted-foreground text-sm mb-4 block">
      {quantify("recipe", filteredRecipes.length)} found
    </span>
  {/if}

  <!-- Two-column layout on desktop -->
  <div class="flex flex-row gap-8 items-start">
    <FilterSidebar
      {filters}
      allTags={data.allTags}
      {cuisineOptions}
      authenticated={!!data.session}
      onchange={RecipeFilter.setFilters}
    />

    <div class="flex-1 min-w-0">
      <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {#each filteredRecipes as recipe (recipe.id)}
          <RecipeCard {recipe} session={data.session} />
        {/each}
      </div>
    </div>
  </div>
</div>
