<script lang="ts">
  import { ArrowLeft, ArrowRight, Check, ChefHat, Dot, ShoppingBasket } from "@lucide/svelte";
  import { marked } from "marked";

  import IngredientSheet from "$lib/components/recipe/cooking/IngredientSheet.svelte";
  import { Button } from "$lib/components/ui/button";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();
  const { recipe } = data;

  let currentStepIndex = $state(0);
  let completedSteps = $state<Array<boolean>>(recipe.steps.map(() => false));
  let completedIngredients = $state<Array<boolean>>(recipe.ingredients.map(() => false));
  let ingredientsOpen = $state(false);
  let finished = $state(false);

  const currentStep = $derived(recipe.steps[currentStepIndex]);
  const progressPct = $derived(finished ? 100 : (currentStepIndex / recipe.steps.length) * 100);
  const checkedCount = $derived(completedIngredients.filter(Boolean).length);

  function next() {
    completedSteps[currentStepIndex] = true;
    if (currentStepIndex < recipe.steps.length - 1) {
      currentStepIndex++;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      finished = true;
    }
  }

  function prev() {
    if (currentStepIndex > 0) {
      currentStepIndex--;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
</script>

<!-- The idea here is that we'll have an overlay above the standard layout. This'll work
 for us because we have a header/footer layout, and those are elements that could easily 
 get in the way. We want this because "cooking mode"'s focus should be *on the cooking*,
 with easy-to-reach buttons and things of that nature. -->

<div class="fixed inset-0 z-100 bg-background flex flex-col h-dvh">
  <!-- Top bar -->
  <header class="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-background">
    <a
      href="/recipe/{recipe.id}"
      class="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors min-h-11"
    >
      <ArrowLeft size={20} />
      <span class="text-sm truncate max-w-45 sm:max-w-xs">{recipe.title}</span>
    </a>
    {#if !finished}
      <span class="text-sm font-medium text-muted-foreground tabular-nums">
        {currentStepIndex + 1} / {recipe.steps.length}
      </span>
    {/if}
  </header>

  <!-- Progress bar -->
  <div class="h-1 bg-muted shrink-0">
    <div class="h-full bg-primary transition-all duration-500 ease-out" style="width: {progressPct}%"></div>
  </div>

  <!-- Step content -->
  <main class="flex-1 overflow-y-auto px-6 py-8">
    <div class="max-w-lg mx-auto">
      {#if !finished}
        <div class="flex items-center gap-3 mb-8">
          <span
            class="flex items-center justify-center size-10 rounded-full bg-primary text-primary-foreground font-semibold text-lg shrink-0"
          >
            {currentStepIndex + 1}
          </span>
          <span class="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            Step {currentStepIndex + 1} of {recipe.steps.length}
          </span>
        </div>

        <div
          class="prose prose-base max-w-none text-foreground [&_p]:text-lg [&_p]:leading-relaxed [&_strong]:text-foreground"
        >
          {@html marked(currentStep.content)}
        </div>
      {:else}
        <div class="flex flex-col items-center justify-center h-full gap-6 text-center pt-16">
          <ChefHat size={72} class="text-primary" />
          <div>
            <h1 class="font-serif text-4xl mb-3">You did it!</h1>
            <span class="text-muted-foreground text-lg">{recipe.title}</span>
          </div>
          <a href="/recipe/{recipe.id}">
            <Button size="lg" variant="outline">Back to recipe...</Button>
          </a>
        </div>
      {/if}
    </div>
  </main>

  <!-- Bottom nav -->
  {#if !finished}
    <footer class="shrink-0 border-t bg-background px-4 pt-3 pb-4 flex flex-col gap-3 safe-area-bottom">
      <Button variant="outline" class="w-full gap-y-2" onclick={() => (ingredientsOpen = true)}>
        <ShoppingBasket size={16} />
        Ingredients
        {#if checkedCount > 0}
          <span class="text-muted-foreground flex flex-row items-center"><Dot /> {checkedCount} / {recipe.ingredients.length}</span>
        {/if}
      </Button>

      <div class="flex gap-3">
        <Button
          variant="outline"
          onclick={prev}
          disabled={currentStepIndex === 0}
          class="flex-1 h-14 text-base flex flex-row items-center"
        >
          <ArrowLeft size={16} /> Prev
        </Button>
        <Button onclick={next} class="flex-1 h-14 text-base font-semibold">
          {#if currentStepIndex === recipe.steps.length - 1}
            Finish <Check size={16} />
          {:else}
            Next <ArrowRight size={16} />
          {/if}
        </Button>
      </div>
    </footer>
  {/if}
</div>

<IngredientSheet bind:open={ingredientsOpen} ingredients={recipe.ingredients} bind:completed={completedIngredients} />
