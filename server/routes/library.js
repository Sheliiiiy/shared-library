const { Router } = require("express");

const LIBRARY_DOC_PATH = "library/shared";
const defaultData = {
  users: ["GG", "VK"],
  books: [],
};

module.exports = function (db) {
  const router = Router();
  const docRef = db.doc(LIBRARY_DOC_PATH);

  /**
   * GET /api/library
   * Returns the current library document.
   */
  router.get("/", async (_req, res) => {
    try {
      const snap = await docRef.get();
      if (snap.exists) {
        return res.json(snap.data());
      }
      await docRef.set(defaultData);
      res.json(defaultData);
    } catch (err) {
      console.error("[GET /api/library] error:", err);
      res.status(500).json({ error: "Failed to fetch library" });
    }
  });

  /**
   * POST /api/library
   * Overwrites the entire library document.
   */
  router.post("/", async (req, res) => {
    try {
      const data = req.body;
      await docRef.set(data);
      res.json({ success: true, data });
    } catch (err) {
      console.error("[POST /api/library] error:", err);
      res.status(500).json({ error: "Failed to update library" });
    }
  });

  /**
   * POST /api/library/users
   * Adds a new user to the users array (if not already present).
   */
  router.post("/users", async (req, res) => {
    try {
      const { name } = req.body;
      if (!name || typeof name !== "string") {
        return res.status(400).json({ error: "Missing or invalid 'name' field" });
      }
      const trimmed = name.trim();
      if (!trimmed) {
        return res.status(400).json({ error: "Name cannot be empty" });
      }

      const snap = await docRef.get();
      const data = snap.exists ? snap.data() : { ...defaultData };
      const users = data.users || [];

      if (users.includes(trimmed)) {
        return res.status(409).json({ error: "User already exists" });
      }

      users.push(trimmed);
      await docRef.update({ users });
      res.json({ success: true, users });
    } catch (err) {
      console.error("[POST /api/library/users] error:", err);
      res.status(500).json({ error: "Failed to add user" });
    }
  });

  /**
   * DELETE /api/library/users/:name
   * Removes a user and all their books.
   */
  router.delete("/users/:name", async (req, res) => {
    try {
      const { name } = req.params;
      const snap = await docRef.get();
      const data = snap.exists ? snap.data() : { ...defaultData };

      let users = (data.users || []).filter((u) => u !== name);
      if (users.length === 0) {
        users = ["GG", "VK"];
      }

      const books = (data.books || []).filter((b) => b.user !== name);

      await docRef.update({ users, books });
      res.json({ success: true, users, books });
    } catch (err) {
      console.error("[DELETE /api/library/users] error:", err);
      res.status(500).json({ error: "Failed to remove user" });
    }
  });

  /**
   * POST /api/library/books
   * Adds a new book to the books array.
   */
  router.post("/books", async (req, res) => {
    try {
      const book = req.body;
      if (!book || !book.title) {
        return res.status(400).json({ error: "Missing or invalid book data" });
      }

      const snap = await docRef.get();
      const data = snap.exists ? snap.data() : { ...defaultData };
      const books = data.books || [];

      books.push(book);
      await docRef.update({ books });
      res.json({ success: true, books });
    } catch (err) {
      console.error("[POST /api/library/books] error:", err);
      res.status(500).json({ error: "Failed to add book" });
    }
  });

  /**
   * DELETE /api/library/books/:id
   * Removes a book by its id.
   */
  router.delete("/books/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const snap = await docRef.get();
      const data = snap.exists ? snap.data() : { ...defaultData };

      const books = (data.books || []).filter((b) => b.id !== id);
      await docRef.update({ books });
      res.json({ success: true, books });
    } catch (err) {
      console.error("[DELETE /api/library/books] error:", err);
      res.status(500).json({ error: "Failed to remove book" });
    }
  });

  /**
   * PATCH /api/library/books/:id
   * Updates fields of a book by its id.
   */
  router.patch("/books/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const snap = await docRef.get();
      const data = snap.exists ? snap.data() : { ...defaultData };

      const books = (data.books || []).map((b) =>
        b.id === id ? { ...b, ...updates } : b
      );
      await docRef.update({ books });
      res.json({ success: true, books });
    } catch (err) {
      console.error("[PATCH /api/library/books/:id] error:", err);
      res.status(500).json({ error: "Failed to update book" });
    }
  });

  return router;
};

