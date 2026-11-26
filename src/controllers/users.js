import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import { createUser, authenticateUser } from "../models/users.js";

const userRegistrationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required!")
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be between 3 and 100 characters!"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Please enter a valid email!")
    .isLength({ max: 100 })
    .withMessage("Email must be 100 characters or fewer!")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 5, max: 72 })
    .withMessage("Password must be between 8 and 72 characters!"),
];

const showUserRegistrationForm = async (req, res) => {
  const title = "Create New User";

  res.render("register", { title });
};

const processUserRegistrationForm = async (req, res) => {
  const results = validationResult(req);
  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect("/register");
  }

  const { name, email, password } = req.body;

  try {
    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the user in the database
    const userId = await createUser(name, email, passwordHash);

    // Redirect to the home page after successful registration
    req.flash("success", "Registration successful! Please log in.");
    res.redirect("/");
  } catch (error) {
    console.error("Error registering user:", error);
    const message =
      error.code === "23505"
        ? "A user with that email already exists."
        : "An error occurred during registration. Please try again.";
    req.flash("error", message);
    res.redirect("/register");
  }
};

const showLoginForm = async (req, res) => {
  const title = "Login";

  res.render("login", { title });
};

const processLoginForm = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);
    if (user) {
      req.session.user = user;
      req.flash("success", "Login successful!");

      if (res.locals.NODE_ENV === "development") {
        console.log("User logged in:", user);
      }
      res.redirect("/dashboard");
    } else {
      req.flash("error", "Invalid email or password.");
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error during login:", error);
    req.flash("error", "An error occurred during login. Please try again.");
    res.redirect("/login");
  }
};

const processLogout = async (req, res) => {
  if (req.session.user) {
    delete req.session.user;
  }

  req.flash("seccess", "Logout succesfully");
  res.redirect("/login");
};

const requireLogin = async (req, res, next) => {
  if (!req.session.user || !req.session) {
    req.flash('error', 'You need to be logged!');
    return res.redirect('/login');
  } 
    next()
};

const showDashboard = async (req, res) => {
  const user = req.session.user;

  res.render('dashboard', {
    title: 'Dashboard',
    name: user.name,
    email: user.email
  });
};

const requireRole = (role) => {  //aqui va el rol necesario
  return (req, res, next) => {
    // Check if user is logged in first
    if (!req.session || !req.session.user) {
      req.flash("error", "You must be logged in to access this page.");
      return res.redirect("/login");
    }

    // Check if user's role matches the required role
    if (req.session.user.role_name !== role) {
      req.flash("error", "You do not have permission to access this page.");
      return res.redirect("/");
    }

    next();
  };
};

export {
  showUserRegistrationForm,
  processUserRegistrationForm,
  userRegistrationValidation,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  showDashboard,
  requireRole,
};
