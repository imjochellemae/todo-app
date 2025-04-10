const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // your MySQL username
    password: '', // your MySQL password
    database: 'todo_app'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Add a task
app.post('/tasks', (req, res) => {
    const { task, due_date } = req.body;
    const sql = 'INSERT INTO tasks (task, due_date) VALUES (?, ?)';
    db.query(sql, [task, due_date], (err, result) => {
        if (err) throw err;
        res.send({ id: result.insertId, task, due_date });
    });
});

// Get all tasks
app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Modify a task
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { task, due_date } = req.body;
    const sql = 'UPDATE tasks SET task = ?, due_date = ? WHERE id = ?';
    db.query(sql, [task, due_date, id], (err, result) => {
        if (err) throw err;
        res.send({ id, task, due_date });
    });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tasks WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.send({ id });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get('/tasks', (req, res) => {
    db.query('SELECT id, task, DATE_FORMAT(due_date, "%d-%m-%Y") AS due_date FROM tasks', (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});
