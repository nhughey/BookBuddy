const client = require("./client");

const getBooks = async () => {
  try {
    const SQL = `SELECT * FROM books`;
    const { rows } = await client.query(SQL);
    if (!rows) {
      throw new Error("No books found");
    }
    return rows;
  } catch (err) {
    throw err;  // Changed from res.send(err)
  }
};

const getBook = async (id) => {
  try {
    const SQL = `SELECT * FROM books WHERE id=$1`;
    const {
      rows: [book],
    } = await client.query(SQL, [id]);
    return book;
  } catch (err) {
    console.log(err);
  }
};

const createBook = async ({
  title,
  author,
  description,
  coverImage,
  available,
}) => {
  try {
    const SQL = `INSERT INTO books(title, author, description, coverImage, available) VALUES($1, $2, $3, $4, $5) RETURNING *`;
    const {
      rows: [book],
    } = await client.query(SQL, [
      title,
      author,
      description,
      coverImage ||
        "https://images.pexels.com/photos/7034646/pexels-photo-7034646.jpeg",
      available || true,
    ]);
    return book;
  } catch (err) {
    console.log(err);
  }
};

const deleteBook = async (id) => {
  try {
    const SQL = `DELETE FROM books WHERE id=$1 RETURNING *`;
    const {
      rows: [result],
    } = await client.query(SQL, [id]);

    return result;
  } catch (err) {
    console.log(err);
  }
};

const updateBook = async (id, available) => {
  try {
    const SQL = `UPDATE books SET available=$1 WHERE id=$2 RETURNING *`;
    const {
      rows: [book],
    } = await client.query(SQL, [available, id]);
    return book;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createBook, getBooks, getBook, deleteBook, updateBook };
