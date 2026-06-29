<script lang="ts">
  import type { Ingredient } from "$lib/server/db/schema";
  import { formatAmount } from "$lib/utils/utils_formatting";

  const MULTIPLIERS: Array<{ label: string; value: number }> = [
    { label: "¼×", value: 0.25 },
    { label: "½×", value: 0.5 },
    { label: "1×", value: 1 },
    { label: "2×", value: 2 },
    { label: "3×", value: 3 }
  ];

  // oxlint-disable-next-line prefer-const
  let {
    ingredients,
    multiplier = $bindable(1),
    checklistMode = false,
    completed = $bindable<Array<boolean>>([])
  }: {
    ingredients: Array<Ingredient>;
    multiplier: number;
    checklistMode?: boolean;
    completed?: Array<boolean>;
  } = $props();

  const scaled = $derived(
    ingredients.map(i => ({
      ...i,
      amount: formatAmount(i.amount * multiplier)
    }))
  );
</script>

<div class="flex flex-col gap-4">
  <div class="flex flex-row gap-2">
    {#each MULTIPLIERS as m (m.value)}
      <button
        class="px-3 py-1 rounded-md text-sm border transition-colors {multiplier === m.value
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-card text-foreground border-border hover:bg-muted'}"
        onclick={() => (multiplier = m.value)}
      >
        {m.label}
      </button>
    {/each}
  </div>
  <ul class="flex flex-col gap-1">
    {#each scaled as ingredient, i (ingredient.id)}
      <li>
        {#if checklistMode}
          <button
            class="flex flex-row gap-3 items-center w-full text-left py-2 min-h-11 transition-colors"
            onclick={() => (completed[i] = !completed[i])}
          >
            <div
              class="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors {completed[i]
                ? 'bg-primary border-primary'
                : 'border-border'}"
            >
              {#if completed[i]}
                <span class="text-primary-foreground text-xs font-bold leading-none">✓</span>
              {/if}
            </div>
            <span
              class="text-sm font-semibold w-16 shrink-0 text-right transition-colors {completed[i]
                ? 'text-muted-foreground'
                : ''}"
            >
              {ingredient.amount}{ingredient.unit ? ` ${ingredient.unit}` : ""}
            </span>
            <span class="text-sm transition-colors {completed[i] ? 'line-through text-muted-foreground' : ''}">
              {ingredient.name}
            </span>
          </button>
        {:else}
          <div class="flex flex-row gap-2 text-sm py-1">
            <span class="font-semibold w-16 shrink-0 text-right">
              {ingredient.amount}{ingredient.unit ? ` ${ingredient.unit}` : ""}
            </span>
            <span>{ingredient.name}</span>
          </div>
        {/if}
      </li>
    {/each}
  </ul>
</div>
