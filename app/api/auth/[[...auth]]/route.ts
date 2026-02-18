/**
 * @swagger
 * /api/auth/sign-up/email:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user with email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               name: { type: string }
 *     responses:
 *       200:
 *         description: User registered successfully
 *
 * /api/auth/sign-in/email:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 *
 * /api/auth/get-session:
 *   get:
 *     tags: [Auth]
 *     summary: Get current session details
 *     responses:
 *       200:
 *         description: Session data retrieved
 *       401:
 *         description: Not authenticated
 *
 * /api/auth/sign-out:
 *   post:
 *     tags: [Auth]
 *     summary: Logout current user
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
import { auth } from "@infrastructure/better-auth/auth";

export const GET = auth.handler;
export const POST = auth.handler;
