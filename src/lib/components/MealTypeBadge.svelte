<script lang="ts">
  import { CakeSlice, Candy, CookingPot, Croissant, Sandwich, UtensilsCrossed } from "@lucide/svelte";

  import type { MealType } from "$lib/types";
  import { getMealTypeStyles } from "$lib/utils/utils_styles";

  const MEAL_TYPE_MAP: Map<MealType, { icon: typeof Croissant }> = new Map([
    ["breakfast", { icon: Croissant }],
    ["lunch", { icon: Sandwich }],
    ["dinner", { icon: CookingPot }],
    ["dessert", { icon: CakeSlice }],
    ["snack", { icon: Candy }],
    ["other", { icon: UtensilsCrossed }]
  ]);

  const { mealType }: { mealType: MealType } = $props();

  const mapping = $derived(MEAL_TYPE_MAP.get(mealType) ?? MEAL_TYPE_MAP.get("other")!);
  const classes = $derived(getMealTypeStyles(mealType));
</script>

<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium {classes}">
  <mapping.icon size={12} />
  {mealType}
</span>
