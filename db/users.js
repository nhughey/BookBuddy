const client = require("./client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

const createUser = async ({ firstname, lastname, email, password }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    const SQL = `
      INSERT INTO users(firstname, lastname, email, password) 
      VALUES($1, $2, $3, $4) 
      RETURNING id, firstname, lastname, email
    `;
    const { rows: [user] } = await client.query(SQL, [
      firstname,
      lastname,
      email,
      hashedPassword,
    ]);

    return user;
  } catch (err) {
    throw err; // Changed from console.log to throw
  }
};

const getUserByEmail = async (email) => {
  try {
    const SQL = `SELECT * FROM users WHERE email=$1`;
    const {
      rows: [user],
    } = await client.query(SQL, [email]);

    return user;
  } catch (err) {
    console.log(err);
  }
};

const getUser = async ({ email, password }) => {
  try {
    const SQL = `SELECT * FROM users WHERE email=$1`;
    const { rows: [user] } = await client.query(SQL, [email]);
    
    if (!user) return null;

    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    
    if (!passwordsMatch) return null;
    
    delete user.password;
    return user;
  } catch (err) {
    throw err;
  }
};

const getUserById = async (id) => {
  try {
    const SQL = `SELECT * FROM users WHERE id=$1`;
    const {
      rows: [user],
    } = await client.query(SQL, [id]);
    delete user.password;
    return user;
  } catch (err) {
    console.log(err);
  }
};

const getUsers = async () => {
  try {
    const SQL = `SELECT * FROM users`;
    const { rows } = await client.query(SQL);
    return rows;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createUser, getUserByEmail, getUserById, getUsers, getUser };
