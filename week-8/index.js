const express = require('express');

const app = express();
app.set('view engine', 'ejs');

const port = 3000;

// app.[method]('/[path]', (req, res) => {
//     res.send('[response]');
// });

app.get('/', (req, res) => {
    const data = { name: 'Sila', age: 25 };
    res.render('home', data);
});

app.get('/hobby', (req, res) => {
    let hobbydata = {
        name: 'James',
        hobbies: ['playing football', 'playing chess', 'cycling']
    }
    res.render('hobby', { data: hobbydata });
});

app.post('/hello', (req, res) => {
    res.send('You just called the post method at "/hello"!\n');
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
