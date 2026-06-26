import { db } from "$lib/server/db";
import type { RecipeCardData } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const rawRecipes = await db.query.recipes.findMany({
    with: {
      recipeTags: {
        with: {
          tag: true
        }
      },
      ingredients: true
    },
    orderBy: (recipes, { asc }) => [asc(recipes.title)]
  });

  const recipes: Array<RecipeCardData> = rawRecipes.map(recipe => ({
    ...recipe,
    tags: recipe.recipeTags.map(rt => rt.tag),
    ingredientCount: recipe.ingredients.length
  }));

  return { recipes };
};

// export async function load(): Promise<{ recipes: Array<RecipeCardData> }> {
//   return {
//     recipes: [
//       {
//         id: 1,
//         title: "Testing title 1 but it's a really really really long title",
//         description: "Something easy but with a long long long long description, so long it causes overflow",
//         cuisineType: "italian",
//         mealType: "dinner",
//         prepTimeMinutes: 10,
//         cookTimeMinutes: 15,
//         servings: 3,
//         notes: null,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         tags: [
//           { id: 1, name: "chicken" },
//           { id: 5, name: "easy-to-make" }
//         ],
//         ingredientCount: 5
//       },
//       {
//         id: 2,
//         title: "Testing title 2",
//         description: "Something medium",
//         cuisineType: "mexican",
//         mealType: "lunch",
//         prepTimeMinutes: 15,
//         cookTimeMinutes: 20,
//         servings: 3,
//         notes: "The quick brown fox jumps over the lazy dog",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         tags: [
//           { id: 1, name: "chicken" },
//           { id: 2, name: "beef" },
//           { id: 6, name: "intermediate" }
//         ],
//         ingredientCount: 9
//       },
//       {
//         id: 3,
//         title: "Testing title 3",
//         description: "Something hard",
//         cuisineType: "american",
//         mealType: "breakfast",
//         prepTimeMinutes: 20,
//         cookTimeMinutes: 30,
//         servings: 3,
//         notes: "Sphinx of black quartz, judge my vow",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         tags: [
//           { id: 3, name: "pork" },
//           { id: 4, name: "turkey" },
//           { id: 6, name: "expert" }
//         ],
//         ingredientCount: 15
//       }
//     ]
//   };
// }
