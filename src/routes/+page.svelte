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

  let searchString = $state<string>(page.url.searchParams.get("search") ?? "");
  let selectedTags = $state(
    new Set<number>(page.url.searchParams.get("tags")?.split(",").map(Number).filter(Boolean) ?? [])
  );
  let filteredRecipes = $derived.by(() => {
    let results = searchString.trim() ? fuse.search(searchString).map(r => r.item) : [...data.recipes];

    if (selectedTags.size > 0) {
      results = results.filter(recipe => recipe.tags.some(tag => selectedTags.has(tag.id)));
    }

    return results;
  });

  $effect(() => {
    const params = new URLSearchParams();
    if (searchString.trim()) params.set("search", searchString.trim());
    if (selectedTags.size > 0) params.set("tags", [...selectedTags].join(","));
    goto(resolve(`/?${params.toString()}`), { replaceState: true, keepFocus: true });
  });

  function toggleTag(id: number) {
    if (selectedTags.has(id)) selectedTags.delete(id);
    else selectedTags.add(id);
  }
</script>

<div class="flex flex-col h-screen mb-auto pt-24 px-6 mx-auto max-w-6xl">
  <div class="flex flex-row gap-8">
    <input
      type="text"
      placeholder="Search recipes..."
      bind:value={searchString}
      class="border-2 rounded-2xl py-2 px-4"
    />
    {#each data.allTags as tag (tag.id)}
      {let tagEnabled = $state(selectedTags.has(tag.id))}
      <Badge
        onclick={() => toggleTag(tag.id)}
        class={tagEnabled ? "bg-primary/75 border-primary text-card" : "bg-transparent text-foreground"}
        variant={tagEnabled ? "default" : "outline"}
      >
        {tag.name}
      </Badge>
    {/each}
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
