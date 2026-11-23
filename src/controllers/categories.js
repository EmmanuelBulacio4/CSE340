import {
  getAllCategories,
  getCategoryById,
  getCategoriesByProjectId,
  getProjectsByCategoryId,
  updateCategoryAssignments,
  createCategory,
  updateCategory,
} from "../models/categories.js";
import { getProjectDetails } from "../models/projects.js";
import { body, validationResult } from "express-validator";

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

const showNewCategoryForm = async (req, res) => {
  const title = "Add New Category";

  res.render("new-category", { title });
};

const categoryValidation = [
body('name')
  .trim()
  .notEmpty()
  .withMessage('Category name is required')
  .isLength({ min: 3, max: 150 })
  .withMessage('Category name must be between 3 and 150'),
];

const processNewCategoryForm = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    return res.redirect("/new-category");
  }

  const { name } = req.body;
  const categoryId = await createCategory(name);

  req.flash("success", "Category added successfully!");
  return res.redirect(`/category/${categoryId}`);
};

const showEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const categoryDetails = await getCategoryById(categoryId);
  const title = 'Edit Category';

  res.render('edit-category', { title, categoryDetails });
};

const processEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const name = req.body.name;

  await updateCategory(categoryId, name);

  req.flash('success', 'Category updated successfully!');
  res.redirect(`/category/${categoryId}`);
};


export {
  showCategoriesPage,
  showCategoryPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  showNewCategoryForm,
  categoryValidation,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
};