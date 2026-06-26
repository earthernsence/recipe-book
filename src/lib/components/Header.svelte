<script lang="ts">
  import { ChefHat } from "@lucide/svelte";

  import AddRecipeButton from "./recipe/AddRecipeButton.svelte";

  import { resolve } from "$app/paths";
</script>

<header class="z-50 bg-background fixed top-0 flex flex-row items-center w-full p-6 border-b shadow-xs justify-between">
  <a href={resolve("/")} class="font-serif flex flex-row gap-x-2 text-center mr-6 md:w-auto items-center">
    <ChefHat />
    <span class="text-2xl">Recipes</span>
  </a>
  <AddRecipeButton />
</header>
