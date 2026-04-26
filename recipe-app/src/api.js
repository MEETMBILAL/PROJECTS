const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY
const BASE_URL = 'https://api.spoonacular.com'
console.log('API Key:', API_KEY) // Debugging line to check if the API key is loaded

export async function searchRecipes(ingredients, diet) {
  if (!ingredients.trim()) {
    throw new Error('Please enter at least one ingredient')
  }
  const params = new URLSearchParams()
  params.append('apiKey', API_KEY)
  params.append('includeIngredients', ingredients)
  params.append('addRecipeInformation', 'true')
  params.append('fillIngredients', 'true')
  params.append('instructionsRequired', 'true')
  params.append('sort', 'max-used-ingredients')
  params.append('number', '24')
  if (diet && diet !== 'any') {
    params.append('diet', diet)
  }
  const res = await fetch(`${BASE_URL}/recipes/complexSearch?${params}`)
  if (!res.ok) {
    throw new Error('Failed to fetch recipes')
  }
  const data = await res.json()
  return data.results
}

export async function fetchRecipeById(id) {
  const res = await fetch(`${BASE_URL}/recipes/${id}/information?includeNutrition=false&apiKey=${API_KEY}`)
  if (!res.ok) {
    throw new Error('Failed to fetch recipe details')
  }
  return res.json()
}

export async function fetchRandomRecipe() {
  const res = await fetch(`${BASE_URL}/recipes/random?number=1&apiKey=${API_KEY}`)
  if (!res.ok) {
    throw new Error('Failed to fetch random recipe')
  }
  const data = await res.json()
  return data.recipes[0]
}