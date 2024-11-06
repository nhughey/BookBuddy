// client/src/pages/Books.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Books() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    coverimage: '', // Changed to match database field name
    available: true
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    } catch (error) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/books');
      const data = await response.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    }
  };

  const handleReserve = async (bookId) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/books/${bookId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ available: false })
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          navigate('/login');
          return;
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to reserve book');
      }

      fetchBooks();
      alert('Book reserved successfully!');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newBook,
          coverimage: newBook.coverimage || 'https://images.pexels.com/photos/7034646/pexels-photo-7034646.jpeg'
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          navigate('/login');
          return;
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to add book');
      }

      setNewBook({
        title: '',
        author: '',
        description: '',
        coverimage: '',
        available: true
      });
      setIsAdding(false);
      fetchBooks();
      alert('Book added successfully!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Available Books</h2>
        {isLoggedIn && (
          <button 
            onClick={() => setIsAdding(!isAdding)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isAdding ? 'Cancel' : 'Add New Book'}
          </button>
        )}
      </div>

      {isAdding && isLoggedIn && (
        <form onSubmit={handleAddBook} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'grid', gap: '10px', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Title"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              required
              style={{ padding: '8px' }}
            />
            <input
              type="text"
              placeholder="Author"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              required
              style={{ padding: '8px' }}
            />
            <textarea
              placeholder="Description"
              value={newBook.description}
              onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
              required
              style={{ padding: '8px', minHeight: '100px' }}
            />
            <input
              type="url"
              placeholder="Cover Image URL"
              value={newBook.coverimage}
              onChange={(e) => setNewBook({ ...newBook, coverimage: e.target.value })}
              style={{ padding: '8px' }}
            />
            <button type="submit" style={{
              padding: '8px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Add Book
            </button>
          </div>
        </form>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '20px' 
      }}>
        {books.map(book => (
          <div key={book.id} style={{
            border: '1px solid #ddd',
            padding: '15px',
            borderRadius: '8px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: book.available ? '#28a745' : '#dc3545',
              color: 'white',
              fontSize: '12px',
              zIndex: 1
            }}>
              {book.available ? 'Available' : 'Reserved'}
            </div>

            <div style={{ flex: 1 }}>
              <img 
                src={book.coverimage || 'https://images.pexels.com/photos/7034646/pexels-photo-7034646.jpeg'}
                alt={book.title}
                style={{ 
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  marginBottom: '15px'
                }}
              />

              <h3 style={{ margin: '10px 0', fontSize: '1.2rem', color: '#2c3e50' }}>{book.title}</h3>
              <p style={{ color: '#666', marginBottom: '10px' }}><strong>Author:</strong> {book.author}</p>
              <p style={{ 
                margin: '10px 0', 
                color: '#666',
                fontSize: '0.9rem',
                lineHeight: '1.5'
              }}>{book.description}</p>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '15px' }}>
              {isLoggedIn && book.available ? (
                <button
                  onClick={() => handleReserve(book.id)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#0066cc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Reserve
                </button>
              ) : !isLoggedIn && book.available ? (
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Login to Reserve
                </button>
              ) : (
                <p style={{ 
                  textAlign: 'center', 
                  color: '#666', 
                  backgroundColor: '#f5f5f5',
                  padding: '8px',
                  borderRadius: '4px',
                  margin: '0'
                }}>
                  Not Available
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Books;