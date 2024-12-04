const express = require("express");
const { body, validationResult } = require("express-validator");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("better-sqlite3")("database.db");
const bcrypt = require("bcrypt");

const app = express();
const port = 3004;

app.use(cors());
app.use(bodyParser.json());

const createTasksTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      work TEXT NOT NULL,
      priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
      due_date TEXT NOT NULL,
      userId INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `;
  db.prepare(sql).run();
};

const createUsersTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `;
  db.prepare(sql).run();
};

createTasksTable();
createUsersTable();

app.post(
  "/register",
  [
    body("firstname").isString().trim().notEmpty(),
    body("lastname").isString().trim().notEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("confirmPassword").custom(
      (value, { req }) => value === req.body.password
    ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstname, lastname, email, password } = req.body;

    try {
      const userExists = db
        .prepare("SELECT * FROM users WHERE email = ?")
        .get(email);
      if (userExists) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = db
        .prepare(
          "INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)"
        )
        .run(firstname, lastname, email, hashedPassword);

      res.status(201).json({
        message: "User registered successfully",
        user: { id: result.lastInsertRowid, firstname, lastname, email },
      });
    } catch (error) {
      console.error("Error registering user:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const sql = `
    SELECT * FROM users WHERE email = ?
  `;
  try {
    const user = db.prepare(sql).get(email);
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        res.json({ message: "Login successful" });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error logging in: " + error.message });
  }
});

app.get("/tasks", (req, res) => {
  try {
    const tasks = db.prepare("SELECT * FROM tasks").all();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post(
  "/tasks",
  [
    body("name").isString().trim().notEmpty(),
    body("age").isInt({ min: 0 }),
    body("work").isString().trim().notEmpty(),
    body("priority").isIn(["high", "medium", "low"]),
    body("due_date").isISO8601(),
    body("userId").isInt({ min: 1 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, age, work, priority, due_date, userId } = req.body;

    try {
      const result = db
        .prepare(
          "INSERT INTO tasks (name, age, work, priority, due_date, userId) VALUES (?, ?, ?, ?, ?, ?)"
        )
        .run(name, age, work, priority, due_date, userId);

      res.status(201).json({
        id: result.lastInsertRowid,
        name,
        age,
        work,
        priority,
        due_date,
        userId,
      });
    } catch (error) {
      console.error("Error adding task:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.put(
  "/tasks/:id",
  [
    body("name").isString().trim().notEmpty(),
    body("age").isInt({ min: 0 }),
    body("work").isString().trim().notEmpty(),
    body("priority").isIn(["high", "medium", "low"]),
    body("due_date").isISO8601(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, age, work, priority, due_date } = req.body;

    try {
      const result = db
        .prepare(
          "UPDATE tasks SET name = ?, age = ?, work = ?, priority = ?, due_date = ? WHERE id = ?"
        )
        .run(name, age, work, priority, due_date, id);

      if (result.changes === 0) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.status(200).json({ id, name, age, work, priority, due_date });
    } catch (error) {
      console.error("Error updating task:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;

  try {
    const result = db.prepare("DELETE FROM tasks WHERE id = ?").run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
