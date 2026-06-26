<script lang="ts">
  import type { Session } from "@auth/sveltekit";
  import { ChefHat } from "@lucide/svelte";

  import { Button } from "$lib/components/ui/button";
  import AddRecipeButton from "./recipe/AddRecipeButton.svelte";

  import { resolve } from "$app/paths";

  const { session, onAddRecipe }: { session: Session | null; onAddRecipe: () => void } = $props();
</script>

<header class="z-50 bg-background fixed top-0 flex flex-row items-center w-full p-6 border-b shadow-xs justify-between">
  <a href={resolve("/")} class="font-serif flex flex-row gap-x-2 text-center mr-6 md:w-auto items-center">
    <ChefHat />
    <span class="text-2xl">Recipes</span>
  </a>
  <div class="flex flex-row gap-3 items-center">
    {#if session}
      <AddRecipeButton onclick={onAddRecipe} />
      <form method="POST" action="/auth/signout">
        <Button variant="ghost" type="submit">Sign out...</Button>
      </form>
    {:else}
      <form method="POST" action="/auth/signin/">
        <input type="hidden" name="providerId" value="github" />
        <Button variant="ghost" type="submit">Sign in...</Button>
      </form>
    {/if}
  </div>
</header>
