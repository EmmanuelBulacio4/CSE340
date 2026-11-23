import db from "./db.js";

const getAllCategories = async () => {
  const query = `
        SELECT category_id, name
      FROM categories;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getCategoryById = async (category_id) => {
  const query = `
    SELECT
    category_id,
    name
    FROM categories
    WHERE category_id = $1;`;
  
  const result = await db.query(query, [category_id]);

  return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByProjectId = async (project_id) => {
  const query = `
    SELECT cat.category_id, cat.name
    FROM categories cat
    INNER JOIN project_categories pc
    ON pc.category_id = cat.category_id
    WHERE pc.project_id = $1
    ORDER BY cat.name;
  `;

  const result = await db.query(query, [project_id]);

  return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
  const query = `
    SELECT
    p.project_id,
    p.organization_id,
    p.p_title AS title,
    p.p_description AS description,
    p.p_location AS location,
    p.p_date AS date
    FROM projects p
    INNER JOIN project_categories pc
    ON pc.project_id = p.project_id
    WHERE pc.category_id = $1
    ORDER BY p.p_date;
  `;

  const result = await db.query(query, [categoryId]);

  return result.rows;
};

const assignCategoryToProject = async (categoryId, projectId) => {
  const query = `
    INSERT INTO project_categories (category_id, project_id)
    VALUES ($1, $2);
    `;

  await db.query(query, [categoryId, projectId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
  const deleteQuery = `
    DELETE FROM project_categories
    WHERE project_id = $1`;

  await db.query(deleteQuery, [projectId]);

  for (const categoryId of categoryIds) {
    await assignCategoryToProject(categoryId, projectId);
  }
};


export {
  getAllCategories,
  getCategoryById,
  getCategoriesByProjectId,
  getProjectsByCategoryId,
  updateCategoryAssignments,
};