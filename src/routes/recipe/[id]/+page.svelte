<script lang="ts">
  import { ChefHat, Dot, Printer, Share, SquareCheckBig } from "@lucide/svelte";
  import { marked } from "marked";

  import { quantify } from "$lib";
  import FavouriteButton from "$lib/components/recipe/FavouriteButton.svelte";
  import RecipeActions from "$lib/components/recipe/RecipeActions.svelte";
  import RecipeIngredients from "$lib/components/recipe/RecipeIngredients.svelte";
  import RecipeSteps from "$lib/components/recipe/RecipeSteps.svelte";
  import ReturnToHomeButton from "$lib/components/ReturnToHomeButton.svelte";
  import TagList from "$lib/components/TagList.svelte";
  import { Button } from "$lib/components/ui/button";
  import { getMealTypeBackground } from "$lib/utils/utils_styles";
  import type { PageProps } from "./$types";

  import { resolve } from "$app/paths";

  // checklistMode is reassigned through a function passed into a <button>
  // oxlint-disable-next-line prefer-const
  let checklistMode = $state(false);
  let completedIngredients = $state<Array<boolean>>([]);
  let completedSteps = $state<Array<boolean>>([]);
  const { data }: PageProps = $props();
  const { recipe } = $derived(data);

  // multiplier is reassigned through a function passed into <RecipeIngredients>
  // oxlint-disable-next-line prefer-const
  let multiplier = $state(1);

  const scaledServings = $derived(recipe.servings ? Math.round(recipe.servings * multiplier) : null);

  const stripeColour = $derived(getMealTypeBackground(recipe.mealType));

  $effect(() => {
    if (checklistMode) {
      completedIngredients = recipe.ingredients.map(() => false);
      completedSteps = recipe.steps.map(() => false);
    }
  });

  const ingredientProgress = $derived(completedIngredients.filter(Boolean).length);
  const stepsProgress = $derived(completedSteps.filter(Boolean).length);

  function share() {
    navigator.share({ title: recipe.title, url: window.location.href });
  }
</script>

<div class="hidden print:block border-b pb-4">
  <h1 class="font-serif text-3xl">{recipe.title}</h1>
  {#if recipe.source}
    <span class="text-sm text-muted-foreground mt-1">Source: {recipe.source}</span>
  {/if}
</div>

<div class="mx-auto max-w-5xl px-6 pt-24 pb-16 print:pt-6 print:px-4">
  <ReturnToHomeButton />

  <h1 class="font-serif text-4xl mb-2 print:hidden">{recipe.title}</h1>

  {#if recipe.description}
    <span class="text-muted-foreground">{recipe.description}</span>
    <br />
  {/if}

  {#if data.session}
    <div class="flex items-center gap-1 shrink-0 pt-1 print:hidden">
      <FavouriteButton recipeId={recipe.id} favourite={!!recipe.favourite} />
      <RecipeActions {recipe} allTags={data.allTags} />
    </div>
  {/if}

  <div class="flex flex-col md:flex-row gap-2 md:items-center my-2 print:hidden">
    <a href={resolve(`/recipe/${recipe.id}/cook`)}>
      <Button class="gap-2" size="lg">
        <ChefHat size={16} />
        Make this dish!
      </Button>
    </a>
    <button
      onclick={() => (checklistMode = !checklistMode)}
      class="flex items-center gap-2 text-sm px-3 py-2 rounded-md border transition-colors {checklistMode
        ? 'bg-primary/10 border-primary text-primary'
        : 'border-border text-muted-foreground hover:text-foreground'}"
    >
      <SquareCheckBig size={16} />
      {checklistMode ? "Disable checklists" : "Enable checklists"}
      {#if checklistMode && (ingredientProgress > 0 || stepsProgress > 0)}
        <span class="text-muted-foreground flex flex-row items-center">
          <Dot size={16} />
          {ingredientProgress} / {recipe.ingredients.length} ingredients,
          {stepsProgress} / {recipe.steps.length} steps
        </span>
      {/if}
    </button>
  </div>

  <TagList tags={recipe.tags} mealType={recipe.mealType} difficulty={recipe.difficulty} class="mb-8 mt-2" />

  <div class="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-start">
    <!-- Index card panel -->
    <aside class="rounded-lg border shadow-sm bg-card overflow-hidden md:sticky top-24 print:static print:top-0">
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
          {#if recipe.source}
            <div class="flex justify-between">
              <span class="text-muted-foreground">Source</span>
              <span class="font-medium text-right max-w-[60%] wrap-break-word">{recipe.source}</span>
            </div>
          {/if}
        </div>

        <hr class="border-border" />

        <RecipeIngredients
          ingredients={recipe.ingredients}
          bind:multiplier
          {checklistMode}
          bind:completed={completedIngredients}
          mealType={recipe.mealType}
        />
      </div>
    </aside>

    <!-- Steps pane -->

    <section class="flex flex-col gap-8">
      <RecipeSteps steps={recipe.steps} {checklistMode} bind:completed={completedSteps} mealType={recipe.mealType} />

      {#if recipe.notes}
        <div class="border-t pt-6">
          <h2 class="font-serif text-xl mb-4">Notes</h2>
          <div class="prose prose-sm text-muted-foreground">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html marked(recipe.notes)}
          </div>
        </div>
      {/if}

      <div class="border-t pt-6 print:hidden flex flex-col gap-y-4">
        <button
          onclick={() => window.print()}
          class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Printer size={16} />
          Print or save as PDF...
        </button>
        {#if typeof navigator !== "undefined" && "share" in navigator}
          <button
            onclick={share}
            class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Share size={16} />
            Share recipe...
          </button>
        {/if}
      </div>
    </section>
  </div>
</div>
