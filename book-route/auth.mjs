import { Router } from "express";
import bcrypt from "bcrypt";
import connectionPool from "../utils/db.mjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const authRouter = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - firstname
 *               - lastname
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: secret123
 *               firstname:
 *                 type: string
 *                 example: John
 *               lastname:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Username already exists
 *       500:
 *         description: Server error
 */


authRouter.post('/register', async (req, res) => {
  const { username, password, firstname, lastname, email } = req.body;

  if (!username || !password || !firstname || !lastname || !email) {
    return res.status(400).json({ error: 'All fields (username, password, firstname, lastname, email) are required' });
  }

  try {
    const checkUser = await connectionPool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (checkUser.rows.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await connectionPool.query(
      'INSERT INTO users (username, email, password, firstname, lastname) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, email, hashedPassword, firstname, lastname]
    );

    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successfully
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6...
 *                 user:
 *                   type: object
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Signing token with secret:", process.env.SECRET_KEY);
  try {
    const result = await connectionPool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Password is not invalid" });
    }

    // ✅ สร้าง token
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successfully",
      token, // ✅ ส่งกลับไปให้ Postman
      user,
    });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


export default authRouter