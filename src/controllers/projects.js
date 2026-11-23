import { getCategoriesByProjectId } from "../models/categories.js";
import {
  getUpcomingProjects,
  getProjectDetails,
  createNewProject,
  updateProject,
} from "../models/projects.js";
import { getAllOrganizations } from "../models/organizations.js"
import { body, validationResult } from 'express-validator';

const projectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required!")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters!"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required!")
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters!"),
  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required!")
    .isLength({ max: 155 })
    .withMessage("Location must be less than 155 characters!"),
  body("date")
    .notEmpty()
    .withMessage("Date is required!")
    .isISO8601()
    .withMessage("Date must be a valid date format!"),
  body("organizationId")
    .notEmpty()
    .withMessage("Organization is required!")
    .isInt()
    .withMessage("Organization must be a valid integer!"),
];

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

  const categories = await getCategoriesByProjectId(projectId);
  const title = "Project Details";
  res.render("project", { title, project, categories });
};

const showNewProjectForm = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = 'Create a Service Project';

  res.render('new-project', { title, organizations })
};

const processNewProjectForm = async(req, res) => {
  const { title, description, location, date, organizationId } = req.body;

  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Loop through validation errors and flash them
      errors.array().forEach((error) => {
        req.flash("error", error.msg);
      });

      // Redirect back to the new project form
      return res.redirect("/new-project");
    }
    // Create the new project in the database
    const newProjectId = await createNewProject(
      title,
      description,
      location,
      date,
      organizationId,
    );

    req.flash("success", "New service project created successfully!");
    res.redirect(`/project/${newProjectId}`);
  } catch (error) {
    console.error("Error creating new project:", error);
    req.flash("error", "There was an error creating the service project.");
    res.redirect("/new-project");
  }
};

const showEditProjectForm = async (req, res) => {
  const projectId = req.params.id;
  const projectDetails = await getProjectDetails(projectId);

  if (!projectDetails) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  const organizations = await getAllOrganizations();

  const title = "Edit project";
  res.render("edit-project", { title, projectDetails, organizations });
};

const processEditProjectForm = async (req, res) => {
  const projectId = req.params.id;
  const { title, description, location, date, organizationId } = req.body;

  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    // Redirect back to the edit project form
    return res.redirect("/edit-project/" + req.params.id);
  }

  await updateProject(
    projectId,
    title,
    description,
    location,
    date,
    organizationId
  );
  req.flash("success", "Project updated successfully!");

  res.redirect(`/project/${projectId}`);
};


export {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation,
  showEditProjectForm,
  processEditProjectForm,
};