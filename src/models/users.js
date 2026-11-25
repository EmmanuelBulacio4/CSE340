import db from "./db.js";
import bcrypt from "bcrypt";

const createUser = async (name, email, passwordHash) => {
  const default_role = "user";
  const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
  const queryParams = [name, email, passwordHash, default_role];

  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Failed to create user");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new user with ID:", result.rows[0].user_id);
  }

  return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
  const query = `
        SELECT user_id, name, email, password_hash, role_id
        FROM users
        WHERE email = $1`;

  const queryParams = [email];

  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
};

const verifyPassword = async (password, password_hash) => {
  return bcrypt.compare(password, password_hash);
};

const authenticateUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) return null;
  if (!(await verifyPassword(password, user.password_hash))) {
    return null;
  }

  delete user.password_hash;
  return user;
};

export { createUser, authenticateUser };
