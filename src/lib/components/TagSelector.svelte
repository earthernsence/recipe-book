<script lang="ts">
  import { Check, X } from "@lucide/svelte";
  import { SvelteSet } from "svelte/reactivity";

  import { Badge } from "$lib/components/ui/badge";
  import * as Command from "$lib/components/ui/command";
  import type { Tag } from "$lib/server/db/schema";

  let {
    allTags,
    selectedIds,
    allowCreate = false,
    onChange,
    onCreate
  }: {
    allTags: Array<Tag>;
    selectedIds: Set<number>;
    allowCreate?: boolean;
    onChange: (next: Set<number>) => void;
    onCreate?: (tag: Tag) => void;
  } = $props();

  // Child owns the reactive state — initialized from prop, never re-synced
  let localSelected = $state(new SvelteSet<number>(selectedIds));

  let search = $state("");
  let creating = $state(false);

  const normalised = $derived(search.trim().toLowerCase());

  const visibleTags = $derived(normalised ? allTags.filter(t => t.name.toLowerCase().includes(normalised)) : allTags);

  const exactMatch = $derived(allTags.some(t => t.name.toLowerCase() === normalised));

  const showCreate = $derived(allowCreate && normalised.length > 0 && !exactMatch);

  const selectedTags = $derived(allTags.filter(t => localSelected.has(t.id)));

  function toggle(id: number) {
    localSelected.has(id) ? localSelected.delete(id) : localSelected.add(id);
    onChange(new SvelteSet(localSelected));
  }

  function remove(id: number) {
    localSelected.delete(id);
    onChange(new SvelteSet(localSelected));
  }

  async function handleCreate() {
    if (!allowCreate || !normalised || exactMatch || creating) return;
    creating = true;

    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: normalised })
      });

      if (!res.ok) throw new Error();

      const tag: Tag = await res.json();

      localSelected.add(tag.id);
      onChange(new SvelteSet(localSelected));
      onCreate?.(tag);
      search = "";
    } catch {
      // silently fail
    } finally {
      creating = false;
    }
  }
</script>

<!-- As part of this component, we also want users to be able to
 deselect any of the tags that they've selected. To me, the easiest
 way to do this is to have a list of tag pills that can be clicked on
 to remove. -->

<!-- Selected pills -->
{#if selectedTags.length > 0}
  <div class="flex flex-wrap gap-1.5 mb-2">
    {#each selectedTags as tag (tag.id)}
      <Badge variant="default" class="gap-1 pr-1">
        {tag.name}
        <button
          type="button"
          onclick={() => remove(tag.id)}
          aria-label="Remove {tag.name}"
          class="hover:text-destructive transition-colors rounded-full"
        >
          <X size={11} />
        </button>
      </Badge>
    {/each}
  </div>
{/if}

<!-- Command -->
<Command.Root shouldFilter={false} class="border rounded-md">
  <Command.Input bind:value={search} placeholder={allowCreate ? "Search or create tag..." : "Search tags..."} />
  <Command.List>
    {#if visibleTags.length === 0 && !showCreate}
      <Command.Empty>
        {normalised ? "No matching tags..." : "No tags yet...create one!"}
      </Command.Empty>
    {/if}

    {#if visibleTags.length > 0}
      <Command.Group>
        {#each visibleTags as tag (tag.id)}
          <Command.Item
            value={tag.name}
            onSelect={() => toggle(tag.id)}
            class="flex items-center justify-between gap-2 cursor-pointer"
          >
            <span class={localSelected.has(tag.id) ? "font-medium text-primary" : ""}>
              {tag.name}
            </span>
            {#if localSelected.has(tag.id)}
              <span class="text-primary text-xs"><Check size={12} /></span>
            {/if}
          </Command.Item>
        {/each}
      </Command.Group>
    {/if}

    {#if showCreate}
      <Command.Separator />
      <Command.Group>
        <Command.Item
          value="__create__"
          onSelect={handleCreate}
          class="cursor-pointer text-muted-foreground italic"
          disabled={creating}
        >
          {creating ? "Creating..." : `Create "${normalised}"`}
        </Command.Item>
      </Command.Group>
    {/if}
  </Command.List>
</Command.Root>
