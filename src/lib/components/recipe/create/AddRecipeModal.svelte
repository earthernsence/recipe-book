<script lang="ts">
  import { SvelteSet } from "svelte/reactivity";

  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import type { Tag } from "$lib/server/db/schema";
  import type { DraftIngredient, DraftStep, MealType } from "$lib/types";
  import AddRecipeStep1 from "./AddRecipeStep1.svelte";
  import AddRecipeStep2 from "./AddRecipeStep2.svelte";
  import AddRecipeStep3 from "./AddRecipeStep3.svelte";

  import { goto, invalidateAll } from "$app/navigation";
  import { resolve } from "$app/paths";

  const STEP_TITLES = ["Basic info", "Ingredients & steps", "Tags & notes"];

  // oxlint-disable prefer-const
  let {
    open = $bindable(false),
    allTags
  }: {
    open: boolean;
    allTags: Array<Tag>;
  } = $props();

  let currentStep = $state(1);
  let title = $state<string>("");
  let description = $state<string>("");
  let source = $state<string>("");
  let cuisineType = $state<string>("");
  let mealType = $state<MealType>("dinner");
  let prepTimeMinutes = $state<number | null>(null);
  let cookTimeMinutes = $state<number | null>(null);
  let servings = $state<number | null>(null);
  let ingredients = $state<Array<DraftIngredient>>([]);
  let steps = $state<Array<DraftStep>>([]);
  // SvelteSets are already reactive
  // svelte-ignore non_reactive_update
  let selectedTagIds = new SvelteSet<number>();
  let notes = $state<string>("");
  let submitting = $state(false);
  let submitError = $state<string | null>(null);
  // oxlint-enable prefer-const

  function reset() {
    currentStep = 1;
    title = "";
    description = "";
    source = "";
    cuisineType = "";
    mealType = "dinner";
    prepTimeMinutes = null;
    cookTimeMinutes = null;
    servings = null;
    ingredients = [];
    steps = [];
    selectedTagIds = new SvelteSet<number>();
    notes = "";
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

  function next(): void {
    if (currentStep < STEP_TITLES.length && canProceed()) currentStep++;
  }

  function prev(): void {
    if (currentStep > 1) currentStep--;
  }

  async function submit() {
    if (!canProceed()) return;

    submitting = true;
    submitError = null;

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
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
        throw new Error(err.message ?? "Failed to create recipe. I think you spilled your coffee.");
      }

      const { id } = await res.json();
      open = false;
      await invalidateAll();
      goto(resolve(`/recipe/${id}`));
    } catch (e) {
      submitError = e instanceof Error ? e.message : "Something went wrong.";
    } finally {
      submitting = false;
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="max-w-2xl md:max-w-3xl max-h-[85vh] flex flex-col overflow-hidden mx-auto">
    <Dialog.Header>
      <Dialog.Title class="font-serif text-2xl">Add recipe...</Dialog.Title>
      <div class="flex flex-row items-center gap-1 mt-2">
        {#each STEP_TITLES as stepTitle, i (stepTitle)}
          <span
            class="flex items-center justify-center size-6 rounded-full text-xs font-semibold {currentStep >= i + 1
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
      <span class="text-sm text-destructive">{submitError}</span>
    {/if}

    <Dialog.Footer class="flex flex-row justify-between items-center pt-2">
      <Button variant="ghost" onclick={prev} disabled={currentStep === 1 || submitting}>Back</Button>
      <div class="flex flex-row gap-2">
        <Button variant="ghost" onclick={() => (open = false)} disabled={submitting}>Cancel</Button>
        {#if currentStep < 3}
          <Button onclick={next} disabled={!canProceed()}>Next</Button>
        {:else}
          <Button onclick={submit} disabled={submitting}>
            {submitting ? "Saving..." : "Save recipe"}
          </Button>
        {/if}
      </div>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
