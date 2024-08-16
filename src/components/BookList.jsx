import React from 'react';
import { useParams } from 'react-router-dom';

function BookDetails() {
  const { id } = useParams();

  return (
    <div>
      <h2>Book Details</h2>
      <p>Showing details for book with ID: {id}</p>
      {/* We'll add more details here later */}
    </div>
  );
}

export default BookDetails;