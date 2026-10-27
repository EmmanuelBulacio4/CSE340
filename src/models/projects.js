import db from "./db.js";

const getAllProjects = async () => {
  const query = `
        SELECT org.name,
            prj.p_title,
            prj.p_description,
            prj.p_location,
            prj.p_date
	FROM organizations org
	INNER JOIN projects prj ON org.organization_id = prj.organization_id;
    `;

  const result = await db.query(query);

  return result.rows;
};

export { getAllProjects };
