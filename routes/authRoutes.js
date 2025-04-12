const { signin } = require('../controllers/auth');
const express = require('express');
const router = express.Router();
const { signinValidator } = require('../schema/auth');
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Sign in a user
 *     description: Allows a user to sign in with their email and password to obtain a JWT token for authentication.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully signed in and received JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sign-in successful
 *                 token:
 *                   type: string
 *                   description: The JWT token used for authenticating subsequent requests.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid credentials or missing fields (email or password).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid credentials. User not found."
 *       500:
 *         description: Server error during sign-in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error during sign-in. Please try again later."
 */

router.post('/login', signinValidator, signin);

module.exports = router;
