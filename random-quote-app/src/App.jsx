import { useEffect, useState } from 'react';
import './App.css';
import QuoteBox from './components/QuoteBox.jsx';
import { hadithReflections, quranReflections } from './data/islamicReflections.js';

const gradients = [
  'linear-gradient(135deg, #f8f0de 0%, #dceee0 52%, #d6e6ee 100%)',
  'linear-gradient(135deg, #efe6d6 0%, #d6eadf 48%, #d9edf2 100%)',
  'linear-gradient(135deg, #f6ecdc 0%, #e2efe4 55%, #d7e4f4 100%)',
  'linear-gradient(135deg, #f7ead4 0%, #dcefd9 50%, #d2e6ea 100%)',
];

const hadithBooks = [
  { id: 'bukhari', label: 'Sahih al-Bukhari', max: hadithReflections.bukhari.length },
  { id: 'muslim', label: 'Sahih Muslim', max: hadithReflections.muslim.length },
];

const quranStats = { total: quranReflections.length, label: 'Bundled Ayat' };

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [background, setBackground] = useState(gradients[0]);
  const [contentType, setContentType] = useState('quran');
  const [hadithBook, setHadithBook] = useState('bukhari');
  const [entry, setEntry] = useState({
    type: 'quran',
    arabicText: '',
    text: '',
    sourceLabel: '',
    sourceMeta: '',
    collectionLabel: '',
    badge: '',
  });

  const activeHadithBook =
    hadithBooks.find((book) => book.id === hadithBook) || hadithBooks[0];

  const updateBackground = () => {
    setBackground(gradients[Math.floor(Math.random() * gradients.length)]);
  };

  const pickRandomEntry = (pool, currentEntry) => {
    if (!pool.length) {
      throw new Error('Reflection pool is empty.');
    }

    let nextEntry = pool[Math.floor(Math.random() * pool.length)];

    if (pool.length > 1) {
      while (
        nextEntry.sourceMeta === currentEntry.sourceMeta &&
        nextEntry.text === currentEntry.text
      ) {
        nextEntry = pool[Math.floor(Math.random() * pool.length)];
      }
    }

    return nextEntry;
  };

  const fetchEntry = async (nextType = contentType, nextBook = activeHadithBook) => {
    setLoading(true);
    setError(null);

    try {
      const pool =
        nextType === 'quran' ? quranReflections : hadithReflections[nextBook.id] || [];

      const nextEntry = pickRandomEntry(pool, entry);

      setEntry(nextEntry);
      updateBackground();
    } catch (fetchError) {
      setError(
        'We could not load an Islamic reflection right now. Please try again in a moment.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntry('quran', activeHadithBook);
  }, []);

  const handleTypeChange = (nextType) => {
    setContentType(nextType);
    fetchEntry(nextType, activeHadithBook);
  };

  const handleBookChange = (nextBookId) => {
    setHadithBook(nextBookId);
    const nextBook = hadithBooks.find((book) => book.id === nextBookId) || hadithBooks[0];

    if (contentType === 'hadith') {
      fetchEntry('hadith', nextBook);
    }
  };

  const handleNewEntry = () => {
    fetchEntry(contentType, activeHadithBook);
  };

  const activePoolSize = contentType === 'quran' ? quranStats.total : activeHadithBook.max;
  const activePoolLabel =
    contentType === 'quran' ? quranStats.label : `${activeHadithBook.label} Hadith`;

  return (
    <main className="app-shell" style={{ backgroundImage: background }}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="pattern-grid" aria-hidden="true" />

      <QuoteBox
        entry={entry}
        loading={loading}
        error={error}
        contentType={contentType}
        hadithBook={hadithBook}
        hadithBooks={hadithBooks}
        activePoolSize={activePoolSize}
        activePoolLabel={activePoolLabel}
        onNewQuote={handleNewEntry}
        onContentTypeChange={handleTypeChange}
        onHadithBookChange={handleBookChange}
      />
    </main>
  );
}

export default App;
