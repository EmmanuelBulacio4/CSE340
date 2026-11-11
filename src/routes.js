import express from 'express';

import { showHomePage } from "./controllers/index.js";
import { showOrganizationsPage, showOrganizationDetailsPage } from './controllers/organizations.js';
import {
    showProjectsPage,
    showProjectDetailsPage
} from './controllers/projects.js';

import { showCategoriesPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get("/projects", showProjectsPage);
router.get('/categories', showCategoriesPage);
router.get('/test-error', testErrorPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get("/project/:id", showProjectDetailsPage);

export default router;