"use client";

import React, { useEffect, useState } from "react";
import { getRecipes, searchRecipes } from "@/services/recipes";
import Link from "next/link";

interface Recipe {
  id: number;
  name: string;
  image: string;
  instructions: string[];
  tags: string[];
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async () => {
    setLoading(true);
    const data = await getRecipes();
    setRecipes(data.recipes);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      fetchRecipes();
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    if (searchQuery.trim() !== "") {
      setLoading(true);
      const data = await searchRecipes(searchQuery);
      setRecipes(data.recipes);
      setLoading(false);
    }
  };

  const truncateInstructions = (instructions: string[], maxLength: number) => {
    const joinedInstructions = instructions.join(" ");
    if (joinedInstructions.length > maxLength) {
      return joinedInstructions.substring(0, maxLength) + "...";
    }
    return joinedInstructions;
  };

  return (
    <>
      <main className="min-h-screen bg-white py-2 px-4">
        <div className="flex items-center ml-5">
          <Link
            className="bg-blue-500 self-end ml-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4"
            href="/dashboard"
          >
            Back
          </Link>
        </div>
        <div className="w-full bg-white p-8 rounded-lg mb-4">
          <div className="relative">
            <input
              className="w-full placeholder:text-slate-400 text-slate-700 text-sm rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 border border-slate-200"
              placeholder="Search for recipes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="absolute top-1 right-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={handleSearch}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 mr-2"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
              </svg>
              Search
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
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
          </div>
        )}
      </main>
    </>
  );
}
