import {
  getAllOrganizations,
  getOrganizationDetails,
} from "../models/organizations.js";
import {
  getAllProjects,
  getProjectsByOrganizationId,
} from "../models/projects.js";

const showOrganizationsPage = async (req, res) => {
  const [organizations, projects] = await Promise.all([
    getAllOrganizations(),
    getAllProjects(),
  ]);
  const projectsByOrganizationId = new Map();

  for (const project of projects) {
    const organizationProjects =
      projectsByOrganizationId.get(project.organization_id) ?? [];
    organizationProjects.push(project);
    projectsByOrganizationId.set(project.organization_id, organizationProjects);
  }

  for (const organization of organizations) {
    organization.projects =
      projectsByOrganizationId.get(organization.organization_id) ?? [];
  }

  const title = "Our Partner Organizations";

  res.render("organizations", { title, organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
  const organizationId = req.params.id;
  const organizationDetails = await getOrganizationDetails(organizationId);
  const projects = await getProjectsByOrganizationId(organizationId);
  const title = "Organization Details";

  res.render("organization", { title, organizationDetails, projects });
};

export { showOrganizationsPage, showOrganizationDetailsPage };
