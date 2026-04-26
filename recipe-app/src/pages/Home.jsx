import { useState } from 'react'
import SearchBar from '../components/SearchBar'
import RecipeCard from '../components/RecipeCard'
import { searchRecipes } from '../api'

function Home({ favorites, toggleFavorite, isFavorite }) {
  const [ingredientInput, setIngredientInput] = useState('')
  const [diet, setDiet] = useState('any')
  const [maxMissing, setMaxMissing] = useState(2)
  const [results, setResults] = useState([])
  const [filteredResults, setFilteredResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const applyClientFilter = (recipes, maxMiss) => {
    return recipes.filter((recipe) => (recipe.missedIngredientCount || 0) <= maxMiss)
  }

  const performSearch = async (ingredients, dietValue, maxMissValue) => {
    if (!ingredients.trim()) {
      setError('Please enter at least one ingredient.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const cleaned = ingredients
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter((item) => item)
        .join(',')

      const data = await searchRecipes(cleaned, dietValue)
      setResults(data)
      setFilteredResults(applyClientFilter(data, maxMissValue))
    } catch (err) {
      setError(err.message || 'Could not load recipes. Check your API key.')
      setResults([])
      setFilteredResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    performSearch(ingredientInput, diet, maxMissing)
  }

  const handleWhatCanICook = () => {
    setMaxMissing(0)
    performSearch(ingredientInput, diet, 0)
  }

  const handleMaxMissingChange = (newVal) => {
    setMaxMissing(newVal)
    if (results.length) {
      setFilteredResults(applyClientFilter(results, newVal))
    }
  }

  return (
    <div className="container home-page">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Ingredient-based cooking</p>
          <h1>Turn what is already in your kitchen into dinner.</h1>
          <p className="hero-subtext">
            This still works like a beginner project: type ingredients, search recipes, and save the
            ones you like. The UI just has a lot more range now.
          </p>

          <div className="hero-highlights">
            <div className="hero-highlight">
              <span className="meta-label">Saved recipes</span>
              <strong>{favorites.length}</strong>
            </div>
            <div className="hero-highlight">
              <span className="meta-label">Diet filter</span>
              <strong>{diet === 'any' ? 'Flexible' : diet}</strong>
            </div>
            <div className="hero-highlight">
              <span className="meta-label">Missing limit</span>
              <strong>{maxMissing}</strong>
            </div>
          </div>
        </div>

        <div className="hero-spotlight">
          <div className="spotlight-top">
            <p className="eyebrow">How it works</p>
            <h2>Simple search, cleaner results.</h2>
          </div>
          <div className="spotlight-points">
            <span>Add ingredients you already have.</span>
            <span>Limit how many extras you are willing to buy.</span>
            <span>Open a recipe and save it for later.</span>
          </div>
        </div>
      </section>

      <SearchBar
        ingredientInput={ingredientInput}
        diet={diet}
        maxMissing={maxMissing}
        onIngredientChange={setIngredientInput}
        onDietChange={setDiet}
        onMaxMissingChange={handleMaxMissingChange}
        onSearch={handleSearch}
        onWhatCanICook={handleWhatCanICook}
      />

      <div className="results-header">
        <div>
          <p className="eyebrow">Results</p>
          <h2>{filteredResults.length} recipes ready to explore</h2>
        </div>
        <p className="helper-copy">Best for quick browsing, simple filtering, and saving favorites.</p>
      </div>

      {loading && <div className="loading">Loading recipes...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && filteredResults.length === 0 && !error ? (
        <div className="empty-state">
          <p className="eyebrow">No matches yet</p>
          <h3>Try a different combination of ingredients.</h3>
          <p className="empty-copy">Chicken, rice, eggs, tomato, and onion usually give you a better spread.</p>
        </div>
      ) : null}

      <div className="results-grid">
        {filteredResults.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isFavorite={isFavorite(recipe.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  )
}

export default Home
