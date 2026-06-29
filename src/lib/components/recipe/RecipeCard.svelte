<script lang="ts">
  import type { Session } from "@auth/sveltekit";
  import { Dot, Salad, Timer, User } from "@lucide/svelte";

  import { quantify } from "$lib";
  import type { RecipeCardData } from "$lib/types";
  import TagList from "../TagList.svelte";
  import FavouriteButton from "./FavouriteButton.svelte";

  import { resolve } from "$app/paths";

  const { recipe, session }: { recipe: RecipeCardData; session: Session | null } = $props();
</script>

<a href={resolve(`/recipe/${recipe.id}`)} class="flex border-2 p-4 rounded-md">
  <article class="flex flex-col gap-y-2 w-full">
    <div class="flex items-center justify-between gap-2">
      <span class="font-serif text-2xl whitespace-nowrap overflow-hidden text-ellipsis">{recipe.title}</span>
      {#if session}
        <FavouriteButton recipeId={recipe.id} favourite={!!recipe.favourite} size="sm" />
      {/if}
    </div>
    <TagList tags={recipe.tags} mealType={recipe.mealType} />
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
