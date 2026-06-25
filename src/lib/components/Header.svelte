<script lang="ts">
  import { ChefHat, Plus } from "@lucide/svelte";
  import Button from "./ui/button/button.svelte";
</script>

<div class="z-50 bg-background fixed top-0 flex flex-row items-center w-full p-6 border-b shadow-xs">
  <a href="/" class="font-semibold flex flex-row gap-x-2 text-center mr-6 md:w-auto">
    <ChefHat />
    Recipes
  </a>
  <Button class="flex md:justify-end">
    <Plus />
    <div class="mr-1">Add recipe...</div>
  </Button>
</div>
