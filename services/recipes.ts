export async function getRecipes() {
  const response = await fetch("https://dummyjson.com/recipes");
  const data = await response.json();
  return data;
}

export async function searchRecipes(query: string) {
  const response = await fetch(
    `https://dummyjson.com/recipes/search?q=${query}`
  );
  const data = await response.json();
  return data;
}
