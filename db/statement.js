const db = require('better-sqlite3')('database.db');

const createTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER,
        work TEXT,
        priority TEXT CHECK(priority IN ('high', 'medium', 'low')),
        due_date DATE
    )
    `;
    db.prepare(sql).run();
};


const insertUser = (name, age, work, priority, due_date) => {
    const sql = `
    INSERT INTO user (name, age, work, priority, due_date)
    VALUES (?, ?, ?, ?, ?)
    `;
    try {
        const info = db.prepare(sql).run(name, age, work, priority, due_date);
        return { id: info.lastInsertRowid };
    } catch (error) {
        throw new Error('Invalid data format');
    }
};


const getAllUsers = () => {
    const sql = `
    SELECT * FROM user
    `;
    try {
        return db.prepare(sql).all();
    } catch (error) {
        throw new Error('Error fetching users');
    }
};


const getUserById = (id) => {
    const sql = `
    SELECT * FROM user
    WHERE id = ?
    `;
    try {
        const row = db.prepare(sql).get(id);
        if (row) {
            return row;
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        throw error;
    }
};


const updateUserById = (id, name, age, work, priority, due_date) => {
    const sql = `
    UPDATE user
    SET name = ?, age = ?, work = ?, priority = ?, due_date = ?
    WHERE id = ?
    `;
    try {
        const info = db.prepare(sql).run(name, age, work, priority, due_date, id);
        if (info.changes > 0) {
            return { message: 'User updated successfully' };
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        throw new Error('Invalid data format');
    }
};


const deleteUserById = (id) => {
    const sql = `
    DELETE FROM user
    WHERE id = ?
    `;
    try {
        const info = db.prepare(sql).run(id);
        if (info.changes > 0) {
            return { message: 'User deleted successfully' };
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        throw new Error('Error deleting user');
    }
};


createTable();

module.exports = {
    insertUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
};