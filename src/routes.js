import express from 'express';

import { showHomePage } from "./controllers/index.js";
import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  organizationValidation,
  showEditOrganizationForm,
  processEditOrganizationForm,
} from "./controllers/organizations.js";
import {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation,
  showEditProjectForm,
  processEditProjectForm,
} from "./controllers/projects.js";

import {
  showCategoriesPage,
  showCategoryPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  showNewCategoryForm,
  categoryValidation,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
} from "./controllers/categories.js";

import { testErrorPage } from './controllers/errors.js';
import {
  showUserRegistrationForm,
  processUserRegistrationForm,
  userRegistrationValidation,
  showLoginForm,
  processLoginForm,
  processLogout, 
  requireLogin,
  showDashboard,
  requireRole,
} from "./controllers/users.js";

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get("/projects", showProjectsPage);
router.get('/categories', showCategoriesPage);
router.get('/test-error', testErrorPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get("/project/:id", showProjectDetailsPage);
router.get("/category/:id", showCategoryPage);
router.get("/new-organization", requireRole("admin"), showNewOrganizationForm);
router.post("/new-organization", requireRole('admin'),organizationValidation, processNewOrganizationForm);
router.get("/edit-organization/:id", requireRole('admin'), showEditOrganizationForm);
router.post("/edit-organization/:id", requireRole('admin'),organizationValidation, processEditOrganizationForm);
router.get("/new-project", requireRole("admin"), showNewProjectForm);
router.post("/new-project", requireRole('admin'), projectValidation, processNewProjectForm);
router.get("/assign-categories/:projectId", requireRole('admin'),showAssignCategoriesForm);
router.post("/assign-categories/:projectId", requireRole('admin'),processAssignCategoriesForm);
router.get("/edit-project/:id", requireRole("admin"), showEditProjectForm);
router.post("/edit-project/:id", requireRole('admin'),projectValidation, processEditProjectForm);
router.get("/new-category", requireRole("admin"), showNewCategoryForm);
router.post('/new-category', requireRole('admin'),categoryValidation, processNewCategoryForm);
router.get("/edit-category/:id", requireRole("admin"), showEditCategoryForm);
router.post("/edit-category/:id", requireRole('admin'),categoryValidation, processEditCategoryForm);
router.get("/register", showUserRegistrationForm);
router.post("/register", userRegistrationValidation, processUserRegistrationForm);
router.get('/login', showLoginForm);
router.post("/login", processLoginForm);
router.get("/logout", processLogout);
router.get('/dashboard', requireLogin, showDashboard);

export default router;