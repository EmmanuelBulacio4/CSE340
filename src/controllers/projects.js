import {
  getUpcomingProjects,
  getProjectDetails,
} from "../models/projects.js";


const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
  const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
  console.log(projects);

  const title = "Upcoming Service Projects";
  res.render("projects", { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
  const projectId = req.params.id;
  const project = await getProjectDetails(projectId);

  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  const title = "Project Details";
  res.render("project", { title, project });
};

export {
  showProjectsPage,
  showProjectDetailsPage
};
