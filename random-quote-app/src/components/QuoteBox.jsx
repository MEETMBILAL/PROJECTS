function QuoteBox({
  entry,
  loading,
  error,
  contentType,
  hadithBook,
  hadithBooks,
  activePoolSize,
  activePoolLabel,
  onNewQuote,
  onContentTypeChange,
  onHadithBookChange,
}) {
  return (
    <section className="quote-card">
      <div className="card-top">
        <div>
          <p className="eyebrow">Islamic Reflections</p>
          <h1 className="hero-title">Short Quran ayat and Sahih Hadith for daily reflection.</h1>
          <p className="hero-copy">
            Restricted to Quran plus Sahih al-Bukhari and Sahih Muslim, with bundled
            references shown on every card.
          </p>
        </div>

        <div className="stats-grid" aria-label="Islamic library stats">
          <div className="stat-pill">
            <span className="stat-label">Mode</span>
            <strong>{contentType === 'quran' ? 'Quran' : 'Hadith'}</strong>
          </div>
          <div className="stat-pill">
            <span className="stat-label">{activePoolLabel}</span>
            <strong>{activePoolSize}</strong>
          </div>
        </div>
      </div>

      <div className="control-panel">
        <div className="control-copy">
          <p className="panel-label">Choose your reflection stream</p>
          <p className="panel-text">
            Switch between Quran verses and Sahih Hadith, then choose between Bukhari
            and Muslim only.
          </p>
        </div>

        <div className="controls-stack">
          <div className="chip-row" aria-label="Reflection type">
            <button
              type="button"
              className={`chip ${contentType === 'quran' ? 'chip-active' : ''}`}
              onClick={() => onContentTypeChange('quran')}
              disabled={loading}
            >
              Quran
            </button>
            <button
              type="button"
              className={`chip ${contentType === 'hadith' ? 'chip-active' : ''}`}
              onClick={() => onContentTypeChange('hadith')}
              disabled={loading}
            >
              Hadith
            </button>
          </div>

          <label className="select-wrap">
            <span className="select-label">Hadith Collection</span>
            <select
              className="author-select"
              value={hadithBook}
              onChange={(event) => onHadithBookChange(event.target.value)}
              disabled={loading || contentType !== 'hadith'}
            >
              {hadithBooks.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="trust-strip">
        <span className="trust-chip">Bundled Quran References</span>
        <span className="trust-chip">Bukhari And Muslim Only</span>
        <span className="trust-chip">No Live API Dependency</span>
      </div>

      <div className="quote-content">
        {loading ? (
          <div className="loader-wrap" role="status" aria-live="polite">
            <span className="spinner" aria-hidden="true" />
            <p className="loader-text">Loading an Islamic reflection...</p>
          </div>
        ) : error ? (
          <div className="error-state" role="alert">
            <p className="error-title">Unable to load right now.</p>
            <p className="error-message">{error}</p>
          </div>
        ) : (
          <div className="quote-copy">
            <div className="source-row">
              <span className="source-badge">{entry.badge}</span>
              <span className="source-meta">{entry.collectionLabel}</span>
            </div>

            {entry.arabicText ? (
              <p className="arabic-text" lang="ar" dir="rtl">
                {entry.arabicText}
              </p>
            ) : null}

            <blockquote className="quote-text">{entry.text}</blockquote>
            <p className="quote-author">{entry.sourceLabel}</p>
            <p className="quote-reference">{entry.sourceMeta}</p>
            <p className="quote-reference quote-reference-strong">
              {entry.type === 'quran'
                ? 'Source type: Quran verse with surah and ayah reference'
                : 'Source type: Hadith from Sahih al-Bukhari or Sahih Muslim with hadith number'}
            </p>
          </div>
        )}
      </div>

      <div className="actions">
        <button
          className="quote-button"
          type="button"
          onClick={onNewQuote}
          disabled={loading}
        >
          {loading ? 'Loading...' : error ? 'Retry' : 'New Reflection'}
        </button>
      </div>

      <p className="footnote">
        This version intentionally excludes general quotes and unauthenticated sayings,
        and now uses a bundled local reference set for reliability.
      </p>
    </section>
  );
}

export default QuoteBox;
