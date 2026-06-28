<script lang="ts">
  import { CakeSlice, Candy, CookingPot, Croissant, Sandwich, UtensilsCrossed } from "@lucide/svelte";

  import { Badge } from "./ui/badge";

  const { mealType }: { mealType: string } = $props();

  const mealTypeMappings: Map<string, { icon: typeof Croissant; class: string }> = new Map([
    ["breakfast", { icon: Croissant, class: "bg-accent text-foreground" }],
    ["lunch", { icon: Sandwich, class: "bg-lunch text-card" }],
    ["dinner", { icon: CookingPot, class: "bg-primary text-card" }],
    ["dessert", { icon: CakeSlice, class: "bg-dessert text-card" }],
    ["snack", { icon: Candy, class: "bg-snack text-card" }],
    ["other", { icon: UtensilsCrossed, class: "bg-muted text-foreground" }]
  ]);

  // svelte-ignore state_referenced_locally
  const mealTypeData = mealTypeMappings.get(mealType);
  const MealTypeIcon = mealTypeData!.icon;
</script>

<Badge class={mealTypeData!.class}>
  <MealTypeIcon />
  {mealType}
</Badge>
