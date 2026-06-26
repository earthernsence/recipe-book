<script lang="ts">
  import {
    CakeSlice,
    Candy,
    CookingPot,
    Croissant,
    Dot,
    Salad,
    Sandwich,
    Timer,
    User,
    UtensilsCrossed
  } from "@lucide/svelte";

  import { quantify } from "$lib";
  import type { RecipeCardData } from "$lib/types";
  import { Badge } from "../ui/badge";

  import { resolve } from "$app/paths";

  const { recipe }: { recipe: RecipeCardData } = $props();

  const mealTypeMappings: Map<typeof recipe.mealType, { icon: typeof Dot; class: string }> = new Map([
    ["breakfast", { icon: Croissant, class: "bg-accent text-foreground" }],
    ["lunch", { icon: Sandwich, class: "bg-lunch text-card" }],
    ["dinner", { icon: CookingPot, class: "bg-primary text-card" }],
    ["dessert", { icon: CakeSlice, class: "bg-dessert text-card" }],
    ["snack", { icon: Candy, class: "bg-snack text-card" }],
    ["other", { icon: UtensilsCrossed, class: "bg-sidebar-ring text-card" }]
  ]);

  // It ain't changing brochacho
  // svelte-ignore state_referenced_locally
  const mealTypeData = mealTypeMappings.get(recipe.mealType);

  const MealTypeIcon = mealTypeData!.icon;
</script>

<a href={resolve(`/recipe/${recipe.id}`)} class="flex border-2 p-4 rounded-md">
  <article class="flex flex-col gap-y-2 w-full">
    <span class="font-serif text-2xl whitespace-nowrap overflow-hidden text-ellipsis">{recipe.title}</span>
    <div class="flex flex-row flex-wrap gap-2">
      <Badge class={mealTypeData!.class}>
        <MealTypeIcon />
        {recipe.mealType}
      </Badge>
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
