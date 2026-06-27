<script lang="ts">
  import type { Session } from "@auth/sveltekit";
  import { ChefHat, Ellipsis, LogOut, Tag } from "@lucide/svelte";

  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover";
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
      <Popover>
        <PopoverTrigger class={buttonVariants({ variant: "ghost" })}>
          <Ellipsis size={16} />
        </PopoverTrigger>
        <PopoverContent class="w-40">
          <div class="grid gap-2">
            <div class="flex flex-row items-center gap-x-2">
              <Button variant="ghost" href="/tags">
                <Tag size={16} />
                Edit tags...
              </Button>
            </div>
            <hr class="border-t-2" />
            <div class="flex flex-row items-center gap-x-2">
              <form method="POST" action="/auth/signout">
                <Button variant="ghost" type="submit">
                  <LogOut size={16} />
                  Log out
                </Button>
              </form>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    {:else}
      <form method="POST" action="/auth/signin/">
        <input type="hidden" name="providerId" value="github" />
        <Button variant="ghost" type="submit">Sign in...</Button>
      </form>
    {/if}
  </div>
</header>
