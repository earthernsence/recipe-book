<script lang="ts">
  import { SvelteSet } from "svelte/reactivity";

  import TagSelector from "$lib/components/TagSelector.svelte";
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
</script>

<div class="flex flex-col gap-6">
  <div class="flex flex-col gap-2">
    <Label>Tags</Label>

    <TagSelector
      allTags={localTags}
      selectedIds={selectedTagIds}
      allowCreate
      onChange={next => (selectedTagIds = new SvelteSet(next))}
      onCreate={tag => {
        localTags.push(tag);
        localTags.sort((a, b) => a.name.localeCompare(b.name));
      }}
    />
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
