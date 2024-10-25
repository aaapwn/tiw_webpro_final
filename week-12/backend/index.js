const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const PORT = 3000;

const db = new sqlite3.Database('employees.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the employees database.');
})

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(cors());

// for use with post&put requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/employees', (req, res) => {
    // R : Read All
    const sql = 'SELECT * FROM employees';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        res.json(rows);
    });
});

app.get('/employee/:id', (req, res) => {
    // R : Read One by Id
    const sql = 'SELECT * FROM employees WHERE EmployeeId = ?';
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        if (!row) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(row);
    });
});

app.post('/employees', (req, res) => {
    // C : Create
    const data = req.body;
    const sql = 'INSERT INTO employees (FirstName, LastName, Email, Phone, Title) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [data.firstName, data.lastName, data.email, data.phone, data.title], (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.status(201).json({ message: 'Employee created' });
    });
});

app.put('/employee/:id', (req, res) => {
    // U : Update
    const data = req.body;
    const sql = 'UPDATE employees SET FirstName = ?, LastName = ?, Email = ?, Phone = ?, Title = ? WHERE EmployeeId = ?';
    db.run(sql, [data.firstName, data.lastName, data.email, data.phone, data.title, req.params.id], (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.json({ message: 'Employee updated' });
    });
});

app.delete('/employee/:id', (req, res) => {
    // D : Delete
    const sql = 'DELETE FROM employees WHERE EmployeeId = ?';
    db.run(sql, [req.params.id], (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.status(200).json({ message: 'Employee deleted' });
    }
    );
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
