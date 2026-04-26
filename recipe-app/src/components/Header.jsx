import { Link, useNavigate } from 'react-router-dom'
import { fetchRandomRecipe } from '../api'

function Header({ favoritesCount }) {
  const navigate = useNavigate()

  const handleRandom = async () => {
    try {
      const recipe = await fetchRandomRecipe()
      navigate(`/recipe/${recipe.id}`)
    } catch (err) {
      console.error('Random recipe error', err)
    }
  }

  return (
    <header className="sticky-header">
      <div className="header-content">
        <Link to="/" className="logo-block">
          <span className="logo">Recipe Finder</span>
          <span className="logo-subtitle">Simple search, better presentation</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">
            Discover
          </Link>
          <Link to="/favorites" className="nav-link">
            Saved <span className="fav-badge">{favoritesCount}</span>
          </Link>
          <button onClick={handleRandom} className="random-btn">
            Surprise me
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
