<script lang="ts">
  import { SvelteSet } from "svelte/reactivity";

  import AddRecipeStep1 from "$lib/components/recipe/create/AddRecipeStep1.svelte";
  import AddRecipeStep2 from "$lib/components/recipe/create/AddRecipeStep2.svelte";
  import AddRecipeStep3 from "$lib/components/recipe/create/AddRecipeStep3.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import type { Tag } from "$lib/server/db/schema";
  import type { DraftIngredient, DraftStep, MealType, RecipeDetailData } from "$lib/types";

  import { invalidateAll } from "$app/navigation";

  const STEP_TITLES = ["Basic info", "Ingredients & steps", "Tags & notes"];

  // oxlint-disable prefer-const
  let {
    open = $bindable(false),
    recipe,
    allTags
  }: {
    open: boolean;
    recipe: RecipeDetailData;
    allTags: Array<Tag>;
  } = $props();

  // Initialise from existing recipe
  let title = $state(recipe.title);
  let description = $state(recipe.description ?? "");
  let source = $state(recipe.source ?? "");
  let cuisineType = $state(recipe.cuisineType ?? "");
  let mealType = $state<MealType>(recipe.mealType as MealType);
  let prepTimeMinutes = $state<number | null>(recipe.prepTimeMinutes);
  let cookTimeMinutes = $state<number | null>(recipe.cookTimeMinutes);
  let servings = $state<number | null>(recipe.servings);
  let notes = $state(recipe.notes ?? "");
  let ingredients = $state<Array<DraftIngredient>>(
    recipe.ingredients.map(i => ({
      tempId: crypto.randomUUID(),
      name: i.name,
      amount: i.amount,
      unit: i.unit ?? null
    }))
  );
  let steps = $state<Array<DraftStep>>(
    recipe.steps.map(s => ({
      tempId: crypto.randomUUID(),
      content: s.content
    }))
  );
  let selectedTagIds = new SvelteSet<number>(recipe.tags.map(t => t.id));

  let currentStep = $state(1);
  let submitting = $state(false);
  let submitError = $state<string | null>(null);

  // oxlint-enable prefer-const

  function reset() {
    currentStep = 1;
    title = recipe.title;
    description = recipe.description ?? "";
    source = recipe.source ?? "";
    cuisineType = recipe.cuisineType ?? "";
    mealType = recipe.mealType as MealType;
    prepTimeMinutes = recipe.prepTimeMinutes;
    cookTimeMinutes = recipe.cookTimeMinutes;
    servings = recipe.servings;
    notes = recipe.notes ?? "";
    ingredients = recipe.ingredients.map(i => ({
      tempId: crypto.randomUUID(),
      name: i.name,
      amount: i.amount,
      unit: i.unit ?? null
    }));
    steps = recipe.steps.map(s => ({
      tempId: crypto.randomUUID(),
      content: s.content
    }));
    selectedTagIds = new SvelteSet(recipe.tags.map(t => t.id));
    submitting = false;
    submitError = null;
  }

  $effect(() => {
    if (!open) reset();
  });

  function canProceed(): boolean {
    if (currentStep === 1) return title.trim().length > 0;
    if (currentStep === 2) return ingredients.length > 0 && steps.length > 0;
    return true;
  }

  function next() {
    if (currentStep < 3 && canProceed()) currentStep++;
  }

  function prev() {
    if (currentStep > 1) currentStep--;
  }

  async function submit() {
    if (!canProceed()) return;
    submitting = true;
    submitError = null;

    try {
      const res = await fetch(`/api/recipes/${recipe.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          source,
          cuisineType,
          mealType,
          prepTimeMinutes,
          cookTimeMinutes,
          servings,
          ingredients: ingredients.map(({ name, amount, unit }) => ({ name, amount, unit })),
          steps: steps.map(({ content }) => ({ content })),
          tagIds: Array.from(selectedTagIds),
          notes
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to update recipe");
      }

      open = false;
      await invalidateAll();
    } catch (e) {
      submitError = e instanceof Error ? e.message : "Something went wrong";
    } finally {
      submitting = false;
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="max-w-2xl md:max-w-3xl max-h-[85vh] flex flex-col overflow-hidden mx-auto">
    <Dialog.Header>
      <Dialog.Title class="font-serif text-2xl">Edit recipe</Dialog.Title>
      <div class="flex flex-row items-center gap-1 mt-2">
        {#each STEP_TITLES as stepTitle, i (stepTitle)}
          <span
            class="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold {currentStep >= i + 1
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'}"
          >
            {i + 1}
          </span>
          <span class="text-sm {currentStep === i + 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}">
            {stepTitle}
          </span>
          {#if i < STEP_TITLES.length - 1}
            <span class="text-muted-foreground mx-1">›</span>
          {/if}
        {/each}
      </div>
    </Dialog.Header>

    <div class="overflow-y-auto flex-1 py-4 pr-1">
      {#if currentStep === 1}
        <AddRecipeStep1
          bind:title
          bind:description
          bind:source
          bind:cuisineType
          bind:mealType
          bind:prepTimeMinutes
          bind:cookTimeMinutes
          bind:servings
        />
      {:else if currentStep === 2}
        <AddRecipeStep2 bind:ingredients bind:steps mealType={mealType} />
      {:else}
        <AddRecipeStep3 {allTags} bind:selectedTagIds bind:notes />
      {/if}
    </div>

    {#if submitError}
      <p class="text-sm text-destructive">{submitError}</p>
    {/if}

    <Dialog.Footer class="flex flex-row justify-between items-center pt-2">
      <Button variant="ghost" onclick={prev} disabled={currentStep === 1 || submitting}>Back</Button>
      <div class="flex flex-row gap-2">
        <Button variant="ghost" onclick={() => (open = false)} disabled={submitting}>Cancel</Button>
        {#if currentStep < 3}
          <Button onclick={next} disabled={!canProceed()}>Next</Button>
        {:else}
          <Button onclick={submit} disabled={submitting}>
            {submitting ? "Saving..." : "Save changes"}
          </Button>
        {/if}
      </div>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
