<script lang="ts">
  import { onDestroy } from "svelte";
  import { invalidateAll } from "$app/navigation";
  import { Star } from "@lucide/svelte";

  import * as Tooltip from "$lib/components/ui/tooltip";

  let {
    recipeId,
    favourite: initialFavourite,
    size = "default"
  }: { recipeId: number; favourite: boolean; size?: "default" | "sm" } = $props();

  let favourite = $state(initialFavourite);
  let saving = $state(false);
  let destroyed = false;

  onDestroy(() => (destroyed = true));

  async function toggle(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (saving) return;
    // Optimistically change the favourite status so that it feels
    // quick while using. If it doesn't work, we fall back to what
    // it was before we pressed it.
    const next = !favourite;
    favourite = next;
    saving = true;

    try {
      const res = await fetch(`/api/recipes/${recipeId}/favourite`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favourite: next })
      });

      if (!res.ok) throw new Error();
      if (!destroyed) await invalidateAll();
    } catch {
      if (!destroyed) favourite = !next;
    } finally {
      if (!destroyed) saving = false;
    }
  }

  const iconSize = $derived(size === "sm" ? 16 : 20);
</script>

<button
  onclick={toggle}
  disabled={saving}
  aria-label={favourite ? "Remove from Favourites" : "Add to Favourites"}
  class="transition-colors min-h-11 min-w-11 flex items-center justify-center {saving ? 'opacity-50' : ''}"
>
  <Tooltip.Root>
    <Tooltip.Trigger>
      <Star
        size={iconSize}
        class="transition-colors {favourite
          ? 'fill-accent stroke-accent'
          : 'stroke-muted-foreground hover:stroke-accent'}"
      />
    </Tooltip.Trigger>
    <Tooltip.Content>
      <span>{favourite ? "Remove from Favourites" : "Add to Favourites"}</span>
    </Tooltip.Content>
  </Tooltip.Root>
</button>
