function SearchBar({
  ingredientInput,
  diet,
  maxMissing,
  onIngredientChange,
  onDietChange,
  onMaxMissingChange,
  onSearch,
  onWhatCanICook,
}) {
  const dietOptions = [
    { value: 'any', label: 'Any diet' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'ketogenic', label: 'Ketogenic' },
    { value: 'pescetarian', label: 'Pescetarian' },
    { value: 'paleo', label: 'Paleo' },
    { value: 'primal', label: 'Primal' },
    { value: 'gluten free', label: 'Gluten free' },
    { value: 'whole30', label: 'Whole30' },
  ]

  return (
    <div className="search-section">
      <div className="search-form">
        <div className="input-group">
          <label>Ingredients</label>
          <input
            type="text"
            value={ingredientInput}
            onChange={(e) => onIngredientChange(e.target.value)}
            placeholder="Try chicken, rice, tomato"
          />
        </div>

        <div className="input-group">
          <label>Diet</label>
          <select value={diet} onChange={(e) => onDietChange(e.target.value)}>
            {dietOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group slider-group">
          <label>Missing ingredients</label>
          <span className="slider-value">Up to {maxMissing}</span>
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={maxMissing}
            onChange={(e) => onMaxMissingChange(Number(e.target.value))}
          />
        </div>

        <div className="button-group">
          <button className="primary-btn" onClick={onSearch}>
            Search recipes
          </button>
          <button className="secondary-btn" onClick={onWhatCanICook}>
            Use only what I have
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
