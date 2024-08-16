import React from 'react';
import { useParams } from 'react-router-dom';

function BookDetails() {
  const { id } = useParams();

  return (
    <div>
      <h2>Book Details</h2>
      <p>Showing details for book with ID: {id}</p>
      {/*add details here */}
    </div>
  );
}

export default BookDetails;