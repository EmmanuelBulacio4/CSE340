import db from "./db.js";

const getAllCategories = async () => {
  const query = `
        SELECT category_id, name
      FROM categories;
    `;

  const result = await db.query(query);

  return result.rows;
};

export { getAllCategories };
