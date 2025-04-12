const { User, Agency, sequelize } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { blacklistToken } = require("../config/redis");
const createError = require("../utils/errorHandler");

const validateFields = (fields, data) => {
  const missingFields = fields.filter(field => !data[field]);
  return missingFields.length ? `Missing fields: ${missingFields.join(", ")}` : null;
};

const generateToken = (user) => {
  if (!process.env.SECRET) throw new Error("JWT Secret is not set.");
  return jwt.sign({ id: user.id, type: user.type }, process.env.SECRET, { expiresIn: "7d" });
};

const createUser = async (userData) => {
  return await User.create(userData);
};

const createAgency = async (agencyData) => {
  return await Agency.create(agencyData);
};

exports.signUp = async (req, res, next) => {
  const { type, password, confirm_password, preferences, ...rest } = req.body;

  try {
    if (!["client", "agency"].includes(type)) {
      return res.status(400).json({ message: "Invalid user type. Choose either 'client' or 'agency'." });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (type === "client") {
      const requiredFields = ["first_name", "last_name", "email", "phone_number", "age", "gender", "terms_accepted"];
      const missingFields = requiredFields.filter(field => !rest[field]);
      if (missingFields.length) {
        return res.status(400).json({ message: `Missing fields: ${missingFields.join(", ")}` });
      }

      const existingUser = await User.findOne({ where: { email: rest.email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use." });
      }

      const newUser = await createUser({ ...rest, password: hashedPassword, type, preferences });
      const token = generateToken(newUser);

      return res.status(201).json({ user: { id: newUser.id, email: newUser.email, type }, agency: null, token });
    }

    if (type === "agency") {
      const requiredFields = ["agency_name", "agency_email", "agency_phone", "address"];
      const missingFields = requiredFields.filter(field => !rest[field]);
      if (missingFields.length) {
        return res.status(400).json({ message: `Missing fields: ${missingFields.join(", ")}` });
      }

      const existingAgency = await Agency.findOne({ where: { agency_email: rest.agency_email } });
      if (existingAgency) {
        return res.status(400).json({ message: "Agency email is already in use." });
      }

      const result = await sequelize.transaction(async (transaction) => {
        const newUser = await createUser({ ...rest, password: hashedPassword, type, first_name: "Agency", last_name: "Account" }, { transaction });
        const agency = await createAgency({ user_id: newUser.id,is_approved: false, ...rest }, { transaction });
        return { newUser, agency };
      });

      const token = generateToken(result.newUser);
      return res.status(201).json({
        user: { id: result.newUser.id, email: result.newUser.email, type: result.newUser.type },
        agency: result.agency,
        token
      });
    }
  } catch (error) {
    console.error("Sign-up error:", error);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    let agency = null;
    if (user.type === "agency") {
      agency = await Agency.findOne({ where: { user_id: user.id } });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = generateToken(user);

    res.status(200).json({ message: "Sign-in successful", token });
  } catch (error) {
    console.error("Sign-in error:", error);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.getCurrentClient = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: req.user.type === "agency" ? [{ model: Agency }] : [],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user.toJSON());
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const expiresIn = 7 * 24 * 60 * 60;
    await blacklistToken(token, expiresIn);

    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

exports.googleCallback = (req, res) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user) {
      console.error("Google authentication failed", err);
      return res.status(400).json({ message: "Google authentication failed", error: err });
    }
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, type: user.type } });
  })(req, res);
};

exports.facebookAuth = passport.authenticate("facebook", { scope: ["email"] });

exports.facebookCallback = (req, res) => {
  passport.authenticate("facebook", { session: false }, (err, user) => {
    if (err || !user) {
      console.error("Facebook authentication failed", err);
      return res.status(400).json({ message: "Facebook authentication failed", error: err });
    }
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, type: user.type } });
  })(req, res);
};
