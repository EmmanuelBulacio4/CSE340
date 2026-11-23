import {
  getAllCategories,
  getCategoryById,
  getCategoriesByProjectId,
  getProjectsByCategoryId,
  updateCategoryAssignments,
} from "../models/categories.js";
import { getProjectDetails } from "../models/projects.js";

const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();

  const title = "Categories";
  res.render("categories", { title, categories });
};

const showCategoryPage = async (req, res) => {
  const categoryId = req.params.id;
  const categoryDetails = await getCategoryById(categoryId);

  if (!categoryDetails) {
    const error = new Error("Category not found");
    error.status = 404;
    throw error;
  }

  const projects = await getProjectsByCategoryId(categoryId);

  const title = "Category Details";

  res.render("category", { title, categoryDetails, projects });
};

const showAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;
  const [projectDetails, categories, assignedCategories] = await Promise.all([
    getProjectDetails(projectId),
    getAllCategories(),
    getCategoriesByProjectId(projectId),
  ]);

  if (!projectDetails) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  const title = "Assign Categories";

  res.render("assign-categories", {
    title,
    projectId,
    projectDetails,
    categories,
    assignedCategories,
  });
};

const processAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;
  const selectedCategoryIds = req.body.categoryIds || [];

  const categoryIdsArray = Array.isArray(selectedCategoryIds)
    ? selectedCategoryIds
    : [selectedCategoryIds];
  await updateCategoryAssignments(projectId, categoryIdsArray);
  req.flash("success", "Categories updated successfully.");
  res.redirect(`/project/${projectId}`);
};

export {
  showCategoriesPage,
  showCategoryPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
};