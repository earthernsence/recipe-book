<script lang="ts">
  import { Check } from "@lucide/svelte";
  import { marked } from "marked";

  import type { Step } from "$lib/server/db/schema";
  import { getMealTypeStyles } from "$lib/utils/utils_styles";
  import StepNumber from "./StepNumber.svelte";

  const {
    steps,
    checklistMode = false,
    completed = $bindable<Array<boolean>>([]),
    mealType = null
  }: {
    steps: Array<Step>;
    checklistMode?: boolean;
    completed?: Array<boolean>;
    mealType?: string | null;
  } = $props();

  function handleKeypress(e: KeyboardEvent, idx: number) {
    if (e.key === "Enter" && checklistMode) {
      completed[idx] = !completed[idx];
    }
  }

  const stepBgClass = $derived(getMealTypeStyles(mealType));
</script>

<ol class="flex flex-col gap-6">
  {#each steps as step, i (step.id)}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <li
      class="flex flex-row gap-4 {checklistMode ? 'cursor-pointer group' : ''}"
      onclick={() => {
        if (checklistMode) completed[i] = !completed[i];
      }}
      onkeydown={event => handleKeypress(event, i)}
    >
      <div class="shrink-0 mt-0.5">
        {#if checklistMode && completed[i]}
          <div class="size-8 rounded-full {stepBgClass} flex items-center justify-center">
            <span class="text-primary-foreground text-sm font-bold">
              <Check size={16} />
            </span>
          </div>
        {:else}
          <StepNumber number={step.orderIndex + 1} bgClass={stepBgClass} />
        {/if}
      </div>

      <div
        class="leading-relaxed prose prose-sm transition-opacity {checklistMode && completed[i]
          ? 'opacity-40 line-through'
          : ''}"
      >
        <!-- Needed for markdown functionality -->
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html marked(step.content)}
      </div>
    </li>
  {/each}
</ol>
