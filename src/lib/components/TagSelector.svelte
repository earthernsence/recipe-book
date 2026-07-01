<script lang="ts">
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
    onchange: (next: Set<number>) => void;
    oncreate?: (tag: Tag) => void;
  } = $props();

  // Using a local copy lets us optimistically update
  // the list so it can be used before waiting for
  // invalidateAll() to complete
  let localTags = $state([...allTags]);
</script>

<Command.Root class="rounded-lg border shadow-md">
  <Command.Input placeholder={allowCreate ? "Search or create a tag..." : "Search for a tag..."} />
  <Command.List></Command.List>
</Command.Root>
