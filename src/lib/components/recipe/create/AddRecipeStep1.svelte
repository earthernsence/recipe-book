<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import type { Difficulty, MealType } from "$lib/types";
  import { getMealTypeBorder, getMealTypeStyles } from "$lib/utils/utils_styles";

  const MEAL_TYPES: Array<{ value: MealType; label: string }> = [
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "dessert", label: "Dessert" },
    { value: "snack", label: "Snack" },
    { value: "other", label: "Other" }
  ];

  const DIFFICULTIES: Array<{ value: Difficulty; label: string }> = [
    { value: "easy", label: "Easy" },
    { value: "intermediate", label: "Intermediate" },
    { value: "hard", label: "Hard" }
  ];

  // oxlint-disable prefer-const
  let {
    title = $bindable(),
    description = $bindable(),
    source = $bindable(),
    cuisineType = $bindable(),
    mealType = $bindable(),
    difficulty = $bindable(),
    prepTimeMinutes = $bindable(),
    cookTimeMinutes = $bindable(),
    servings = $bindable()
  }: {
    title: string;
    description: string;
    source: string;
    cuisineType: string;
    mealType: MealType;
    difficulty: Difficulty;
    prepTimeMinutes: number | null;
    cookTimeMinutes: number | null;
    servings: number | null;
  } = $props();
  // oxlint-enable prefer-const
</script>

<div class="flex flex-col gap-4">
  <div class="flex flex-col gap-1.5">
    <Label for="title">Title <span class="text-destructive">*</span></Label>
    <Input id="title" bind:value={title} placeholder="Royer Family's Famous Chocolate Chip Cookies" />
  </div>

  <div class="flex flex-col gap-1.5">
    <Label for="description">Description</Label>
    <Input id="description" bind:value={description} placeholder="Well, when I was a kid..." />
  </div>

  <div class="flex flex-col gap-1.5">
    <Label for="source">Source</Label>
    <Input id="source" bind:value={source} placeholder="Grandma, Betty Crocker, made it up..." />
  </div>

  <div class="flex flex-col gap-1.5">
    <Label for="cuisine">Cuisine type</Label>
    <Input id="cuisine" bind:value={cuisineType} placeholder="Italian, Mexican, etc." />
  </div>

  <div class="flex flex-col gap-2">
    <Label>Meal type <span class="text-destructive">*</span></Label>
    <div class="flex flex-wrap gap-2">
      {#each MEAL_TYPES as mt (mt.value)}
        <button
          type="button"
          onclick={() => (mealType = mt.value)}
          class="px-3 py-1.5 rounded-md text-sm border transition-colors {mealType === mt.value
            ? `${getMealTypeStyles(mt.value)} ${getMealTypeBorder(mt.value)}`
            : 'bg-card border-border hover:bg-muted'}"
        >
          {mt.label}
        </button>
      {/each}
    </div>
  </div>

  <div class="flex flex-col gap-2">
    <Label>Difficulty</Label>
    <div class="flex flex-wrap gap-2">
      {#each DIFFICULTIES as diff (diff.value)}
        <button
          type="button"
          onclick={() => (difficulty = diff.value)}
          class="px-3 py-1.5 rounded-md text-sm border transition-colors {difficulty === diff.value
            ? 'bg-primary/75 border-primary text-primary-foreground'
            : 'bg-card border-border hover:bg-muted'}"
        >
          {diff.label}
        </button>
      {/each}
    </div>
  </div>

  <div class="grid grid-cols-3 gap-4">
    <div class="flex flex-col gap-1.5">
      <Label for="prep">Prep (min)</Label>
      <Input id="prep" type="number" min="0" bind:value={prepTimeMinutes} placeholder="30" />
    </div>
    <div class="flex flex-col gap-1.5">
      <Label for="cook">Cook (min)</Label>
      <Input id="cook" type="number" min="0" bind:value={cookTimeMinutes} placeholder="45" />
    </div>
    <div class="flex flex-col gap-1.5">
      <Label for="servings">Servings</Label>
      <Input id="servings" type="number" min="1" bind:value={servings} placeholder="4" />
    </div>
  </div>
</div>
