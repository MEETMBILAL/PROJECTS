import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import RecipeDetail from './pages/RecipeDetail'
import Favorites from './pages/Favorites'

function App() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('favorites')
    if (stored) {
      setFavorites(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  const addFavorite = (recipe) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.id === recipe.id)) return prev
      return [
        ...prev,
        {
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          readyInMinutes: recipe.readyInMinutes,
        },
      ]
    })
  }

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id))
  }

  const isFavorite = (id) => {
    return favorites.some((fav) => fav.id === id)
  }

  const toggleFavorite = (recipe) => {
    if (isFavorite(recipe.id)) {
      removeFavorite(recipe.id)
    } else {
      addFavorite(recipe)
    }
  }

  return (
    <div className="app-shell">
      <Header favoritesCount={favorites.length} />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
            />
          }
        />
        <Route
          path="/recipe/:id"
          element={
            <RecipeDetail
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
            />
          }
        />
        <Route
          path="/favorites"
          element={<Favorites favorites={favorites} removeFavorite={removeFavorite} />}
        />
      </Routes>
    </div>
  )
}

export default App
