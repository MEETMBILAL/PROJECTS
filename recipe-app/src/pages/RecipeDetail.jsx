import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchRecipeById } from '../api'

function RecipeDetail({ toggleFavorite, isFavorite }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchRecipeById(id)
        setRecipe(data)
        setError('')
      } catch (err) {
        setError('Failed to load recipe details.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  const instructionSteps = useMemo(() => {
    if (!recipe) {
      return []
    }

    if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
      const steps = recipe.analyzedInstructions[0].steps || []
      if (steps.length) {
        return steps.map((step) => step.step)
      }
    }

    if (recipe.instructions) {
      return recipe.instructions
        .replace(/<[^>]*>/g, '')
        .split('. ')
        .map((step) => step.trim())
        .filter(Boolean)
    }

    return ['No instructions available for this recipe.']
  }, [recipe])

  if (loading) return <div className="container detail-page loading">Loading recipe...</div>
  if (error) return <div className="container detail-page error">{error}</div>
  if (!recipe) return <div className="container detail-page error">Recipe not found.</div>

  const favoriteStatus = isFavorite(recipe.id)

  return (
    <div className="container detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        Back
      </button>

      <div className="detail-container">
        <section className="detail-hero">
          {recipe.image ? (
            <img src={recipe.image} alt={recipe.title} className="detail-img" />
          ) : (
            <div className="placeholder-img" style={{ height: '100%' }}>
              No image available
            </div>
          )}

          <div className="detail-summary-card">
            <p className="eyebrow">Recipe details</p>
            <h1 className="detail-title">{recipe.title}</h1>
            <p className="detail-summary">
              A clean view of the ingredients, time, and instructions so the recipe remains easy to
              follow even though the page now feels much more finished.
            </p>

            <div className="detail-actions">
              <button
                className={`fav-toggle-btn ${favoriteStatus ? 'active' : ''}`}
                onClick={() =>
                  toggleFavorite({
                    id: recipe.id,
                    title: recipe.title,
                    image: recipe.image,
                    readyInMinutes: recipe.readyInMinutes,
                  })
                }
              >
                {favoriteStatus ? 'Remove from saved' : 'Save recipe'}
              </button>
            </div>

            <div className="detail-info">
              <div className="detail-stat">
                <span className="meta-label">Servings</span>
                <strong>{recipe.servings || 'N/A'}</strong>
              </div>
              <div className="detail-stat">
                <span className="meta-label">Ready in</span>
                <strong>{recipe.readyInMinutes || 'N/A'} min</strong>
              </div>
              <div className="detail-stat">
                <span className="meta-label">Ingredients</span>
                <strong>{recipe.extendedIngredients?.length || 0}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="detail-grid">
          <div className="detail-ingredients">
            <h2 className="section-title">Ingredients</h2>
            <ul className="ingredients-list">
              {recipe.extendedIngredients?.map((ingredient) => (
                <li key={ingredient.id}>{ingredient.original}</li>
              ))}
            </ul>
          </div>

          <div className="detail-instructions">
            <h2 className="section-title">Instructions</h2>
            <div className="instructions">
              {instructionSteps.map((step, index) => (
                <p key={`${index}-${step.slice(0, 18)}`} className="instruction-step">
                  <strong>Step {index + 1}:</strong> {step}
                </p>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default RecipeDetail
