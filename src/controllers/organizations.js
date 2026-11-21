import {
  getAllOrganizations,
  getOrganizationDetails,
  createOrganization,
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

const showNewOrganizationForm = async (req, res) => {
  const title = "Add New Organization";

  res.render("new-organization", { title });
};

const showOrganizationDetailsPage = async (req, res) => {
  const organizationId = req.params.id;
  const organizationDetails = await getOrganizationDetails(organizationId);
  const projects = await getProjectsByOrganizationId(organizationId);
  const title = "Organization Details";

  res.render("organization", { title, organizationDetails, projects });
};

const processNewOrganizationForm = async (req, res) => {
  const { name, description, contactEmail } = req.body;
  const logoFilename = "placeholder-logo.png"; // Use the placeholder logo for all new organizations

  const organizationId = await createOrganization(
    name,
    description,
    contactEmail,
    logoFilename,
  );
  res.redirect(`/organization/${organizationId}`);
};

export {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm
};
