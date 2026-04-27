import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

const escapeHtml = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const markdownToHtml = (text) => {
  let escaped = escapeHtml(text);
  escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
  escaped = escaped.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  escaped = escaped.replace(/\n/g, '<br>');
  return escaped;
};

const getFirstLine = (content) => {
  return content.split('\n')[0];
};

const formatDate = (timestamp) => {
  if (!timestamp) {
    return 'Just now';
  }

  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const getWordCount = (text) => {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
};

const NoteSidebar = ({
  notes,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
  searchQuery,
  onSearchChange,
  onAddNote,
}) => {
  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query)
    );
  });

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div>
          <p className="eyebrow">Writing space</p>
          <h1>Notes</h1>
        </div>
        <button className="new-note-btn" onClick={onAddNote}>
          New note
        </button>
      </div>

      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search by title or content"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          className="search-input"
        />
      </div>

      <div className="sidebar-summary">
        <div className="summary-pill">
          <span>Total</span>
          <strong>{notes.length}</strong>
        </div>
        <div className="summary-pill">
          <span>Visible</span>
          <strong>{filteredNotes.length}</strong>
        </div>
      </div>

      <div className="notes-list">
        {filteredNotes.length === 0 && (
          <div className="no-notes">No notes match your search.</div>
        )}

        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className={`note-item ${selectedNoteId === note.id ? 'active' : ''}`}
            onClick={() => onSelectNote(note.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onSelectNote(note.id)
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className="note-item-body">
              <div className="note-item-top">
                <div className="note-title">{note.title || 'Untitled'}</div>
                <span className="note-time">{formatDate(note.updatedAt || note.createdAt)}</span>
              </div>
              <div className="note-preview">{getFirstLine(note.content) || 'No content yet'}</div>
              <div className="note-meta">
                <span>{getWordCount(note.content)} words</span>
              </div>
            </div>
            <span
              className="delete-note-btn"
              onClick={(event) => {
                event.stopPropagation();
                onDeleteNote(note.id);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  event.stopPropagation();
                  onDeleteNote(note.id);
                }
              }}
            >
              Delete
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};

const NoteEditor = ({ note, onUpdateNote, onDeleteNote }) => {
  const [previewMode, setPreviewMode] = useState(false);

  const stats = useMemo(() => {
    if (!note) {
      return { words: 0, lines: 0 };
    }

    return {
      words: getWordCount(note.content),
      lines: note.content ? note.content.split('\n').length : 0,
    };
  }, [note]);

  if (!note) {
    return (
      <section className="editor-placeholder">
        <div className="placeholder-card">
          <p className="eyebrow">Nothing selected</p>
          <h2>Pick a note from the left or create a new one.</h2>
          <p>Your notes are stored locally in the browser, so this stays simple and beginner-friendly.</p>
        </div>
      </section>
    );
  }

  const handleTitleChange = (event) => {
    onUpdateNote({ ...note, title: event.target.value });
  };

  const handleContentChange = (event) => {
    onUpdateNote({ ...note, content: event.target.value });
  };

  return (
    <main className="editor-shell">
      <div className="editor-header">
        <div className="editor-heading">
          <p className="eyebrow">Current note</p>
          <input
            type="text"
            value={note.title}
            onChange={handleTitleChange}
            placeholder="Untitled note"
            className="title-input"
          />
          <p className="editor-date">Updated {formatDate(note.updatedAt || note.createdAt)}</p>
        </div>

        <div className="editor-actions">
          <button className="preview-toggle" onClick={() => setPreviewMode((value) => !value)}>
            {previewMode ? 'Back to edit' : 'Preview'}
          </button>
          <button className="delete-btn" onClick={() => onDeleteNote(note.id)}>
            Delete note
          </button>
        </div>
      </div>

      <div className="editor-stats">
        <div className="stat-chip">
          <span>Words</span>
          <strong>{stats.words}</strong>
        </div>
        <div className="stat-chip">
          <span>Lines</span>
          <strong>{stats.lines}</strong>
        </div>
      </div>

      {previewMode ? (
        <div
          className="markdown-preview"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(note.content || 'Nothing to preview yet.') }}
        />
      ) : (
        <textarea
          value={note.content}
          onChange={handleContentChange}
          placeholder="Write your note here. You can use **bold**, *italic*, and [links](https://example.com)."
          className="content-textarea"
        />
      )}

      {!previewMode && (
        <div className="markdown-hint">
          Supports simple markdown: bold, italic, links, and line breaks.
        </div>
      )}
    </main>
  );
};

const App = () => {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes-app');

    if (!savedNotes) {
      return;
    }

    try {
      const parsed = JSON.parse(savedNotes);
      setNotes(parsed);

      if (parsed.length > 0) {
        setSelectedNoteId(parsed[0].id);
      }
    } catch (error) {
      console.error('Could not read saved notes.', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes-app', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const timestamp = Date.now();
    const newNote = {
      id: timestamp,
      title: 'Untitled',
      content: '',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
  };

  const updateNote = (updatedNote) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === updatedNote.id ? { ...updatedNote, updatedAt: Date.now() } : note
      )
    );
  };

  const deleteNote = (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    const remaining = notes.filter((note) => note.id !== id);
    setNotes(remaining);

    if (selectedNoteId === id) {
      setSelectedNoteId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const selectedNote = notes.find((note) => note.id === selectedNoteId) || null;

  return (
    <div className="app-shell">
      <div className="app-container">
        <NoteSidebar
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
          onDeleteNote={deleteNote}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddNote={addNote}
        />
        <NoteEditor note={selectedNote} onUpdateNote={updateNote} onDeleteNote={deleteNote} />
      </div>
    </div>
  );
};

export default App;
