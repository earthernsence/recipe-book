<script lang="ts">
  import { Pencil, Trash2 } from "@lucide/svelte";

  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { Button } from "$lib/components/ui/button";
  import type { Tag } from "$lib/server/db/schema";
  import type { RecipeDetailData } from "$lib/types";
  import EditRecipeModal from "./EditRecipeModal.svelte";

  import { goto, invalidateAll } from "$app/navigation";
  import { resolve } from "$app/paths";

  const {
    recipe,
    allTags
  }: {
    recipe: RecipeDetailData;
    allTags: Array<Tag>;
  } = $props();

  let editOpen = $state(false);
  let deleteOpen = $state(false);
  let deleting = $state(false);
  let deleteError = $state<string | null>(null);

  async function confirmDelete() {
    deleting = true;
    deleteError = null;

    try {
      const res = await fetch(`/api/recipes/${recipe.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete recipe");
      await invalidateAll();
      goto(resolve("/"));
    } catch {
      deleteError = "Couldn't delete recipe. This one must be made of thicker paper. Try again.";
      deleting = false;
    }
  }
</script>

<div class="flex flex-row gap-2">
  <Button variant="outline" size="sm" onclick={() => (editOpen = true)} class="gap-2">
    <Pencil size={16} />
    Edit...
  </Button>

  <Button
    variant="outline"
    size="sm"
    onclick={() => (deleteOpen = true)}
    class="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
  >
    <Trash2 size={16} />
    Delete...
  </Button>
</div>

<EditRecipeModal bind:open={editOpen} {recipe} {allTags} />

<AlertDialog.Root bind:open={deleteOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete "{recipe.title}"?</AlertDialog.Title>
      <AlertDialog.Description>
        This permanently removes the recipe, all its ingredients, steps, and tags. This cannot be undone. Your other
        recipes will not be affected. Some tags may be removed entirely if they only appear on this recipe.
      </AlertDialog.Description>
    </AlertDialog.Header>
    {#if deleteError}
      <span class="text-sm text-destructive">{deleteError}</span>
    {/if}
    <AlertDialog.Footer>
      <AlertDialog.Cancel disabled={deleting}>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action
        onclick={confirmDelete}
        disabled={deleting}
        class="bg-destructive text-destructive-foreground hover:bg-destructive/75"
      >
        {deleting ? "Deleting..." : "Delete recipe"}
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
