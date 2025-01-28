"use client";

import React, { useEffect, useState } from "react";
import { getRecipes } from "@/services/recipes";

interface Recipe {
  id: number;
  name: string;
  image: string;
  instructions: string[];
  tags: string[];
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function fetchRecipes() {
      const data = await getRecipes();
      setRecipes(data.recipes);
    }
    fetchRecipes();
  }, []);

  const truncateInstructions = (instructions: string[], maxLength: number) => {
    const joinedInstructions = instructions.join(" ");
    if (joinedInstructions.length > maxLength) {
      return joinedInstructions.substring(0, maxLength) + "...";
    }
    return joinedInstructions;
  };

  return (
    <>
      <main className="flex flex-wrap justify-center items-center min-h-screen bg-gray-100 p-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white"
          >
            <img className="w-full" src={recipe.image} alt={recipe.name} />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{recipe.name}</div>
              <p className="text-gray-700 text-base">
                {truncateInstructions(recipe.instructions, 100)}
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </main>
    </>
  );
}
