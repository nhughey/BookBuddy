const client = require("./client");

const createReservation = async ({ userId, booksId }) => {
  try {
    const SQL = `INSERT INTO reservations(userid, bookid) VALUES($1, $2) RETURNING *`;
    const {
      rows: [result],
    } = await client.query(SQL, [userId, booksId]);
    return result;
  } catch (err) {
    throw err;
  }
};

const getReservation = async (id) => {
  try {
    const SQL = `SELECT * FROM reservations WHERE id=$1`;
    const {
      rows: [result],
    } = await client.query(SQL, [id]);
    return result;
  } catch (err) {
    throw err;
  }
};

const getUsersReservations = async (userId) => {
  try {
    const SQL = `SELECT reservations.id, books.title, books.description, books.coverimage, books.author FROM
    reservations JOIN books ON reservations.bookid = books.id AND userid=$1`;

    const { rows } = await client.query(SQL, [userId]);
    if (!rows) return;
    console.log(rows);
    return rows;
  } catch (err) {
    throw err;
  }
};

const deleteReservation = async (id) => {
  try {
    const SQL = `DELETE FROM reservations WHERE id=$1 RETURNING *`;
    const {
      rows: [result],
    } = await client.query(SQL, [id]);
    console.log(result);
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createReservation,
  getReservation,
  getUsersReservations,
  deleteReservation,
};
