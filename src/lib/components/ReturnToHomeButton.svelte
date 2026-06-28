<script lang="ts">
  import { ArrowLeft } from "@lucide/svelte";

  import { resolve } from "$app/paths";
</script>

<a
  href={resolve("/")}
  class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
>
  <ArrowLeft size={16} />
  Back to recipes...
</a>
