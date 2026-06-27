<script lang="ts">
  import {
    Dot,
    Salad,
    Timer,
    User,
  } from "@lucide/svelte";

  import { quantify } from "$lib";
  import type { RecipeCardData } from "$lib/types";
  import MealTypeBadge from "../MealTypeBadge.svelte";
  import { Badge } from "../ui/badge";

  import { resolve } from "$app/paths";

  const { recipe }: { recipe: RecipeCardData } = $props();
</script>

<a href={resolve(`/recipe/${recipe.id}`)} class="flex border-2 p-4 rounded-md">
  <article class="flex flex-col gap-y-2 w-full">
    <span class="font-serif text-2xl whitespace-nowrap overflow-hidden text-ellipsis">{recipe.title}</span>
    <div class="flex flex-row flex-wrap gap-2">
      <MealTypeBadge mealType={recipe.mealType} />
      {#each recipe.tags as tag (tag.id)}
        <Badge variant="outline">
          {tag.name}
        </Badge>
      {/each}
    </div>
    <span class="font-sans flex flex-row">
      <Timer class="mr-2" />
      {recipe.prepTimeMinutes} min prep <Dot />
      {recipe.cookTimeMinutes} min cook
    </span>
    <span class="flex flex-row">
      <User class="mr-2" />
      {#if recipe.servings}
        {quantify("serving", recipe.servings)}
      {:else}
        Unknown
      {/if}
    </span>
    <span class="flex flex-row">
      <Salad class="mr-2" />
      {quantify("ingredient", recipe.ingredientCount)}
    </span>
    <span class="whitespace-nowrap overflow-hidden text-ellipsis">{recipe.description}</span>
  </article>
</a>
