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

const getProjectByOrganizationId = async (organizationId) => {
  const query = `
  SELECT
    project_id,
    organization_id,
    p_title,
    p_description,
    p_location,
    p_date
    FROM projects
    WHERE organization_id = $1
    ORDER BY p_date`;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  return result.rows;
};


export { getAllProjects, getProjectByOrganizationId };
