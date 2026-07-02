<script lang="ts">
  import type { Tag } from "$lib/server/db/schema";
  import type { FilterState } from "$lib/utils/utils_filtering";
  import FilterControls from "./FilterControls.svelte";

  let {
    filters,
    allTags,
    cuisineOptions,
    authenticated = false,
    onchange
  }: {
    filters: FilterState;
    allTags: Array<Tag>;
    cuisineOptions: { cuisines: Array<[string, number]>; noneCount: number };
    authenticated?: boolean;
    onchange: (next: FilterState) => void;
  } = $props();
</script>

<aside class="hidden lg:block w-56 shrink-0 sticky top-14 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
  <FilterControls {filters} {allTags} {cuisineOptions} {authenticated} {onchange} />
</aside>
