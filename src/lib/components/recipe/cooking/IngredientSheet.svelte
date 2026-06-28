<script lang="ts">
  import { Check } from "@lucide/svelte";

  import * as Sheet from "$lib/components/ui/sheet";
  import type { Ingredient } from "$lib/server/db/schema";
  import { formatAmount } from "$lib/utils/utils_formatting";

  let {
    open = $bindable(false),
    ingredients,
    completed = $bindable<Array<boolean>>([])
  }: {
    open: boolean;
    ingredients: Array<Ingredient>;
    completed: Array<boolean>;
  } = $props();
</script>

<Sheet.Root bind:open>
  <Sheet.Content side="bottom" class="max-h-[75vh] flex flex-col rounded-t-2xl z-999">
    <Sheet.Header class="shrink-0 pb-2">
      <Sheet.Title class="font-serif text-xl">Ingredients</Sheet.Title>
      <span class="text-sm text-muted-foreground">
        {completed.filter(Boolean).length} of {ingredients.length} checked
      </span>
    </Sheet.Header>

    <ul class="flex-1 overflow-y-auto divide-y divide-border pr-1">
      {#each ingredients as ingredient, i (ingredient.id)}
        <li>
          <button
            class="flex items-center gap-4 w-full py-4 text-left min-h-14 mx-10"
            onclick={() => (completed[i] = !completed[i])}
          >
            <div
              class="size-6 rounded border-2 flex items-center justify-center shrink-0 transition-colors {completed[i]
                ? 'bg-primary border-primary'
                : 'border-border'}"
            >
              {#if completed[i]}
                <span class="text-primary-foreground text-xs font-bold leading-none"><Check /></span>
              {/if}
            </div>
            <span class="text-sm font-medium w-20 text-right shrink-0 text-muted-foreground">
              {formatAmount(ingredient.amount)}{ingredient.unit ? ` ${ingredient.unit}` : ""}
            </span>
            <span
              class="text-base transition-colors {completed[i]
                ? 'line-through text-muted-foreground'
                : 'text-foreground'}"
            >
              {ingredient.name}
            </span>
          </button>
        </li>
      {/each}
    </ul>
  </Sheet.Content>
</Sheet.Root>
