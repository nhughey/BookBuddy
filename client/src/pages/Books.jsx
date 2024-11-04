// client/src/pages/Books.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Books() {
  // State Management
  const [books, setBooks] = useState([]); // Stores all books
  const [newBook, setNewBook] = useState({ title: '', author: '', description: '' }); // Form data for new book
  const [isAdding, setIsAdding] = useState(false); // Controls new book form visibility
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Get auth token

  // Fetch books when component mounts
  useEffect(() => {
    fetchBooks();
  }, []);

  // API Calls
  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  // Handle book reservation
  const handleReserve = async (bookId) => {
    // Redirect to login if not authenticated
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/books/${bookId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ available: false })
      });

      if (response.ok) {
        fetchBooks(); // Refresh book list after reservation
        alert('Book reserved successfully!');
      } else {
        throw new Error('Failed to reserve book');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle adding new book
  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newBook)
      });

      if (response.ok) {
        // Reset form and refresh books list
        setNewBook({ title: '', author: '', description: '' });
        setIsAdding(false);
        fetchBooks();
        alert('Book added successfully!');
      } else {
        throw new Error('Failed to add book');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Available Books</h2>
        {/* Show Add Book button only if user is logged in */}
        {token && (
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

      {/* Add New Book Form */}
      {isAdding && (
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

      {/* Books Grid Display */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px' 
      }}>
        {books.map(book => (
          <div key={book.id} style={{
            border: '1px solid #ddd',
            padding: '15px',
            borderRadius: '8px'
          }}>
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p>{book.description}</p>
            {book.available ? (
              <button
                onClick={() => handleReserve(book.id)}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: book.available ? '#0066cc' : '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: book.available ? 'pointer' : 'not-allowed'
                }}
                disabled={!book.available}
              >
                {book.available ? 'Reserve' : 'Not Available'}
              </button>
            ) : (
              <p style={{ color: '#666', textAlign: 'center' }}>Not Available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Books;