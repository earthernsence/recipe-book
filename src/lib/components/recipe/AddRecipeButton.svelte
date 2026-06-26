<script lang="ts">
  import { Plus } from "@lucide/svelte";

  import Button from "../ui/button/button.svelte";

  const { onclick }: { onclick: () => void } = $props();
</script>

<Button {onclick} class="flex items-center gap-2">
  <Plus size={16} /> Add recipe...
</Button>
