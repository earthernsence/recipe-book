<script lang="ts">
  import { Star } from "@lucide/svelte";
  import Fuse from "fuse.js";
  import { SvelteMap } from "svelte/reactivity";

  import RecipeCard from "$lib/components/recipe/RecipeCard.svelte";
  import { Badge } from "$lib/components/ui/badge";
  import * as Select from "$lib/components/ui/select";
  import { quantify } from "$lib/utils/utils_formatting";
  import type { PageProps } from "./$types";

  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";

  const { data }: PageProps = $props();

  // svelte-ignore state_referenced_locally
  const fuse = new Fuse(data.recipes, {
    keys: ["title", "description", "cuisineType", "mealType"],
    threshold: 0.35
  });

  // oxlint-disable prefer-const
  let searchString = $derived<string>(page.url.searchParams.get("search") ?? "");
  let selectedTagIds = $derived(
    new Set<number>(page.url.searchParams.get("tags")?.split(",").map(Number).filter(Boolean) ?? [])
  );
  let filteredRecipes = $derived.by(() => {
    let results = searchString.trim() ? fuse.search(searchString).map(r => r.item) : [...data.recipes];

    if (selectedTagIds.size > 0) {
      results = results.filter(recipe => recipe.tags.some(tag => selectedTagIds.has(tag.id)));
    }

    if (cuisineFilter === "none") {
      results = results.filter(r => !r.cuisineType?.trim());
    } else if (cuisineFilter) {
      results = results.filter(r => r.cuisineType?.trim().toLowerCase() === cuisineFilter.toLowerCase());
    }

    if (favouritesOnly) results = results.filter(r => r.favourite);

    return results;
  });
  const cuisineFilter = $derived(page.url.searchParams.get("cuisine") ?? "");
  const favouritesOnly = $derived(page.url.searchParams.get("favourites") === "true");
  // oxlint-enable prefer-const

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

  function updateParams(search: string, tags: Set<number>, cuisine: string, favourites: boolean) {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (tags.size > 0) params.set("tags", [...tags].join(","));
    if (cuisine) params.set("cuisine", cuisine);
    if (favourites) params.set("favourites", "true");
    goto(resolve(`/?${params.toString()}`), { replaceState: true, keepFocus: true });
  }

  function toggleTag(id: number) {
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    const next = new Set(selectedTagIds);
    next.has(id) ? next.delete(id) : next.add(id);
    updateParams(searchString, next, cuisineFilter, favouritesOnly);
  }

  function setCuisine(value: string) {
    updateParams(searchString, selectedTagIds, value === "all" ? "" : value, favouritesOnly);
  }

  function onSearchInput(e: Event) {
    updateParams((e.target as HTMLInputElement).value, selectedTagIds, cuisineFilter, favouritesOnly);
  }
</script>

<div class="flex flex-col h-screen mb-auto pt-24 px-6 mx-auto max-w-6xl">
  <div class="flex flex-col md:flex-row gap-8 mb-4 items-center justify-between">
    <input type="text" placeholder="Search recipes..." oninput={onSearchInput} class="border-2 rounded-2xl py-2 px-4" />
    {#if cuisineOptions.cuisines.length > 0 || cuisineOptions.noneCount > 0}
      <Select.Root type="single" value={cuisineFilter || "all"} onValueChange={setCuisine}>
        <Select.Trigger class="w-full sm:w-56 min-h-11">
          {#if cuisineFilter === "none"}
            None specified...
          {:else if cuisineFilter}
            {cuisineFilter}
          {:else}
            All cuisines
          {/if}
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="all">All cuisines</Select.Item>
          <Select.Separator />
          {#each cuisineOptions.cuisines as [name, count] (name)}
            <Select.Item value={name}>
              {name}
              <span class="ml-auto text-muted-foreground text-xs">({count})</span>
            </Select.Item>
          {/each}
          {#if cuisineOptions.noneCount > 0}
            <Select.Separator />
            <Select.Item value="none">
              <span class="flex w-full justify-between gap-4">
                <span class="text-muted-foreground italic">None specified...</span>
                <span class="ml-auto text-muted-foreground text-xs">*({cuisineOptions.noneCount})</span>
              </span>
            </Select.Item>
          {/if}
        </Select.Content>
      </Select.Root>
    {/if}
    {#if data.session}
      <button
        onclick={() => updateParams(searchString, selectedTagIds, cuisineFilter, !favouritesOnly)}
        class="flex items-center gap-2 px-3 h-9 rounded-md border text-sm transition-colors {favouritesOnly
          ? 'bg-accent/20 border-accent text-foreground'
          : 'border-border text-muted-foreground hover:text-foreground'}"
      >
        <Star size={16} class={favouritesOnly ? "fill-accent stroke-accent" : "stroke-current"} />
        Favourites
      </button>
    {/if}
    <span class="text-xs">or select tags...</span>
    <div class="flex flex-row flex-wrap gap-2 justify-center">
      {#each data.allTags as tag (tag.id)}
        {@const tagEnabled = selectedTagIds.has(tag.id)}
        <button type="button" onclick={() => toggleTag(tag.id)}>
          <Badge
            variant={tagEnabled ? "default" : "outline"}
            class={tagEnabled ? "bg-primary/75 border-primary text-card" : "bg-transparent text-foreground"}
          >
            {tag.name}
          </Badge>
        </button>
      {/each}
    </div>
  </div>
  <br />
  {#if filteredRecipes.length === 0}
    <span class="text-muted-foreground">No recipes found...</span>
  {:else if filteredRecipes.length !== data.recipes.length}
    <span class="text-muted-foreground mb-2">{quantify("recipe", filteredRecipes.length)} found</span>
  {/if}
  <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
    {#each filteredRecipes as recipe (recipe.id)}
      <RecipeCard {recipe} session={data.session} />
    {/each}
  </div>
  <br />
</div>
