import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import type { Difficulty } from "$lib/types";

export type SortMode = "alpha-asc" | "alpha-desc" | "newest" | "oldest";

export type FilterState = {
  search: string;
  tagIds: Set<number>;
  cuisine: string;
  favourites: boolean;
  mealTypes: Set<string>;
  difficulty: string;
  sort: SortMode;
};

export class RecipeFilter {
  static parseFilters(params: URLSearchParams): FilterState {
    return {
      search: params.get("search") ?? "",
      tagIds: new Set(params.get("tags")?.split(",").map(Number).filter(Boolean) ?? []),
      cuisine: params.get("cuisine") ?? "",
      favourites: params.get("favourites") === "true",
      mealTypes: new Set(params.get("mealTypes")?.split(",").filter(Boolean) ?? []),
      difficulty: (params.get("difficulty") as Difficulty) ?? "",
      sort: (params.get("sort") as SortMode) ?? "alpha-asc"
    };
  }

  static serialiseFilters(state: FilterState): URLSearchParams {
    const params = new URLSearchParams();
    if (state.search.trim()) params.set("search", state.search.trim());
    if (state.tagIds.size > 0) params.set("tags", [...state.tagIds].join(","));
    if (state.cuisine) params.set("cuisine", state.cuisine);
    if (state.favourites) params.set("favourites", "true");
    if (state.mealTypes.size > 0) params.set("mealTypes", [...state.mealTypes].join(","));
    if (state.difficulty.trim()) params.set("difficulty", state.difficulty.trim());
    if (state.sort !== "alpha-asc") params.set("sort", state.sort);
    return params;
  }

  static setFilters(state: FilterState): void {
    const params = RecipeFilter.serialiseFilters(state);
    goto(resolve(`/?${params.toString()}`), { replaceState: true, keepFocus: true });
  }

  static activeFilterCount(state: FilterState): number {
    let count = 0;
    if (state.tagIds.size > 0) count += state.tagIds.size;
    if (state.cuisine) count++;
    if (state.favourites) count++;
    if (state.mealTypes.size > 0) count += state.mealTypes.size;
    if (state.difficulty.trim()) count++;
    if (state.sort !== "alpha-asc") count++;
    return count;
  }
}
