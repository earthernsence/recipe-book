<script lang="ts">
  import { Plus } from "@lucide/svelte";

  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import type { Tag } from "$lib/server/db/schema";

  // oxlint-disable prefer-const
  let {
    allTags,
    selectedTagIds = $bindable(),
    notes = $bindable()
  }: {
    allTags: Array<Tag>;
    selectedTagIds: Set<number>;
    notes: string;
  } = $props();

  // We only take the initial state of tags -- we'll add any of the tags
  // we create ourselves to the array so we don't have to update the original
  // tags array
  // svelte-ignore state_referenced_locally
  let localTags = $state([...allTags]);
  let newTagName = $state("");
  let creating = $state(false);
  let createError = $state<string | null>(null);

  // oxlint-enable prefer-const

  function toggleTag(id: number) {
    if (selectedTagIds.has(id)) selectedTagIds.delete(id);
    else selectedTagIds.add(id);
  }

  async function createTag() {
    const name = newTagName.trim();
    if (!name || creating) return;

    creating = true;
    createError = null;

    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });

      if (!res.ok) throw new Error("Failed to create tag");

      const tag: Tag = await res.json();

      if (!localTags.some(t => t.id === tag.id)) {
        localTags.push(tag);
        localTags.sort((a, b) => a.name.localeCompare(b.name));
      }

      selectedTagIds.add(tag.id);
      newTagName = "";
    } catch (e) {
      createError = "Couldn't create tag -- try again";
    } finally {
      creating = false;
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      createTag();
    }
  }
</script>

<div class="flex flex-col gap-6">
  <div class="flex flex-col gap-2">
    <Label>Tags</Label>

    {#if localTags.length > 0}
      <div class="flex flex-wrap gap-2">
        {#each localTags as tag (tag.id)}
          {@const tagEnabled = selectedTagIds.has(tag.id)}
          <button type="button" onclick={() => toggleTag(tag.id)}>
            <Badge
              variant={tagEnabled ? "default" : "outline"}
              class={tagEnabled ? "bg-primary/75 border-primary text-card" : "bg-transparent text-foreground"}
            >
              {tag.name}
            </Badge>
          </button>
        {/each}
      </div>
    {/if}

    <div class="flex flex-row gap-2 mt-1">
      <Input
        bind:value={newTagName}
        onkeydown={onKeydown}
        placeholder="Create a tag..."
        disabled={creating}
        class="max-w-56"
      />
      <Button variant="outline" onclick={createTag} disabled={!newTagName.trim() || creating} class="gap-2 shrink-0">
        <Plus size={16} />
        {creating ? "Adding..." : "Add tag"}
      </Button>
    </div>

    {#if createError}
      <span class="text-sm text-destructive">{createError}</span>
    {/if}

    <span class="text-xs text-muted-foreground">
      Press Enter or click Add tag. Existing tag names will be selected instead. You can also click on any pre-existing
      tag to select it and add it to this recipe.
    </span>
  </div>

  <div class="flex flex-col gap-1.5">
    <Label for="notes">Notes</Label>
    <Textarea
      id="notes"
      bind:value={notes}
      placeholder="Substitutions, tips, how it went the first time..."
      rows={5}
      class="resize-none"
    />
    <span class="text-xs text-muted-foreground">Markdown supported.</span>
  </div>
</div>
