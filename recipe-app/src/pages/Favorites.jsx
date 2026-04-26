import { Link } from 'react-router-dom'

function Favorites({ favorites, removeFavorite }) {
  if (favorites.length === 0) {
    return (
      <div className="container favorites-page">
        <div className="empty-state">
          <p className="eyebrow">Nothing saved yet</p>
          <h2>Your favorite recipes will show up here.</h2>
          <p className="empty-copy">Save recipes from the home page and this list will fill up.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container favorites-page favorites-list">
      <div className="favorites-hero">
        <div>
          <p className="eyebrow">Your collection</p>
          <h1 className="favorites-heading">Saved recipes</h1>
        </div>
        <p className="helper-copy">
          A quick list of the recipes you want to come back to without searching again.
        </p>
      </div>

      <div className="results-grid">
        {favorites.map((recipe) => (
          <article key={recipe.id} className="recipe-card">
            <div className="card-media">
              <button className="fav-heart active" onClick={() => removeFavorite(recipe.id)}>
                Remove
              </button>
              <Link to={`/recipe/${recipe.id}`}>
                {recipe.image ? (
                  <img src={recipe.image} alt={recipe.title} className="card-img" />
                ) : (
                  <div className="placeholder-img">No image</div>
                )}
              </Link>
            </div>

            <div className="card-content">
              <div className="card-head">
                <h3 className="card-title">{recipe.title}</h3>
                <p className="card-copy">Saved for a future cooking session.</p>
              </div>

              {recipe.readyInMinutes ? (
                <div className="card-meta">
                  <span className="meta-pill">{recipe.readyInMinutes} min</span>
                </div>
              ) : null}

              <Link to={`/recipe/${recipe.id}`} className="detail-link">
                Open recipe
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Favorites
