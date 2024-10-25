const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

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
        res.render('employees', { employees: rows });
    });
});

app.get('/employeee/:id', (req, res) => {
    // R : Read One by Id
    const sql = 'SELECT * FROM employees WHERE EmployeeId = ?';
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        if (!row) {
            return res.send('Employee not found');
        }

        res.render('employee-detail', { employee: row });
    });
});

app.get('/employee/create', (req, res) => {
    // Form to create a new employee
    res.render('create-employee');
});

app.post('/employees', (req, res) => {
    // C : Create
    const data = req.body;
    const sql = 'INSERT INTO employees (FirstName, LastName, Email, Phone, Title) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [data.firstName, data.lastName, data.email, data.phone, data.title], (err) => {
        if (err) {
            return console.error(err.message);
        }
        // res.send('Employee created');
        res.redirect('/employees');
    });
});

app.get('/employee/:id/update', (req, res) => {
    // Form to update an employee
    const id = req.params.id;
    const sql = 'SELECT * FROM employees WHERE EmployeeId = ?';
    db.get(sql, [id], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        if (!row) {
            return res.send('Employee not found');
        }

        res.render('update-employee', { employee: row });
    });
});

app.post('/employees/:id', (req, res) => {
    // U : Update
    const data = req.body;
    const sql = 'UPDATE employees SET FirstName = ?, LastName = ?, Email = ?, Phone = ?, Title = ? WHERE EmployeeId = ?';
    db.run(sql, [data.firstName, data.lastName, data.email, data.phone, data.title, req.params.id], (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.redirect('/employeee/' + req.params.id);
    });
});

app.get('/employee/:id/delete', (req, res) => {
    // D : Delete
    const sql = 'DELETE FROM employees WHERE EmployeeId = ?';
    db.run(sql, [req.params.id], (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.redirect('/employees');
    }
    );
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
