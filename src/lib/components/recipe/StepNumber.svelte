<script lang="ts">
  const {
    number,
    size = "md",
    bgClass = "bg-primary text-primary-foreground"
  }: {
    number: number;
    size?: "sm" | "md";
    bgClass?: string;
  } = $props();

  const sizeClasses = $derived(size === "sm" ? "size-6 text-xs" : "size-8 text-sm");
</script>

<span
  class="flex items-center justify-center rounded-full font-semibold shrink-0 {sizeClasses} {bgClass}"
>
  {number}
</span>
