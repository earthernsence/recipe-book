<script lang="ts">
  import Fuse from "fuse.js";

  import RecipeCard from "$lib/components/recipe/RecipeCard.svelte";
  import { Badge } from "$lib/components/ui/badge";
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

    return results;
  });
  // oxlint-enable prefer-const

  function updateParams(search: string, tags: Set<number>) {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (tags.size > 0) params.set("tags", [...tags].join(","));
    goto(resolve(`/?${params.toString()}`), { replaceState: true, keepFocus: true });
  }

  function toggleTag(id: number) {
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    const next = new Set(selectedTagIds);
    next.has(id) ? next.delete(id) : next.add(id);
    updateParams(searchString, next);
  }

  function onSearchInput(e: Event) {
    updateParams((e.target as HTMLInputElement).value, selectedTagIds);
  }
</script>

<div class="flex flex-col h-screen mb-auto pt-24 px-6 mx-auto max-w-6xl">
  <div class="flex flex-col md:flex-row gap-8 mb-4 items-center justify-between">
    <input type="text" placeholder="Search recipes..." oninput={onSearchInput} class="border-2 rounded-2xl py-2 px-4" />
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
  <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
    {#each filteredRecipes as recipe (recipe.id)}
      <RecipeCard {recipe} />
    {/each}
  </div>
  {#if filteredRecipes.length === 0}
    <span class="text-muted-foreground">No recipes found...</span>
  {/if}
  <br />
</div>
