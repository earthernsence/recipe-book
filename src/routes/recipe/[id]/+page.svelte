<script lang="ts">
  import { marked } from "marked";

  import RecipeActions from "$lib/components/recipe/RecipeActions.svelte";
  import RecipeIngredients from "$lib/components/recipe/RecipeIngredients.svelte";
  import RecipeSteps from "$lib/components/recipe/RecipeSteps.svelte";
  import ReturnToHomeButton from "$lib/components/ReturnToHomeButton.svelte";
  import TagList from "$lib/components/TagList.svelte";
  import type { PageProps } from "./$types";
  import { Button } from "$lib/components/ui/button";
  import { ChefHat } from "@lucide/svelte";
  import { quantify } from "$lib";

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

  let multiplier = $state(1);

  const scaledServings = $derived(recipe.servings ? Math.round(recipe.servings * multiplier) : null);

  const stripeColour = $derived(MEAL_TYPE_COLOURS[recipe.mealType] ?? MEAL_TYPE_COLOURS.other);
</script>

<div class="mx-auto max-w-5xl px-6 pt-24 pb-16">
  <ReturnToHomeButton />

  <h1 class="font-serif text-4xl mb-2">{recipe.title}</h1>

  {#if recipe.description}
    <span class="text-muted-foreground mb-4">{recipe.description}</span>
    <br />
  {/if}

  {#if data.session}
    <RecipeActions {recipe} allTags={data.allTags} />
  {/if}

  <a href="/recipe/{recipe.id}/cook">
    <Button class="gap-2 mt-2" size="lg">
      <ChefHat size={16} />
      Make this dish!
    </Button>
  </a>

  <TagList tags={recipe.tags} mealType={recipe.mealType} class="mb-8 mt-2" />

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
              <span class="font-medium">{quantify("person", scaledServings)}</span>
            </div>
          {/if}
        </div>

        <hr class="border-border" />

        <RecipeIngredients ingredients={recipe.ingredients} bind:multiplier />
      </div>
    </aside>

    <!-- Steps pane -->

    <section class="flex flex-col gap-8">
      <RecipeSteps steps={recipe.steps} />

      {#if recipe.notes}
        <div class="border-t pt-6">
          <h2 class="font-serif text-xl mb-4">Notes</h2>
          <div class="prose prose-sm text-muted-foreground">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html marked(recipe.notes)}
          </div>
        </div>
      {/if}
    </section>
  </div>
</div>
