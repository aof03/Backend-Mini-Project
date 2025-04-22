/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management endpoints
 */

import express from 'express';
import { authenticateToken, validateCreateBookData } from '../middleware/book.validation.mjs';
import connectionPool from '../utils/db.mjs';
import dotenv from "dotenv";


export const booksRouter = express.Router();

dotenv.config();

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - description
 *               - category_id
 *               - book_name
 *             properties:
 *               title:
 *                 type: string
 *               book_name:
 *                 type: string
 *                 description: ชื่อหนังสือแบบเต็มหรือชื่อภาษาไทย
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *               category_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Book created successfully
 */


// Create Book
booksRouter.post("/", authenticateToken, [validateCreateBookData], async (req, res) => {
  try {
    const userId = req.user.user_id;
    const newBook = {
      ...req.body,
      user_id: userId, // เพิ่ม user_id ที่ได้จาก token
      published_date: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await connectionPool.query(
      `INSERT INTO books 
        (user_id, title, author, description, published_date, category_id, created_at, updated_at)         
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8 )
       RETURNING *`,
      [
        newBook.user_id,
        newBook.book_name,
        newBook.title,
        newBook.author,
        newBook.description,
        newBook.published_date,
        newBook.category_id,
        newBook.created_at,
        newBook.updated_at
      ]
    );

    res.status(201).json({
      message: "Book created successfully",
      book: result.rows[0],
    });
  } catch (error) {
    console.error("Error inserting book:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books (with optional filters)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author's name
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Search by title
 *       - in: query
 *         name: book_name
 *         schema:
 *           type: string
 *         description: Search by book name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: The list of books
 */

// Get Book by ID
booksRouter.get("/:bookId", authenticateToken, async (req, res) => {
  const bookId = req.params.bookId;
  try {
    const result = await connectionPool.query("SELECT * FROM books WHERE book_id = $1", [bookId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json({
      message: "Book retrieved successfully",
      book: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /books/{bookId}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the book
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *       404:
 *         description: Book not found
 */
// Filter books
booksRouter.get("/", authenticateToken, async (req, res) => {
  try {
    const { author, category_id, title, page = 1, limit = 10 } = req.query;

    let query = "SELECT * FROM books";
    const conditions = [];
    const values = [];

    // Filter: author
    if (author) {
      conditions.push(`author ILIKE $${values.length + 1}`);
      values.push(`%${author}%`);
    }

    // Filter: category_id
    if (category_id) {
      conditions.push(`category_id = $${values.length + 1}`);
      values.push(category_id);
    }

    // Search: title
    if (title) {
      conditions.push(`title ILIKE $${values.length + 1}`);
      values.push(`%${title}%`);
    }

    // Add WHERE clause if needed
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Pagination: OFFSET + LIMIT
    const offset = (page - 1) * limit;
    query += ` ORDER BY book_id DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const result = await connectionPool.query(query, values);
    res.status(200).json(result.rows);

  } catch (error) {
    console.error("Error getting books:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /books/{bookId}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the book to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - description
 *               - category_id
 *               - book_name    
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               book_name:       
 *                 type: string
 *     responses:
 *       200: 
 *         description: Book updated successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */
//book update
booksRouter.put("/:bookId", authenticateToken, [validateCreateBookData], async (req, res) => {
  const bookId = req.params.bookId;
  const updatedBook = {
    ...req.body,
    updated_at: new Date(),
  };

  try {
    const bookResult = await connectionPool.query(
      "SELECT * FROM books WHERE book_id = $1",
      [bookId]
    );

    if (bookResult.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    const book = bookResult.rows[0];

    if (book.user_id !== req.user.user_id) {
      return res.status(403).json({ message: "You do not have permission to edit this book." });
    }

    const result = await connectionPool.query(
      `UPDATE books
       SET title = $2,
           author = $3,
           category_id = $4,
           description = $5,
           book_name = $6,
           updated_at = $7
       WHERE book_id = $1
       RETURNING *`,
      [
        bookId,
        updatedBook.title,
        updatedBook.author,
        updatedBook.category_id,
        updatedBook.description,
        updatedBook.book_name,     
        updatedBook.updated_at
      ]
    );

    return res.status(200).json({
      message: "The book has been updated successfully.",
      book: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating book:", error.message);
    res.status(500).json({ error: "An error occurred from the server." });
  }
});


/**
 * @swagger
 * /books/{bookId}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the book to delete
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */
// Delete Book
booksRouter.delete("/:bookId", authenticateToken, async (req, res) => {
  const bookId = req.params.bookId;

  try {
    // 🔍 ดึงข้อมูลหนังสือมาก่อน
    const bookResult = await connectionPool.query(
      "SELECT * FROM books WHERE book_id = $1",
      [bookId]
    );

    if (bookResult.rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบหนังสือที่ต้องการลบ" });
    }

    const book = bookResult.rows[0];

    // 🛡️ ตรวจสอบสิทธิ์การเป็นเจ้าของหนังสือ
    if (book.user_id !== req.user.user_id) {
      return res.status(403).json({ message: "คุณไม่มีสิทธิ์ลบหนังสือเล่มนี้" });
    }

    // ✅ ลบหนังสือ
    const result = await connectionPool.query(
      "DELETE FROM books WHERE book_id = $1 RETURNING *",
      [bookId]
    );

    res.json({
      message: "ลบหนังสือเรียบร้อยแล้ว",
      deleted: result.rows[0],
    });
  } catch (err) {
    console.error("Error deleting book:", err.message);
    res.status(500).json({ error: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
  }
});


