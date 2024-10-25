const express = require('express');

const PORT = 8000;

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/employees', (req, res) => {
    // R : Read All
    fetch('http://localhost:3000/employees')
        .then(response => response.json())
        .then(data => {
            res.render('employees', { employees: data });
        });
});

app.get('/employee/:id', (req, res) => {
    // R : Read One by Id
    fetch(`http://localhost:3000/employee/${req.params.id}`)
        .then(response => response.json())
        .then(data => {
            res.render('employee-detail', { employee: data });
        });
});

app.get('/employees/create', (req, res) => {
    res.render('create-employee');
});

app.get('/employee/:id/update', (req, res) => {
    // Form to update an employee
    const id = req.params.id;
    fetch(`http://localhost:3000/employee/${id}`)
        .then(response => response.json())
        .then(data => {
            res.render('update-employee', { employee: data });
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
