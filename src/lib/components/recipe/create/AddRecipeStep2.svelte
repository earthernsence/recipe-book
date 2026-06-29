<script lang="ts">
  import { Plus, Trash2 } from "@lucide/svelte";

  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import type { DraftIngredient, DraftStep } from "$lib/types";
  import { UNITS } from "$lib/utils/utils_recipes";
  import { getMealTypeStyles } from "$lib/utils/utils_styles";
  import StepNumber from "../StepNumber.svelte";

  // oxlint-disable prefer-const
  let {
    ingredients = $bindable(),
    steps = $bindable(),
    mealType = null
  }: {
    ingredients: Array<DraftIngredient>;
    steps: Array<DraftStep>;
    mealType?: string | null;
  } = $props();
  // oxlint-enable prefer-const

  function addIngredient() {
    ingredients.push({ tempId: crypto.randomUUID(), name: "", amount: 1, unit: null });
  }

  function removeIngredient(tempId: string) {
    const index = ingredients.findIndex(i => i.tempId === tempId);
    if (index !== -1) ingredients.splice(index, 1);
  }

  function addStep() {
    steps.push({ tempId: crypto.randomUUID(), content: "" });
  }

  function removeStep(tempId: string) {
    const index = steps.findIndex(s => s.tempId === tempId);
    if (index !== -1) steps.splice(index, 1);
  }
</script>

<div class="flex flex-col gap-6">
  <div class="flex flex-col gap-3">
    <h3 class="font-serif text-lg">Ingredients</h3>
    {#each ingredients as ingredient (ingredient.tempId)}
      <div class="flex flex-row gap-2 items-center">
        <Input type="number" min="0" step="any" bind:value={ingredient.amount} class="w-20 shrink-0" placeholder="1" />
        <select
          bind:value={ingredient.unit}
          class="h-9 rounded-md border border-input bg-card px-2 text-sm w-24 shrink-0"
        >
          <option value={null}>—</option>
          {#each UNITS as unit (unit)}
            <option value={unit}>{unit}</option>
          {/each}
        </select>
        <Input bind:value={ingredient.name} placeholder="Ingredient name" class="flex-1" />
        <Button
          variant="ghost"
          size="icon"
          onclick={() => removeIngredient(ingredient.tempId)}
          class="text-muted-foreground hover:text-destructive shrink-0"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    {/each}
    <Button variant="outline" onclick={addIngredient} class="w-fit gap-2">
      <Plus size={16} /> Add ingredient...
    </Button>
  </div>

  <hr class="border-border" />

  <div class="flex flex-col gap-3">
    <h3 class="font-serif text-lg">Steps</h3>
    {#each steps as step, i (step.tempId)}
      <div class="flex flex-row gap-2 items-start">
        <StepNumber number={i + 1} size="sm" bgClass={getMealTypeStyles(mealType)} />
        <Textarea bind:value={step.content} placeholder="Describe this step..." class="flex-1 resize-none" rows={2} />
        <Button
          variant="ghost"
          size="icon"
          onclick={() => removeStep(step.tempId)}
          class="text-muted-foreground hover:text-destructive shrink-0"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    {/each}
    <Button variant="outline" onclick={addStep} class="w-fit gap-2">
      <Plus size={16} /> Add step...
    </Button>
  </div>
</div>
