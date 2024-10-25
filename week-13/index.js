const express = require('express');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');

const app = express();
const PORT = 3000;

app.use(sessions({
    secret: "asdfghjkl",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

app.use(cookieParser());

// middleware to check if the user is authenticated
const isAuthenicated = (req, res, next) => {
    if (req.session.name) {
        next();
    } else {
        res.status(401).send('You are not authorized');
    }
}

app.get('/', isAuthenicated, (req, res) => {
    // Read the cookie
    let visits = req.cookies.visits || 0; 
    // Set the cookie
    visits++;
    res.cookie('visits', visits, { maxAge: 1000 * 60 * 60 * 24 });

    // Read the session
    const name = req.session.name || 'Guest';

    res.send(`${name} have visited this page ${visits} times.`);
});

app.get('/login', (req, res) => {
    // Set the session
    req.session.name = "Puwit";
    res.send('Logged in');
});

app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy();
    res.send('Session destroyed');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});