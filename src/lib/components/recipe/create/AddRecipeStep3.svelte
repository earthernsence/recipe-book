<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
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
  // oxlint-enable prefer-const

  function toggleTag(id: number) {
    if (selectedTagIds.has(id)) selectedTagIds.delete(id);
    else selectedTagIds.add(id);
  }
</script>

<div class="flex flex-col gap-6">
  <div class="flex flex-col gap-2">
    <Label>Tags</Label>
    {#if allTags.length === 0}
      <span class="text-sm text-muted-foreground">No tags in the database yet...</span>
    {:else}
      <div class="flex flex-wrap gap-2">
        {#each allTags as tag (tag.id)}
          <button type="button" onclick={() => toggleTag(tag.id)}>
            <Badge variant={selectedTagIds.has(tag.id) ? "default" : "outline"}>
              {tag.name}
            </Badge>
          </button>
        {/each}
      </div>
    {/if}
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
