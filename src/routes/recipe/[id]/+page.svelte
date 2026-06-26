<script lang="ts">
  import { ArrowLeft } from "@lucide/svelte";

  import RecipeIngredients from "$lib/components/recipe/RecipeIngredients.svelte";
  import RecipeSteps from "$lib/components/recipe/RecipeSteps.svelte";
  import { Badge } from "$lib/components/ui/badge";
  import type { PageProps } from "./$types";

  import { resolve } from "$app/paths";

  const MEAL_TYPE_COLOURS: Record<string, string> = {
    breakfast: "bg-accent",
    lunch: "bg-lunch",
    dinner: "bg-primary",
    dessert: "bg-dessert",
    snack: "bg-snack",
    other: "bg-muted"
  };

  const { data }: PageProps = $props();
  const { recipe } = $derived(data);

  const stripeColour = $derived(MEAL_TYPE_COLOURS[recipe.mealType] ?? MEAL_TYPE_COLOURS.other);
</script>

<div class="mx-auto max-w-5xl px-6 pt-24 pb-16">
  <a
    href={resolve("/")}
    class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
  >
    <ArrowLeft size={16} />
    Back to recipes...
  </a>

  <h1 class="font-serif text-4xl mb-2">{recipe.title}</h1>

  {#if recipe.description}
    <span class="text-muted-foreground mb-4">{recipe.description}</span>
  {/if}

  <div class="flex flex-row flex-wrap gap-2 mb-8">
    <Badge>{recipe.mealType}</Badge>
    {#each recipe.tags as tag (tag.id)}
      <Badge variant="outline">{tag.name}</Badge>
    {/each}
  </div>

  <div class="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-start">
    <!-- Index card panel -->
    <aside class="rounded-lg border shadow-sm bg-card overflow-hidden md:sticky top-24">
      <div class="h-2 w-full {stripeColour}"></div>
      <div class="p-6 flex flex-col gap-6">
        <div class="flex flex-col gap-2 text-sm">
          {#if recipe.prepTimeMinutes}
            <div class="flex justify-between">
              <span class="text-muted-foreground">Prep</span>
              <span class="font-medium">{recipe.prepTimeMinutes} min</span>
            </div>
          {/if}
          {#if recipe.cookTimeMinutes}
            <div class="flex justify-between">
              <span class="text-muted-foreground">Cook</span>
              <span class="font-medium">{recipe.cookTimeMinutes} min</span>
            </div>
          {/if}
          {#if recipe.servings}
            <div class="flex justify-between">
              <span class="text-muted-foreground">Servings</span>
              <span class="font-medium">{recipe.servings} people</span>
            </div>
          {/if}
        </div>

        <hr class="border-border" />

        <RecipeIngredients ingredients={recipe.ingredients} />
      </div>
    </aside>

    <!-- Steps pane -->

    <section class="flex flex-col gap-8">
      <RecipeSteps steps={recipe.steps} />

      {#if recipe.notes}
        <div class="border-t pt-6">
          <h2 class="font-serif text-xl mb-3">Notes</h2>
          <span class="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
            {recipe.notes}
          </span>
        </div>
      {/if}
    </section>
  </div>
</div>
