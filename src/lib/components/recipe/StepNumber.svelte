<script lang="ts">
  const {
    number,
    size = "md",
    class: className = ""
  }: {
    number: number;
    size?: "sm" | "md";
    class?: string;
  } = $props();

  const sizeClasses = $derived(size === "sm" ? "size-6 text-xs" : "size-8 text-sm");
</script>

<span
  class="flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold shrink-0 {sizeClasses} {className}"
>
  {number}
</span>
