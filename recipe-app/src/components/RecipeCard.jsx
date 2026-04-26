import { Link } from 'react-router-dom'

function RecipeCard({ recipe, isFavorite, onToggleFavorite }) {
  const imageUrl = recipe.image
  const usedCount = recipe.usedIngredientCount || 0
  const missedCount = recipe.missedIngredientCount || 0

  return (
    <article className="recipe-card">
      <div className="card-media">
        <button
          className={`fav-heart ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            onToggleFavorite(recipe)
          }}
        >
          {isFavorite ? 'Saved' : 'Save'}
        </button>

        {imageUrl ? (
          <img src={imageUrl} alt={recipe.title} className="card-img" />
        ) : (
          <div className="placeholder-img">No image</div>
        )}
      </div>

      <div className="card-content">
        <div className="card-head">
          <h3 className="card-title">{recipe.title}</h3>
          <p className="card-copy">
            A quick beginner-friendly recipe match based on your ingredients.
          </p>
        </div>

        <div className="card-meta">
          <span className="meta-pill">Used {usedCount}</span>
          <span className="meta-pill">Missing {missedCount}</span>
          {recipe.readyInMinutes ? (
            <span className="meta-pill">{recipe.readyInMinutes} min</span>
          ) : null}
        </div>

        <Link to={`/recipe/${recipe.id}`} className="detail-link">
          View recipe
        </Link>
      </div>
    </article>
  )
}

export default RecipeCard
